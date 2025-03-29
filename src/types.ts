export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BusinessInfo {
  name: string;
  email: string;
  address: string;
  logo?: string;
  paypalMe?: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
}

export interface InvoiceDetails {
  number: string;
  date: string;
  dueDate: string;
  notes?: string;
  currency: string;
  paymentQRCode?: string;
}

export interface InvoiceData {
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
  invoiceDetails: InvoiceDetails;
  lineItems: LineItem[];
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}