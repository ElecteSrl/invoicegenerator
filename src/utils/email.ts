import { InvoiceData } from '../types';
import { generatePDF } from './pdf';
import toast from 'react-hot-toast';

export const sendInvoiceEmail = async (data: InvoiceData): Promise<void> => {
  try {
    const pdf = generatePDF(data);
    const pdfBlob = pdf.output('blob');

    const emailData = {
      to: data.clientInfo.email,
      subject: `Invoice ${data.invoiceDetails.number} from ${data.businessInfo.name}`,
      body: `Dear ${data.clientInfo.name},\n\nPlease find attached the invoice ${data.invoiceDetails.number}.\n\nBest regards,\n${data.businessInfo.name}`,
      attachment: pdfBlob,
    };

    // There is no mail service behind this app: the send is simulated.
    console.info('Simulated email', { to: emailData.to, subject: emailData.subject });
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Email sent successfully (simulated)');
  } catch (error) {
    console.error('Error sending email:', error);
    toast.error('Failed to send email');
    throw error;
  }
};