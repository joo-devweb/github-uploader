
import React, { useState, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
}

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps): React.ReactNode {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type === 'application/zip') {
        setFileName(file.name);
        onFileSelect(file);
    } else {
        setFileName(null);
        onFileSelect(null);
        if (file) { // Only alert if a file was selected but was invalid
          alert('Please select a valid .zip file.');
        }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
     if (file && file.type === 'application/zip') {
        setFileName(file.name);
        onFileSelect(file);
        if(fileInputRef.current) {
          fileInputRef.current.files = event.dataTransfer.files;
        }
    } else {
        setFileName(null);
        onFileSelect(null);
        alert('Please select a valid .zip file.');
    }
  };

  return (
    <div>
      <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
        2. Select ZIP File
      </label>
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-gray-400 focus:outline-none'}`}
      >
        <span className="flex items-center space-x-2">
          <UploadIcon className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-gray-600">
            {fileName || (
              <>
                Drop a <span className="text-blue-600">.zip</span> file or click to browse
              </>
            )}
          </span>
        </span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          ref={fileInputRef}
        />
      </label>
    </div>
  );
}