import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send, Download } from 'lucide-react';
import { InvoiceData, LineItem, BusinessInfo, ClientInfo, InvoiceDetails } from '../types';
import { downloadPDF } from '../utils/pdf';
import toast from 'react-hot-toast';
import LogoUpload from './LogoUpload';
import CurrencySelector from './CurrencySelector';
import { formatCurrency } from '../utils/currencies';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
  initialData: InvoiceData | null;
  blackMode: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit, initialData, blackMode }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    email: '',
    address: '',
    paypalMe: '',
  });

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    email: '',
    address: '',
  });

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const [taxRate, setTaxRate] = useState<number>(10);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setBusinessInfo(initialData.businessInfo);
      setClientInfo(initialData.clientInfo);
      setInvoiceDetails(initialData.invoiceDetails);
      setLineItems(initialData.lineItems);
      setTaxRate(initialData.taxRate);
    }
  }, [initialData]);

  useEffect(() => {
    if (blackMode) {
      setTaxRate(0);
    }
  }, [blackMode]);

  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
    if (errors[`business_${field}`]) {
      setErrors(prev => ({ ...prev, [`business_${field}`]: '' }));
    }
  };

  const handleLogoChange = (logo: string) => {
    setBusinessInfo(prev => ({ ...prev, logo }));
  };

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
    if (errors[`client_${field}`]) {
      setErrors(prev => ({ ...prev, [`client_${field}`]: '' }));
    }
  };

  const handleInvoiceDetailsChange = (field: keyof InvoiceDetails, value: string) => {
    setInvoiceDetails(prev => ({ ...prev, [field]: value }));
    if (errors[`invoice_${field}`]) {
      setErrors(prev => ({ ...prev, [`invoice_${field}`]: '' }));
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newLineItems = [...lineItems];
    const item = { ...newLineItems[index] };

    if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value);
      item.total = item.quantity * item.unitPrice;
    } else {
      item[field as 'description'] = value as string;
    }

    newLineItems[index] = item;
    setLineItems(newLineItems);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!businessInfo.name) newErrors.business_name = 'Business name is required';
    if (!businessInfo.email) newErrors.business_email = 'Business email is required';
    if (!businessInfo.address) newErrors.business_address = 'Business address is required';
    if (!businessInfo.paypalMe) {
      newErrors.business_paypalMe = 'PayPal.me link is required';
    } else if (!businessInfo.paypalMe.match(/^https?:\/\/(www\.)?paypal\.me\/[a-zA-Z0-9-]+\/?$/)) {
      newErrors.business_paypalMe = 'Invalid PayPal.me link format (e.g., https://paypal.me/username)';
    }

    if (!clientInfo.name) newErrors.client_name = 'Client name is required';
    if (!clientInfo.email) newErrors.client_email = 'Client email is required';
    if (!clientInfo.address) newErrors.client_address = 'Client address is required';

    if (!invoiceDetails.number) newErrors.invoice_number = 'Invoice number is required';
    if (!invoiceDetails.date) newErrors.invoice_date = 'Invoice date is required';
    if (!invoiceDetails.dueDate) newErrors.invoice_dueDate = 'Due date is required';

    if (lineItems.length === 0) {
      newErrors.lineItems = 'At least one line item is required';
    } else {
      lineItems.forEach((item, index) => {
        if (!item.description) newErrors[`lineItem_${index}_description`] = 'Description is required';
        if (item.quantity <= 0) newErrors[`lineItem_${index}_quantity`] = 'Quantity must be greater than 0';
        if (item.unitPrice < 0) newErrors[`lineItem_${index}_unitPrice`] = 'Unit price cannot be negative';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (action: 'send' | 'download') => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const invoiceData: InvoiceData = {
        businessInfo,
        clientInfo,
        invoiceDetails,
        lineItems,
        taxRate,
        subtotal,
        taxAmount,
        total,
      };

      if (action === 'send') {
        onSubmit(invoiceData);
      } else {
        downloadPDF(invoiceData);
        toast.success('PDF downloaded successfully');
      }
    } catch (error) {
      console.error('Error processing invoice:', error);
      toast.error('Failed to process invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${blackMode ? 'bg-black' : 'bg-white'} border border-black rounded-lg p-6`}>
      {/* Business Information */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-4`}>
          Business Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Business Name
            </label>
            <input
              type="text"
              value={businessInfo.name}
              onChange={(e) => handleBusinessInfoChange('name', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.business_name ? 'border-red-500' : ''}`}
            />
            {errors.business_name && (
              <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Email
            </label>
            <input
              type="email"
              value={businessInfo.email}
              onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.business_email ? 'border-red-500' : ''}`}
            />
            {errors.business_email && (
              <p className="mt-1 text-sm text-red-600">{errors.business_email}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              PayPal.me Link
            </label>
            <input
              type="text"
              value={businessInfo.paypalMe}
              onChange={(e) => handleBusinessInfoChange('paypalMe', e.target.value)}
              placeholder="https://paypal.me/username"
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.business_paypalMe ? 'border-red-500' : ''}`}
            />
            {errors.business_paypalMe && (
              <p className="mt-1 text-sm text-red-600">{errors.business_paypalMe}</p>
            )}
          </div>
          <div>
            <LogoUpload
              currentLogo={businessInfo.logo}
              onLogoChange={handleLogoChange}
              blackMode={blackMode}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Address
            </label>
            <textarea
              value={businessInfo.address}
              onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.business_address ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.business_address && (
              <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-4`}>
          Client Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Client Name
            </label>
            <input
              type="text"
              value={clientInfo.name}
              onChange={(e) => handleClientInfoChange('name', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.client_name ? 'border-red-500' : ''}`}
            />
            {errors.client_name && (
              <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Email
            </label>
            <input
              type="email"
              value={clientInfo.email}
              onChange={(e) => handleClientInfoChange('email', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.client_email ? 'border-red-500' : ''}`}
            />
            {errors.client_email && (
              <p className="mt-1 text-sm text-red-600">{errors.client_email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Address
            </label>
            <textarea
              value={clientInfo.address}
              onChange={(e) => handleClientInfoChange('address', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.client_address ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.client_address && (
              <p className="mt-1 text-sm text-red-600">{errors.client_address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-4`}>
          Invoice Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceDetails.number}
              onChange={(e) => handleInvoiceDetailsChange('number', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.invoice_number ? 'border-red-500' : ''}`}
            />
            {errors.invoice_number && (
              <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Date
            </label>
            <input
              type="date"
              value={invoiceDetails.date}
              onChange={(e) => handleInvoiceDetailsChange('date', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.invoice_date ? 'border-red-500' : ''}`}
            />
            {errors.invoice_date && (
              <p className="mt-1 text-sm text-red-600">{errors.invoice_date}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
              Due Date
            </label>
            <input
              type="date"
              value={invoiceDetails.dueDate}
              onChange={(e) => handleInvoiceDetailsChange('dueDate', e.target.value)}
              className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                blackMode ? 'bg-black text-white' : 'bg-white text-black'
              } ${errors.invoice_dueDate ? 'border-red-500' : ''}`}
            />
            {errors.invoice_dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.invoice_dueDate}</p>
            )}
          </div>
          <div>
            <CurrencySelector
              value={invoiceDetails.currency}
              onChange={(currency) => handleInvoiceDetailsChange('currency', currency)}
              blackMode={blackMode}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'}`}>
            Line Items
          </h2>
          <button
            onClick={addLineItem}
            className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
              blackMode ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-900'
            } transition-colors duration-200`}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>
        {errors.lineItems && (
          <p className="mb-4 text-sm text-red-600">{errors.lineItems}</p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black">
            <thead>
              <tr>
                <th className={`px-6 py-3 ${blackMode ? 'bg-black' : 'bg-white'} text-left text-xs font-medium ${blackMode ? 'text-white' : 'text-black'} uppercase tracking-wider`}>
                  Description
                </th>
                <th className={`px-6 py-3 ${blackMode ? 'bg-black' : 'bg-white'} text-right text-xs font-medium ${blackMode ? 'text-white' : 'text-black'} uppercase tracking-wider`}>
                  Quantity
                </th>
                <th className={`px-6 py-3 ${blackMode ? 'bg-black' : 'bg-white'} text-right text-xs font-medium ${blackMode ? 'text-white' : 'text-black'} uppercase tracking-wider`}>
                  Unit Price
                </th>
                <th className={`px-6 py-3 ${blackMode ? 'bg-black' : 'bg-white'} text-right text-xs font-medium ${blackMode ? 'text-white' : 'text-black'} uppercase tracking-wider`}>
                  Total
                </th>
                <th className={`px-6 py-3 ${blackMode ? 'bg-black' : 'bg-white'} text-right text-xs font-medium ${blackMode ? 'text-white' : 'text-black'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${blackMode ? 'bg-black' : 'bg-white'} divide-y divide-black`}>
              {lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                        blackMode ? 'bg-black text-white' : 'bg-white text-black'
                      } ${errors[`lineItem_${index}_description`] ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors[`lineItem_${index}_description`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`lineItem_${index}_description`]}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                      className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                        blackMode ? 'bg-black text-white' : 'bg-white text-black'
                      } ${errors[`lineItem_${index}_quantity`] ? 'border-red-500' : ''}`}
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors[`lineItem_${index}_quantity`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`lineItem_${index}_quantity`]}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(index, 'unitPrice', Number(e.target.value))}
                      className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                        blackMode ? 'bg-black text-white' : 'bg-white text-black'
                      } ${errors[`lineItem_${index}_unitPrice`] ? 'border-red-500' : ''}`}
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                    {errors[`lineItem_${index}_unitPrice`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`lineItem_${index}_unitPrice`]}
                      </p>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right ${blackMode ? 'text-white' : 'text-black'}`}>
                    {formatCurrency(item.total, invoiceDetails.currency)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeLineItem(index)}
                      className={`${blackMode ? 'text-white hover:text-red-400' : 'text-black hover:text-red-600'} disabled:opacity-50`}
                      disabled={isSubmitting || lineItems.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className={`text-lg font-semibold ${blackMode ? 'text-white' : 'text-black'} mb-4`}>
          Summary
        </h2>
        <div className={`${blackMode ? 'bg-black' : 'bg-white'} border border-black p-4 rounded-md`}>
          <div className="flex justify-between items-center mb-2">
            <span className={blackMode ? 'text-white' : 'text-black'}>Subtotal</span>
            <span className={`${blackMode ? 'text-white' : 'text-black'} font-medium`}>
              {formatCurrency(subtotal, invoiceDetails.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className={blackMode ? 'text-white' : 'text-black'}>Tax</span>
              {blackMode ? (
                <span className="ml-2 text-sm text-gray-400 italic">
                  Switch to regular mode to add tax 📋
                </span>
              ) : (
                <>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className={`ml-2 block w-16 rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
                      blackMode ? 'bg-black text-white' : 'bg-white text-black'
                    }`}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={isSubmitting || blackMode}
                  />
                  <span className={`${blackMode ? 'text-white' : 'text-black'} ml-1`}>%</span>
                </>
              )}
            </div>
            <span className={`${blackMode ? 'text-white' : 'text-black'} font-medium`}>
              {formatCurrency(taxAmount, invoiceDetails.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className={blackMode ? 'text-white' : 'text-black'}>Total</span>
            <span className={blackMode ? 'text-white' : 'text-black'}>
              {formatCurrency(total, invoiceDetails.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => handleSubmit('send')}
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
            blackMode ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-900'
          } transition-colors duration-200`}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Sending...' : 'Preview Invoice'}
        </button>
        <button
          onClick={() => handleSubmit('download')}
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md ${
            blackMode ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-black hover:bg-gray-900'
          } transition-colors duration-200`}
        >
          <Download className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;