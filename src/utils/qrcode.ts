import QRCode from 'qrcode';

const createPayPalPaymentUrl = (
  amount: number,
  currency: string,
  paypalMe: string | undefined,
  invoiceNumber: string
): string => {
  if (!paypalMe) {
    throw new Error('PayPal.me link is required');
  }

  // Extract username from PayPal.me link
  const username = paypalMe.replace(/^https?:\/\/(www\.)?paypal\.me\//i, '').split('/')[0];
  if (!username) {
    throw new Error('Invalid PayPal.me link');
  }

  // Create the payment URL
  const baseUrl = `https://paypal.me/${username}`;
  const paymentUrl = `${baseUrl}/${amount.toFixed(2)}${currency}`;
  const note = `?note=Invoice ${invoiceNumber}`;
  
  return `${paymentUrl}${note}`;
};

export const generatePaymentQRCode = async (
  amount: number,
  currency: string,
  invoiceNumber: string,
  paypalMe?: string
): Promise<string> => {
  try {
    if (!paypalMe) {
      console.warn('No PayPal.me link provided');
      return '';
    }

    // Create PayPal.me payment URL
    const paypalUrl = createPayPalPaymentUrl(
      amount,
      currency,
      paypalMe,
      invoiceNumber
    );

    // Generate QR code with better error correction
    const qrCodeDataUrl = await QRCode.toDataURL(paypalUrl, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};