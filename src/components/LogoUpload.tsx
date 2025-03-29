import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (logo: string) => void;
  blackMode: boolean;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ currentLogo, onLogoChange, blackMode }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl('');
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className={`block text-sm font-medium ${blackMode ? 'text-white' : 'text-black'}`}>
          Company Logo
        </label>
        {previewUrl && (
          <button
            onClick={handleRemoveLogo}
            className={`text-sm flex items-center ${
              blackMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
            }`}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative w-32 h-32">
          <img
            src={previewUrl}
            alt="Company logo"
            className="w-full h-full object-contain border border-black rounded-lg"
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
            blackMode
              ? 'border-white/30 hover:border-white/50'
              : 'border-black/30 hover:border-black/50'
          }`}
        >
          <Upload className={`h-8 w-8 ${blackMode ? 'text-white/70' : 'text-black/70'}`} />
          <span className={`mt-2 text-sm ${blackMode ? 'text-white/70' : 'text-black/70'}`}>
            Upload Logo
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className={`text-xs ${blackMode ? 'text-white/70' : 'text-black/70'}`}>
        Recommended: Square image, max 5MB
      </p>
    </div>
  );
};

export default LogoUpload;