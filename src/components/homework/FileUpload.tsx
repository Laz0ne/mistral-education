import React from 'react';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <label className="cursor-pointer p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
      <Paperclip className="w-5 h-5" />
      <input
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleChange}
      />
    </label>
  );
};
