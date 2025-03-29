import { InvoiceData } from '../types';

export const sampleInvoiceData: InvoiceData = {
  businessInfo: {
    name: 'Tech Solutions Inc.',
    email: 'billing@techsolutions.com',
    address: '123 Business Avenue\nSuite 100\nSan Francisco, CA 94105',
    logo: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?w=100&h=100&fit=crop',
    paypalMe: 'https://paypal.me/techsolutions',
  },
  clientInfo: {
    name: 'Acme Corporation',
    email: 'accounts@acme.com',
    address: '456 Corporate Drive\nFloor 15\nNew York, NY 10001',
  },
  invoiceDetails: {
    number: 'INV-2024-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Payment is due within 30 days. Please include the invoice number with your payment.',
    currency: 'USD',
  },
  lineItems: [
    {
      description: 'Website Development',
      quantity: 1,
      unitPrice: 5000,
      total: 5000,
    },
    {
      description: 'UI/UX Design',
      quantity: 2,
      unitPrice: 1500,
      total: 3000,
    },
    {
      description: 'Content Creation',
      quantity: 10,
      unitPrice: 100,
      total: 1000,
    },
  ],
  taxRate: 10,
  subtotal: 9000,
  taxAmount: 900,
  total: 9900,
};