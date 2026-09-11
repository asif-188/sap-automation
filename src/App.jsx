import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import OperationsDashboard from './components/OperationsDashboard';
import EmailInbox from './components/EmailInbox';
import ExtractionStudio from './components/ExtractionStudio';
import SapQueue from './components/SapQueue';
import VendorReconciliation from './components/VendorReconciliation';
import SharePointMonitor from './components/SharePointMonitor';
import ApTracker from './components/ApTracker';
import VendorQueryTickets from './components/VendorQueryTickets';
import WorkflowEngine from './components/WorkflowEngine';
import ReportsAudit from './components/ReportsAudit';
import SettingsUserMgmt from './components/SettingsUserMgmt';
import { AppProvider, useApp } from './context/AppContext';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('executive');
  const { toast } = useApp();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <Header activeTab={activeTab} />

      <div className="flex flex-1 min-w-0 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto min-w-0 space-y-4">
          {activeTab === 'executive' && <ExecutiveDashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'operations' && <OperationsDashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'emails' && <EmailInbox />}
          {activeTab === 'extraction' && <ExtractionStudio />}
          {activeTab === 'sap-queue' && <SapQueue />}
          {activeTab === 'reconciliation' && <VendorReconciliation />}
          {activeTab === 'sharepoint' && <SharePointMonitor />}
          {activeTab === 'tracker' && <ApTracker />}
          {activeTab === 'queries' && <VendorQueryTickets />}
          {activeTab === 'workflow' && <WorkflowEngine />}
          {activeTab === 'reports' && <ReportsAudit />}
          {activeTab === 'settings' && <SettingsUserMgmt />}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs animate-bounce border ${
          toast.type === 'error' ? 'bg-red-950 border-red-500/50 text-red-100' :
          toast.type === 'info' ? 'bg-blue-950 border-blue-500/50 text-blue-100' :
          'bg-slate-900 border-emerald-500/50 text-slate-100'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full animate-ping shrink-0 ${toast.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
          <span className="font-semibold truncate">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
