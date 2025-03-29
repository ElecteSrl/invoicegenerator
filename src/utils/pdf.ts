import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceData, LineItem } from '../types';

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const generatePDF = (data: InvoiceData & { qrCode?: string }): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPos = 20;

  // Add logo if exists
  if (data.businessInfo.logo) {
    pdf.addImage(data.businessInfo.logo, 'JPEG', 20, yPos, 40, 40);
    yPos += 45;
  }

  // Header
  pdf.setFontSize(24);
  pdf.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  pdf.setFontSize(12);
  pdf.text(`Invoice #: ${data.invoiceDetails.number}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;
  pdf.text(`Date: ${data.invoiceDetails.date}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;
  pdf.text(`Due Date: ${data.invoiceDetails.dueDate}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 15;

  // Business Info
  pdf.setFontSize(14);
  pdf.text('From:', 20, yPos);
  yPos += 7;
  pdf.setFontSize(12);
  pdf.text(data.businessInfo.name, 20, yPos);
  yPos += 7;
  pdf.text(data.businessInfo.email, 20, yPos);
  yPos += 7;
  const businessAddressLines = data.businessInfo.address.split('\n');
  businessAddressLines.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 7;
  });
  yPos += 7;

  // Client Info
  pdf.setFontSize(14);
  pdf.text('Bill To:', 20, yPos);
  yPos += 7;
  pdf.setFontSize(12);
  pdf.text(data.clientInfo.name, 20, yPos);
  yPos += 7;
  pdf.text(data.clientInfo.email, 20, yPos);
  yPos += 7;
  const clientAddressLines = data.clientInfo.address.split('\n');
  clientAddressLines.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 7;
  });
  yPos += 10;

  // Line Items
  const tableHeaders = [['Description', 'Quantity', 'Unit Price', 'Total']];
  const tableBody = data.lineItems.map((item: LineItem) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice, data.invoiceDetails.currency),
    formatCurrency(item.total, data.invoiceDetails.currency),
  ]);

  autoTable(pdf, {
    head: tableHeaders,
    body: tableBody,
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0] },
    styles: { fontSize: 10 },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 20;

  // Summary
  pdf.setFontSize(12);
  pdf.text('Subtotal:', pageWidth - 80, yPos);
  pdf.text(formatCurrency(data.subtotal, data.invoiceDetails.currency), pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;

  pdf.text(`Tax (${data.taxRate}%):`, pageWidth - 80, yPos);
  pdf.text(formatCurrency(data.taxAmount, data.invoiceDetails.currency), pageWidth - 20, yPos, { align: 'right' });
  yPos += 7;

  pdf.setFontSize(14);
  pdf.text('Total:', pageWidth - 80, yPos);
  pdf.text(formatCurrency(data.total, data.invoiceDetails.currency), pageWidth - 20, yPos, { align: 'right' });
  yPos += 20;

  // Add QR Code if available
  if (data.qrCode) {
    pdf.addImage(data.qrCode, 'PNG', pageWidth - 60, yPos, 40, 40);
    yPos += 45;
    pdf.setFontSize(10);
    pdf.text('Scan to Pay', pageWidth - 40, yPos, { align: 'center' });
    yPos += 10;
  }

  // Notes
  if (data.invoiceDetails.notes) {
    pdf.setFontSize(12);
    pdf.text('Notes:', 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    const notesLines = data.invoiceDetails.notes.split('\n');
    notesLines.forEach(line => {
      pdf.text(line, 20, yPos);
      yPos += 5;
    });
  }

  // Footer
  pdf.setFontSize(10);
  pdf.text('Thank you for your business!', pageWidth / 2, pdf.internal.pageSize.height - 20, {
    align: 'center',
  });

  return pdf;
};

export const downloadPDF = (data: InvoiceData & { qrCode?: string }): void => {
  const pdf = generatePDF(data);
  pdf.save(`invoice-${data.invoiceDetails.number}.pdf`);
};