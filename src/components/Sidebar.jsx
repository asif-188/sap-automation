import React from 'react';
import { 
  BarChart3, 
  Activity, 
  Mail, 
  FileText, 
  Building2, 
  GitCompare, 
  FolderTree, 
  Table, 
  MessageSquareText, 
  Workflow, 
  ClipboardList, 
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { emails, invoices, reconciliations, tickets, isSidebarOpen } = useApp();

  const menuGroup = [
    {
      category: 'Analytics & Dashboards',
      items: [
        { id: 'executive', label: 'Executive Dashboard', icon: BarChart3, badge: 'Power BI' },
        { id: 'operations', label: 'Operations Dashboard', icon: Activity, badge: `${invoices.filter(i => i.status.includes('OCR') || i.status.includes('Ready')).length} Action` }
      ]
    },
    {
      category: 'AI Ingestion & OCR',
      items: [
        { id: 'emails', label: 'AI Email Dashboard', icon: Mail, badge: `${emails.length} Feeds` },
        { id: 'extraction', label: 'Document AI Extraction Studio', icon: FileText, badge: 'OCR AI' }
      ]
    },
    {
      category: 'SAP ERP Automation',
      items: [
        { id: 'sap-queue', label: 'MIRO & MIGO Queue', icon: Building2, badge: `${invoices.length} Items` },
        { id: 'reconciliation', label: 'Vendor Reconciliation', icon: GitCompare, badge: `${reconciliations.length} Stmt` },
        { id: 'sharepoint', label: 'SharePoint Folder Monitor', icon: FolderTree }
      ]
    },
    {
      category: 'Operations & Workflow',
      items: [
        { id: 'tracker', label: 'AP Tracker & Excel', icon: Table },
        { id: 'queries', label: 'Vendor Query Tickets', icon: MessageSquareText, badge: `${tickets.length} Open` },
        { id: 'workflow', label: 'Workflow Engine', icon: Workflow }
      ]
    },
    {
      category: 'System & Governance',
      items: [
        { id: 'reports', label: 'Reports & Audit Logs', icon: ClipboardList },
        { id: 'settings', label: 'Settings & Security', icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      className={`${
        isSidebarOpen ? 'w-72' : 'w-16'
      } bg-[#0a0e17] border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0 overflow-y-auto transition-all duration-300`}
    >
      <div className="p-3 space-y-6">
        {menuGroup.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {/* Category Header (Only when sidebar is expanded) */}
            {isSidebarOpen && (
              <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-blue-400/90 truncate">
                {group.category}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={!isSidebarOpen ? `${item.label} (${item.badge || ''})` : ''}
                    className={`w-full flex items-center ${
                      isSidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
                    } py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40' 
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1 justify-center lg:justify-start">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}`} />
                      
                      {/* Label text shown when sidebar is open */}
                      {isSidebarOpen && (
                        <span className="text-left font-medium leading-tight whitespace-normal">{item.label}</span>
                      )}
                    </div>

                    {/* Badge shown when sidebar is open */}
                    {isSidebarOpen && item.badge && (
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-tight shrink-0 ml-2 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-800 text-blue-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Icon-Only Collapsed Tooltip Indicator */}
                    {!isSidebarOpen && isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="mt-auto p-3 border-t border-slate-800/80 bg-slate-900/60">
        {isSidebarOpen ? (
          <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 p-3 rounded-xl">
            <div className="text-xs font-bold text-blue-300 flex items-center justify-between">
              <span>SAP System Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1">S/4HANA Mandt 800 (1000 - India)</p>
          </div>
        ) : (
          <div className="flex justify-center p-1" title="SAP S/4HANA Mandt 800 (Online)">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
}
