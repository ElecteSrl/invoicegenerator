import React from 'react';
import { Download, Send, PenSquare } from 'lucide-react';
import { InvoiceData } from '../types';
import { downloadPDF } from '../utils/pdf';
import { generatePaymentQRCode } from '../utils/qrcode';
import { formatCurrency } from '../utils/currencies';
import toast from 'react-hot-toast';

interface InvoicePreviewProps {
  data: InvoiceData | null;
  onEdit: () => void;
  blackMode: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, onEdit, blackMode }) => {
  const [qrCode, setQrCode] = React.useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      if (data) {
        const qrCodeData = await generatePaymentQRCode(
          data.total,
          data.invoiceDetails.currency,
          data.invoiceDetails.number,
          data.businessInfo.paypalMe
        );
        setQrCode(qrCodeData);
      }
    };
    generateQR();
  }, [data]);

  if (!data) {
    return (
      <div className={`${blackMode ? 'bg-black' : 'bg-white'} border border-black rounded-lg p-6 text-center`}>
        <p className={blackMode ? 'text-white' : 'text-black'}>
          No invoice data available. Please fill out the form first.
        </p>
        <button
          onClick={onEdit}
          className="mt-4 inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      downloadPDF({ ...data, qrCode });
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Invoice ${data.invoiceDetails.number} from ${data.businessInfo.name}`);
    const body = encodeURIComponent(`Dear ${data.clientInfo.name},\n\nPlease find attached the invoice ${data.invoiceDetails.number}.\n\nBest regards,\n${data.businessInfo.name}`);
    const mailtoLink = `mailto:${data.clientInfo.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={`${blackMode ? 'bg-black' : 'bg-white'} border border-black rounded-lg p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Actions */}
        <div className="flex justify-end space-x-4 mb-8">
          <button
            onClick={onEdit}
            className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
              blackMode
                ? 'text-white bg-black hover:bg-white hover:text-black'
                : 'text-black bg-white hover:bg-black hover:text-white'
            } transition-colors duration-200`}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleSendEmail}
            className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
              blackMode ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-900'
            } transition-colors duration-200`}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </button>
          <button
            onClick={handleDownload}
            className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
              blackMode ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-900'
            } transition-colors duration-200`}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>

        {/* Preview Header */}
        <div className="border-b border-black pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-4xl font-bold ${blackMode ? 'text-white' : 'text-black'}`}>INVOICE</h1>
              <p className={blackMode ? 'text-white' : 'text-black'}>#{data.invoiceDetails.number}</p>
            </div>
            <div className="text-right">
              <div className={blackMode ? 'text-white' : 'text-black'}>
                <p>Issue Date: {data.invoiceDetails.date}</p>
                <p>Due Date: {data.invoiceDetails.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business & Client Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-2`}>From</h2>
            <div className={blackMode ? 'text-white' : 'text-black'}>
              <p className="font-medium">{data.businessInfo.name}</p>
              <p>{data.businessInfo.email}</p>
              <p className="whitespace-pre-line">{data.businessInfo.address}</p>
            </div>
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-2`}>To</h2>
            <div className={blackMode ? 'text-white' : 'text-black'}>
              <p className="font-medium">{data.clientInfo.name}</p>
              <p>{data.clientInfo.email}</p>
              <p className="whitespace-pre-line">{data.clientInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <table className="min-w-full mb-8">
          <thead>
            <tr className="border-b border-black">
              <th className={`text-left py-3 px-4 ${blackMode ? 'text-white' : 'text-black'} text-sm font-semibold`}>Description</th>
              <th className={`text-right py-3 px-4 ${blackMode ? 'text-white' : 'text-black'} text-sm font-semibold`}>Quantity</th>
              <th className={`text-right py-3 px-4 ${blackMode ? 'text-white' : 'text-black'} text-sm font-semibold`}>Unit Price</th>
              <th className={`text-right py-3 px-4 ${blackMode ? 'text-white' : 'text-black'} text-sm font-semibold`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, index) => (
              <tr key={index} className="border-b border-black/20">
                <td className={`py-4 px-4 ${blackMode ? 'text-white' : 'text-black'}`}>{item.description}</td>
                <td className={`py-4 px-4 text-right ${blackMode ? 'text-white' : 'text-black'}`}>{item.quantity}</td>
                <td className={`py-4 px-4 text-right ${blackMode ? 'text-white' : 'text-black'}`}>
                  {formatCurrency(item.unitPrice, data.invoiceDetails.currency)}
                </td>
                <td className={`py-4 px-4 text-right ${blackMode ? 'text-white' : 'text-black'}`}>
                  {formatCurrency(item.total, data.invoiceDetails.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary and QR Code */}
        <div className="border-t border-black pt-8 flex justify-between items-start">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span className={blackMode ? 'text-white' : 'text-black'}>Subtotal</span>
              <span className={blackMode ? 'text-white' : 'text-black'}>
                {formatCurrency(data.subtotal, data.invoiceDetails.currency)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={blackMode ? 'text-white' : 'text-black'}>Tax ({data.taxRate}%)</span>
              <span className={blackMode ? 'text-white' : 'text-black'}>
                {formatCurrency(data.taxAmount, data.invoiceDetails.currency)}
              </span>
            </div>
            <div className="flex justify-between border-t border-black pt-2 mt-2">
              <span className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'}`}>Total</span>
              <span className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'}`}>
                {formatCurrency(data.total, data.invoiceDetails.currency)}
              </span>
            </div>
          </div>
          
          {/* QR Code */}
          {qrCode && (
            <div className="text-center">
              <h3 className={`text-sm font-medium mb-2 ${blackMode ? 'text-white' : 'text-black'}`}>
                Scan to Pay with PayPal
              </h3>
              <img
                src={qrCode}
                alt="Payment QR Code"
                className="w-32 h-32 mx-auto"
              />
              <p className={`text-xs mt-2 ${blackMode ? 'text-white/70' : 'text-black/70'}`}>
                Scan with your PayPal app
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {data.invoiceDetails.notes && (
          <div className="mt-8">
            <h2 className={`text-lg font-semibold mb-2 ${blackMode ? 'text-white' : 'text-black'}`}>Notes</h2>
            <p className={`whitespace-pre-line ${blackMode ? 'text-white' : 'text-black'}`}>{data.invoiceDetails.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-12 text-center text-sm ${blackMode ? 'text-white' : 'text-black'}`}>
          <p>Thank you for your business!</p>
          <p>Payment is due within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;