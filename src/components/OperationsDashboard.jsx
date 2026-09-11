import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileWarning, 
  Database, 
  CheckCircle2, 
  Trash2, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import DataTable from './common/DataTable';
import FilterBar from './common/FilterBar';
import ExportModal from './common/ExportModal';

export default function OperationsDashboard({ onNavigateTab }) {
  const { invoices, parkMiro, postMigo, bulkApprove, bulkDelete, searchQuery, filters } = useApp();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const columns = [
    { field: 'invoiceNumber', header: 'Invoice #', render: (val) => <span className="font-bold text-blue-400 font-mono">{val}</span> },
    { field: 'vendorName', header: 'Vendor Name', render: (val, row) => <div><div className="font-medium text-slate-200">{val}</div><div className="text-[10px] text-slate-500 font-mono">{row.vendorCode}</div></div> },
    { field: 'poNumber', header: 'PO Number', render: (val) => <span className="font-mono text-slate-300 font-semibold">{val}</span> },
    { field: 'plant', header: 'Plant', render: (val) => <span className="font-medium text-slate-300">{val}</span> },
    { field: 'totalAmount', header: 'Total Amount', align: 'right', render: (val) => <span className="font-bold text-emerald-400">₹{val.toLocaleString('en-IN')}</span> },
    { field: 'status', header: 'MIRO Status', render: (val, row) => (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${val.includes('Parked') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
        {val} {row.miroDocNumber ? `#${row.miroDocNumber}` : ''}
      </span>
    )},
    { field: 'grnStatus', header: 'MIGO Status', render: (val) => <span className="text-slate-400 font-mono text-[11px]">{val}</span> },
    { field: 'actions', header: 'Action', sortable: false, align: 'right', render: (_, row) => (
      <div className="flex items-center justify-end space-x-2">
        {!row.miroDocNumber && (
          <button 
            onClick={(e) => { e.stopPropagation(); parkMiro(row.id); }}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold"
          >
            Park MIRO
          </button>
        )}
        {row.miroDocNumber && !row.migoDocNumber && row.poType !== 'Non-PO Invoice' && (
          <button 
            onClick={(e) => { e.stopPropagation(); postMigo(row.id, 'RVS'); }}
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-semibold"
          >
            Post MIGO
          </button>
        )}
      </div>
    )}
  ];

  const bulkActions = [
    { label: 'Bulk Approve for MIRO', icon: CheckCircle2, className: 'bg-emerald-600 hover:bg-emerald-500 text-white', onClick: bulkApprove },
    { label: 'Bulk Delete', icon: Trash2, className: 'bg-red-600 hover:bg-red-500 text-white', onClick: bulkDelete }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Operations & Exception Queue Dashboard</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">AP Operational Task Monitoring</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time action items: Low-confidence OCR, SAP Parking retries, missing POs, and GRN holds
          </p>
        </div>

        <button 
          onClick={() => setIsExportOpen(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Operations Log</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Interactive Unified Data Table with Sorting, Bulk Selection, & Pagination */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Active Operational Queue ({invoices.length} Invoices)</h3>
        <DataTable 
          columns={columns}
          data={invoices}
          keyField="id"
          bulkActions={bulkActions}
          searchQuery={searchQuery}
          filters={filters}
          onRowClick={(row) => onNavigateTab && onNavigateTab('extraction')}
        />
      </div>

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export Operations Exception Log"
      />
    </div>
  );
}
