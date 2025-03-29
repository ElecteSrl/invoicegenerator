import React, { useState } from 'react';
import { FileText, Moon, Sun } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { InvoiceData } from './types';
import { sampleInvoiceData } from './utils/sampleData';

function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(sampleInvoiceData);
  const [blackMode, setBlackMode] = useState(false);

  const handleInvoiceDataUpdate = (data: InvoiceData) => {
    setInvoiceData(data);
    if (activeTab === 'form') {
      setActiveTab('preview');
    }
  };

  return (
    <div className={`min-h-screen ${blackMode ? 'bg-black' : 'bg-white'}`}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className={`${blackMode ? 'bg-black' : 'bg-white'} border-b border-black`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className={`h-8 w-8 ${blackMode ? 'text-white' : 'text-black'}`} />
              <h1 className={`ml-2 text-2xl font-semibold ${blackMode ? 'text-white' : 'text-black'}`}>
                Invoice Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBlackMode(!blackMode)}
                className={`px-4 py-2 rounded-md border border-black flex items-center space-x-2 ${
                  blackMode
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                } transition-colors duration-200`}
                title={blackMode ? 'Switch to regular mode' : 'Switch to "under the table" mode 🤫'}
              >
                {blackMode ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Regular Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Black Mode 🤫</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 rounded-md border ${
                  activeTab === 'form'
                    ? 'bg-black text-white border-black'
                    : `${blackMode ? 'bg-black text-white' : 'bg-white text-black'} border-black hover:bg-black hover:text-white`
                } transition-colors duration-200`}
              >
                Form
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md border ${
                  activeTab === 'preview'
                    ? 'bg-black text-white border-black'
                    : `${blackMode ? 'bg-black text-white' : 'bg-white text-black'} border-black hover:bg-black hover:text-white`
                } transition-colors duration-200`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'form' ? (
          <InvoiceForm onSubmit={handleInvoiceDataUpdate} initialData={invoiceData} blackMode={blackMode} />
        ) : (
          <InvoicePreview data={invoiceData} onEdit={() => setActiveTab('form')} blackMode={blackMode} />
        )}
      </main>
    </div>
  );
}

export default App;