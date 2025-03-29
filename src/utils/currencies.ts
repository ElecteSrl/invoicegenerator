import { Currency } from '../types';

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  // Ensure we have a valid currency code
  if (!currencyCode || typeof currencyCode !== 'string') {
    console.warn('Invalid currency code provided, falling back to USD');
    currencyCode = 'USD';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback to basic formatting with USD
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};