import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ExportModal({ isOpen, onClose, reportTitle = 'Export Data' }) {
  const { showToast } = useApp();
  const [format, setFormat] = useState('xlsx');
  const [scope, setScope] = useState('filtered');

  if (!isOpen) return null;

  const handleExport = () => {
    if (format === 'xlsx') {
      window.open('/api/tracker/export', '_blank');
    }
    showToast('success', `Exporting ${reportTitle} as ${format.toUpperCase()} (${scope} scope)... Download started!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">{reportTitle}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Select Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'xlsx', name: 'Excel (.xlsx)', icon: FileSpreadsheet },
              { id: 'csv', name: 'CSV (.csv)', icon: FileText },
              { id: 'pdf', name: 'PDF Report', icon: FileText }
            ].map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                    format === f.id ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scope Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Export Scope</label>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Active Filtered View</span>
              <input type="radio" name="scope" value="filtered" checked={scope === 'filtered'} onChange={() => setScope('filtered')} />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">All Database Records</span>
              <input type="radio" name="scope" value="all" checked={scope === 'all'} onChange={() => setScope('all')} />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl">
            Cancel
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20">
            Export Now
          </button>
        </div>
      </div>
    </div>
  );
}
