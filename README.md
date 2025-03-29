# Invoice Generator

A modern, professional invoice generator built with React and TypeScript. Create, preview, and send beautiful invoices with integrated PayPal payment support.

![Invoice Generator Preview](https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?w=800&h=400&fit=crop)

## Features

- 🎨 Beautiful, responsive design with light/dark mode
- 💰 Multiple currency support
- 📱 Mobile-friendly interface
- 🏢 Business and client information management
- 📊 Dynamic line items with automatic calculations
- 💳 PayPal.me integration for easy payments
- 📷 Company logo upload support
- 🖨️ PDF generation and download
- 📧 Email invoice sharing
- 📱 QR code generation for quick payments
- 🌙 "Under the table" mode with tax handling
- 🔢 Automatic invoice numbering
- 📝 Custom notes support

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- jsPDF (PDF generation)
- QR Code generation
- Lucide React (icons)
- React Hot Toast (notifications)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Creating an Invoice

1. Fill in your business information:
   - Company name
   - Email
   - Address
   - PayPal.me link
   - Upload company logo (optional)

2. Add client information:
   - Client name
   - Email
   - Address

3. Customize invoice details:
   - Invoice number (auto-generated)
   - Date
   - Due date
   - Currency

4. Add line items:
   - Description
   - Quantity
   - Unit price
   - (Total is calculated automatically)

5. Set tax rate (optional)

### Preview and Send

- Click "Preview Invoice" to see how it looks
- Download as PDF
- Send via email
- Share PayPal payment link with QR code

### Special Features

- **Dark Mode**: Toggle between light and dark themes
- **"Under the Table" Mode**: Special mode for informal transactions
- **Currency Support**: Multiple currency options available
- **QR Code**: Automatically generated for PayPal payments
- **Responsive Design**: Works on all devices

## Development

### Project Structure

```
src/
├── components/         # React components
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

### Key Components

- `InvoiceForm`: Main form for creating invoices
- `InvoicePreview`: Preview and actions for completed invoices
- `CurrencySelector`: Currency selection component
- `LogoUpload`: Company logo upload handler

### Utilities

- `pdf.ts`: PDF generation using jsPDF
- `qrcode.ts`: QR code generation for payments
- `currencies.ts`: Currency formatting and options
- `email.ts`: Email handling functions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- PDF generation by [jsPDF](https://github.com/parallax/jsPDF)
- QR Code generation by [qrcode](https://github.com/soldair/node-qrcode)
