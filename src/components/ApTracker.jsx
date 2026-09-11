import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  FileSpreadsheet, 
  UploadCloud, 
  History,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import DataTable from './common/DataTable';
import FilterBar from './common/FilterBar';
import UploadModal from './common/UploadModal';
import ExportModal from './common/ExportModal';

export default function ApTracker() {
  const { invoices, searchQuery, filters, bulkApprove, bulkDelete, showToast } = useApp();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const columns = [
    { field: 'id', header: 'Invoice ID', render: (val) => <span className="font-mono text-slate-400 font-bold">{val}</span> },
    { field: 'vendorName', header: 'Vendor Name', render: (val) => <span className="font-semibold text-slate-100">{val}</span> },
    { field: 'invoiceNumber', header: 'Invoice #', render: (val) => <span className="font-bold text-blue-400 font-mono">{val}</span> },
    { field: 'poNumber', header: 'PO Number', render: (val) => <span className="font-mono text-slate-300">{val}</span> },
    { field: 'plant', header: 'Plant', render: (val) => <span className="text-slate-300 font-medium">{val}</span> },
    { field: 'totalAmount', header: 'Gross Amount', align: 'right', render: (val) => <span className="font-bold text-emerald-400">₹{val.toLocaleString('en-IN')}</span> },
    { field: 'status', header: 'MIRO Status', render: (val) => (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${val.includes('Parked') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
        {val}
      </span>
    )},
    { field: 'miroDocNumber', header: 'MIRO Doc #', render: (val) => <span className="font-mono text-slate-300">{val || 'Pending'}</span> },
    { field: 'migoDocNumber', header: 'MIGO Doc #', render: (val) => <span className="font-mono text-slate-300">{val || 'Pending'}</span> }
  ];

  const bulkActions = [
    { label: 'Bulk Approve', icon: CheckCircle2, className: 'bg-blue-600 hover:bg-blue-500 text-white', onClick: bulkApprove },
    { label: 'Bulk Delete', icon: Trash2, className: 'bg-red-600 hover:bg-red-500 text-white', onClick: bulkDelete }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <TableIcon className="w-4 h-4 text-emerald-400" />
            <span>Module 10 — Automated Master AP Tracker</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Enterprise Master AP Tracker & Excel Generator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time master ledger with version history & direct Excel (.xlsx) export
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Version History</span>
          </button>

          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Tracker</span>
          </button>

          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      <FilterBar />

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200">AP Master Tracker Grid ({invoices.length} Active Records)</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">Version: 2026.8.28</span>
        </div>

        <DataTable 
          columns={columns}
          data={invoices}
          keyField="id"
          bulkActions={bulkActions}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>

      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        uploadType="tracker"
        title="Import AP Master Tracker (.xlsx / .csv)"
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export AP Master Tracker Ledger"
      />

      {/* Version History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                Tracker Version History
              </span>
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { version: 'v2026.8.28 (Current)', date: 'Today, 00:03 AM', author: 'Rajesh Kumar', count: 1420 },
                { version: 'v2026.8.27', date: 'Yesterday, 11:45 PM', author: 'Anish Verma', count: 1412 },
                { version: 'v2026.8.26', date: '26 Aug 2026, 06:15 PM', author: 'Priya Sharma', count: 1390 }
              ].map((v, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{v.version}</div>
                    <div className="text-[10px] text-slate-400">{v.author} • {v.date}</div>
                  </div>
                  <button 
                    onClick={() => { showToast('info', `Restored Tracker ${v.version}`); setIsHistoryOpen(false); }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-semibold rounded-lg"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
