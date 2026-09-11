import React, { useState } from 'react';
import { 
  GitCompare, 
  RefreshCw, 
  ArrowRightLeft, 
  Download,
  UploadCloud,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import UploadModal from './common/UploadModal';
import ExportModal from './common/ExportModal';

export default function VendorReconciliation() {
  const { reconciliations, showToast } = useApp();
  const [reconData, setReconData] = useState(reconciliations[0] || null);
  const [isMatching, setIsMatching] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleTriggerMatch = () => {
    setIsMatching(true);
    showToast('info', 'Reconciling 500+ Vendor Statements against SAP Open Items...');
    setTimeout(() => {
      if (reconData) {
        setReconData(prev => ({ ...prev, status: 'Completed', updatedAt: new Date().toISOString() }));
      }
      setIsMatching(false);
      showToast('success', 'Automated SOA Matching Complete! 12 Matched, 1 Mismatch, 1 Missing.');
    }, 1200);
  };

  const handleSendEmailReport = () => {
    showToast('success', `Reconciliation report automatically emailed to ${reconData?.vendorName || 'Vendor'}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span>Module 8 — Vendor Statement Reconciliation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Monthly Statement vs SAP Open Items Matcher</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated comparison across 500–600 monthly vendor SOA statements with SAP clearing logs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Upload Statement PDF</span>
          </button>

          <button 
            onClick={handleTriggerMatch}
            disabled={isMatching}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-amber-600/20 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
            <span>{isMatching ? 'Reconciling 500+ Statements...' : 'Run Automated SOA Match'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {reconData && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Vendor Target</span>
            <span className="text-sm font-bold text-white mt-1 block">{reconData.vendorName}</span>
            <span className="text-[10px] text-slate-500 font-mono">{reconData.vendorCode}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Total Invoices in SOA</span>
            <span className="text-xl font-extrabold text-blue-400 mt-1 block">{reconData.statementCount}</span>
            <span className="text-[10px] text-slate-500">Period: {reconData.period}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Fully Matched & Paid</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{reconData.matchedCount}</span>
            <span className="text-[10px] text-emerald-400">Clearing doc present</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Amount Mismatches</span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">{reconData.mismatchCount}</span>
            <span className="text-[10px] text-amber-400">Price / Tax Variance</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Missing in SAP</span>
            <span className="text-xl font-extrabold text-red-400 mt-1 block">{reconData.missingInSapCount}</span>
            <span className="text-[10px] text-red-400">Requires AP Entry</span>
          </div>
        </div>
      )}

      {/* Side-by-Side Reconciliation Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-200">Reconciliation Breakdown Matrix (SOA vs SAP)</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSendEmailReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 rounded-xl border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Email Report to Vendor</span>
            </button>

            <button 
              onClick={() => setIsExportOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-medium text-emerald-300 rounded-xl border border-emerald-500/30"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Recon (.xlsx)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">SOA Invoice #</th>
                <th className="p-3.5">Statement Date</th>
                <th className="p-3.5 text-right">Statement Amount</th>
                <th className="p-3.5">SAP Invoice #</th>
                <th className="p-3.5 text-right">SAP Amount</th>
                <th className="p-3.5 font-mono">Clearing Doc #</th>
                <th className="p-3.5">Variance</th>
                <th className="p-3.5 text-right">Match Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(reconData?.items || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-blue-400 font-mono">{row.statementInv}</td>
                  <td className="p-3.5 text-slate-300">{row.date}</td>
                  <td className="p-3.5 text-right font-semibold text-slate-200">₹{row.statementAmt.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-mono text-slate-300">{row.sapInv || <span className="text-red-400 italic">None</span>}</td>
                  <td className="p-3.5 text-right font-semibold text-slate-200">
                    {row.sapAmt ? `₹${row.sapAmt.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{row.clearingDoc || 'Uncleared'}</td>
                  <td className="p-3.5 text-red-400 font-mono font-bold">
                    {row.variance > 0 ? `+₹${row.variance.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md ${
                      row.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      row.status === 'Open' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      row.status === 'Amount Mismatch' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        uploadType="statement"
        title="Upload Vendor SOA Statement PDF / Excel"
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export Vendor Statement Reconciliation Report"
      />
    </div>
  );
}
