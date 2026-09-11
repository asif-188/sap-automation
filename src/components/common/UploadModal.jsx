import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function UploadModal({ isOpen, onClose, uploadType = 'invoice', title = 'Upload File' }) {
  const { handleUploadFile, showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    // Size check (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds maximum 15MB limit.');
      return;
    }

    // Type check
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Unsupported file format. Please upload PDF, XLSX, or CSV.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(20);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      handleUploadFile(selectedFile.name, selectedFile.type, uploadType);
      setIsUploading(false);
      setSelectedFile(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag and Drop Area */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 bg-slate-950 transition cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200">
              Drag & Drop your invoice PDF or Excel file here
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Supports PDF, XLSX, CSV (Max 15MB)</p>
          </div>

          <label className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition">
            Browse Files
            <input type="file" onChange={handleFileChange} accept=".pdf,.xlsx,.csv" className="hidden" />
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Selected File Details */}
        {selectedFile && (
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              {selectedFile.name.endsWith('.pdf') ? <FileText className="w-5 h-5 text-red-400" /> : <FileSpreadsheet className="w-5 h-5 text-emerald-400" />}
              <div>
                <div className="font-bold text-slate-200 truncate max-w-[240px]">{selectedFile.name}</div>
                <div className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>

            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                Processing OCR & Validating Schemas...
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button 
            onClick={onClose} 
            disabled={isUploading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20"
          >
            Upload & Process Now
          </button>
        </div>
      </div>
    </div>
  );
}
