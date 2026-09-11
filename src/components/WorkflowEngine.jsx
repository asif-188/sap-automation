import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  Play, 
  FileText, 
  Database, 
  Bell, 
  BarChart2, 
  Table, 
  Download,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExportModal from './common/ExportModal';

export default function WorkflowEngine() {
  const { showToast } = useApp();
  const [selectedStep, setSelectedStep] = useState(3);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const steps = [
    { id: 1, name: 'Email Ingestion', icon: FileText, status: 'Completed', time: '0.4s', desc: 'Ingested from Outlook Exchange Server' },
    { id: 2, name: 'AI Email & Attachment Classifier', icon: FileText, status: 'Completed', time: '0.8s', desc: 'Classified as Invoice Submission (Conf: 98%)' },
    { id: 3, name: 'Document AI OCR Extraction', icon: FileText, status: 'Completed', time: '1.2s', desc: 'Extracted GSTIN, HSN, Tax & 2 Line Items' },
    { id: 4, name: 'SAP PO & Line Match', icon: Database, status: 'Completed', time: '0.6s', desc: 'Validated PO 4500892100 in SAP S/4HANA' },
    { id: 5, name: 'MIRO Document Parking', icon: Database, status: 'Completed', time: '1.5s', desc: 'BAPI_INCOMINGINVOICE_CREATE -> Doc # 5100098211' },
    { id: 6, name: 'MIGO GRN Posting (India RVS)', icon: Database, status: 'Completed', time: '1.1s', desc: 'Goods Receipt Posted -> Doc # 5000881920' },
    { id: 7, name: 'AP Master Tracker Update', icon: Table, status: 'Completed', time: '0.2s', desc: 'Ledger updated & Excel synced' },
    { id: 8, name: 'SharePoint & Power BI Refresh', icon: BarChart2, status: 'Completed', time: '0.5s', desc: 'Dashboard dataset auto-refreshed' },
    { id: 9, name: 'Notification & Audit Trail', icon: Bell, status: 'Completed', time: '0.1s', desc: 'Email + Teams notification dispatched' }
  ];

  const handleSimulatePipeline = () => {
    setIsSimulating(true);
    showToast('info', 'Executing End-to-End Orchestration Pipeline...');
    setTimeout(() => {
      setIsSimulating(false);
      showToast('success', 'Pipeline simulation completed! All 9 stages executed cleanly.');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Workflow className="w-4 h-4 text-blue-400" />
            <span>Module 13 — Enterprise AP Workflow Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">End-to-End Orchestration & Execution Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual pipeline execution status across 9 automated processing stages
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Workflow Report</span>
          </button>

          <button 
            onClick={handleSimulatePipeline}
            disabled={isSimulating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Executing Pipeline...' : 'Run Pipeline Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Pipeline Visual Flow */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-8">
        <h3 className="text-sm font-bold text-slate-200">Execution Pipeline Step Flow</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2 relative">
          {steps.map((step) => {
            const isSelected = selectedStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-36 ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {step.id}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <div className="font-bold text-slate-200 text-[11px] leading-tight mt-2">{step.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">{step.time}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Details */}
        {selectedStep && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Stage {selectedStep}: {steps[selectedStep - 1].name}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Execution Time: {steps[selectedStep - 1].time}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {steps[selectedStep - 1].desc}
            </p>

            <div className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-slate-400 border border-slate-800 flex justify-between items-center">
              <span>[SYSTEM OK] Step executed with zero errors. Passed validation schemas & security filters.</span>
              <button 
                onClick={() => showToast('success', `Re-executed Pipeline Stage ${selectedStep}!`)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Re-Run Step
              </button>
            </div>
          </div>
        )}
      </div>

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export Workflow Execution Audit Log"
      />
    </div>
  );
}
