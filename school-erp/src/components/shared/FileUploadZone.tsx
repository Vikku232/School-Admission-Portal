import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

/**
 * Shared FileUploadZone matching the dashed border and drag/drop spec
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFileSelect,
  acceptedTypes = "*",
  maxSizeMB = 5 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');
    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer 
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef} 
            type="file" 
            className="hidden" 
            accept={acceptedTypes}
            onChange={handleChange} 
          />
          <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="text-sm text-slate-600 font-medium mb-1">
            <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-400">PDF, JPG, PNG up to {maxSizeMB}MB</p>
          {error && <p className="text-xs text-red-500 mt-2 font-semibold">{error}</p>}
        </div>
      ) : (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-emerald-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-emerald-700 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            onClick={clearFile}
            className="p-1.5 hover:bg-emerald-100 rounded-full text-emerald-700 transition-colors shrink-0"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
