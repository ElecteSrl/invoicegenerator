import React from 'react';
import { currencies } from '../utils/currencies';
import { Currency } from '../types';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  blackMode: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, blackMode }) => {
  return (
    <div>
      <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
        Currency
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md border-black focus:ring-black focus:border-black sm:text-sm ${
          blackMode ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        {currencies.map((currency: Currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.symbol} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;