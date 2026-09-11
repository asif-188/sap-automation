import React, { useState } from 'react';
import { 
  ClipboardList, 
  Download, 
  ShieldCheck, 
  FileSpreadsheet, 
  Calendar, 
  Clock, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import DataTable from './common/DataTable';
import FilterBar from './common/FilterBar';
import ExportModal from './common/ExportModal';

export default function ReportsAudit() {
  const { auditLogs, searchQuery, filters, showToast } = useApp();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleFreq, setScheduleFreq] = useState('Daily');

  const columns = [
    { field: 'id', header: 'Log ID', render: (val) => <span className="font-bold text-slate-400 font-mono">#{val}</span> },
    { field: 'timestamp', header: 'Timestamp', render: (val) => <span className="text-slate-400 font-mono">{new Date(val).toLocaleString()}</span> },
    { field: 'user', header: 'User / System Agent', render: (val) => <span className="font-semibold text-slate-200">{val}</span> },
    { field: 'module', header: 'Target Module', render: (val) => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{val}</span> },
    { field: 'action', header: 'Action Executed', render: (val) => <span className="text-slate-200">{val}</span> }
  ];

  const handleGenerateReport = (rptName) => {
    showToast('success', `Generated ${rptName}! File download started.`);
  };

  const handleSaveSchedule = () => {
    showToast('success', `Scheduled automatic email delivery of AP reports (${scheduleFreq})`);
    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span>Modules 16 & 22 — Governance, Audit & Reporting Center</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Enterprise Audit Trail & Custom AP Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of every AI decision, SAP BAPI call, manual override, and automated action
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsScheduleOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Schedule Automatic Delivery</span>
          </button>

          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Reports Generator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Daily Invoice Report', desc: 'Summary of ingested, parked & posted invoices', format: 'PDF / Excel' },
          { name: 'Vendor Reconciliation Report', desc: 'Monthly statement matching & variances', format: 'Excel (.xlsx)' },
          { name: 'MIRO & MIGO Posting Summary', desc: 'SAP document numbers and BAPI logs', format: 'PDF Report' },
          { name: 'Exception & Aging Report', desc: 'Held invoices, failed OCR, SLA delays', format: 'CSV Export' }
        ].map((rpt, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-slate-200">{rpt.name}</h3>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{rpt.desc}</p>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-800/80">
              <span className="text-slate-500 font-mono">{rpt.format}</span>
              <button 
                onClick={() => handleGenerateReport(rpt.name)}
                className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold rounded"
              >
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>

      <FilterBar />

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-200">System Activity Audit Trail ({auditLogs.length} Entries)</h3>
        </div>

        <DataTable 
          columns={columns}
          data={auditLogs}
          keyField="id"
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export Enterprise System Audit Trail"
      />

      {/* Schedule Report Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Schedule Automatic Email Report Delivery
              </h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recipients Email Addresses</label>
                <input type="text" defaultValue="ap-lead@enterprise.com, finance-mgr@enterprise.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Delivery Frequency</label>
                <select value={scheduleFreq} onChange={e => setScheduleFreq(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100">
                  <option value="Daily">Daily at 8:00 AM</option>
                  <option value="Weekly">Weekly (Monday 8:00 AM)</option>
                  <option value="Monthly">Monthly (1st Day of Month)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setIsScheduleOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
              <button onClick={handleSaveSchedule} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl">Save Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
