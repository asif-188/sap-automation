import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Database, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  Zap, 
  FolderSync, 
  UploadCloud,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import UploadModal from './common/UploadModal';

export default function Header({ activeTab }) {
  const { currentUser, setCurrentUser, searchQuery, setSearchQuery, fetchAllFeeds, showToast, isSidebarOpen, toggleSidebar } = useApp();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const roles = [
    { role: 'Admin', label: 'Admin (Full Access)' },
    { role: 'AP Processor', label: 'AP Processor (MIRO/OCR)' },
    { role: 'Finance Manager', label: 'Finance Manager (MIGO/Approvals)' },
    { role: 'Vendor Reconciliation User', label: 'Vendor Recon Specialist' },
    { role: 'Read Only', label: 'Read Only Auditor' }
  ];

  return (
    <>
      <header className="h-16 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left Title & System Badge & 3-Line Hamburger Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center shadow-sm group"
            title="Toggle / Hide Sidebar Menu (3-Line Option)"
          >
            <Menu className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 font-bold text-white text-xl tracking-wider shrink-0">
              SAP
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Enterprise AP Automation Platform
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  S/4HANA Cloud
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Multi-Plant Entity (1000)</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Engines Active
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Input Connected to Global Context */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Global Search (Invoice#, PO#, Vendor Code, GSTIN)..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Right Actions & Active Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Quick Upload Button */}
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Upload Invoice</span>
          </button>

          {/* Refresh Data Feeds */}
          <button 
            onClick={fetchAllFeeds}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:rotate-180 duration-500"
            title="Refresh All Feeds"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </button>

          {/* RBAC Role Switcher Pill */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-[10px] text-blue-400 font-semibold">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Role Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Switch Active Role (RBAC)</div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentUser(prev => ({ ...prev, role: r.role }));
                      showToast('info', `Active Role switched to '${r.role}'`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                      currentUser.role === r.role ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        uploadType="invoice"
        title="Upload PDF Invoice for Document AI OCR"
      />
    </>
  );
}
