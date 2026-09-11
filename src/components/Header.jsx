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
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import UploadModal from './common/UploadModal';

export default function Header({ activeTab }) {
  const { currentUser, setCurrentUser, searchQuery, setSearchQuery, fetchAllFeeds, showToast, isSidebarOpen, toggleSidebar } = useApp();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const roles = [
    { role: 'Admin', label: 'Admin (Full Access)' },
    { role: 'AP Processor', label: 'AP Processor (MIRO/OCR)' },
    { role: 'Finance Manager', label: 'Finance Manager (MIGO/Approvals)' },
    { role: 'Vendor Reconciliation User', label: 'Vendor Recon Specialist' },
    { role: 'Read Only', label: 'Read Only Auditor' }
  ];

  return (
    <>
      <header className="h-16 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left Title & System Badge & 3-Line Hamburger Menu Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center shadow-sm group shrink-0"
            title="Toggle Navigation Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 font-bold text-white text-base sm:text-xl tracking-wider shrink-0">
              SAP
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-bold text-slate-100 flex items-center gap-1.5 truncate">
                <span className="truncate">Enterprise AP Automation</span>
                <span className="hidden xl:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  S/4HANA Cloud
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <span className="hidden sm:inline">Multi-Plant (1000)</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Engines Active
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Input Connected to Global Context (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-6">
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
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
            title="Toggle Search"
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4 text-blue-400" />
          </button>

          {/* Quick Upload Button */}
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 min-h-[44px] bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Upload Invoice</span>
            <span className="sm:hidden text-[11px]">Upload</span>
          </button>

          {/* Refresh Data Feeds */}
          <button 
            onClick={fetchAllFeeds}
            className="p-2 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:rotate-180 duration-500 flex items-center justify-center"
            title="Refresh All Feeds"
            aria-label="Refresh feeds"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </button>

          {/* RBAC Role Switcher Pill */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-1.5 sm:pl-3">
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-2 sm:px-3 py-1.5 min-h-[44px] rounded-xl cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
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
                    className={`w-full text-left px-3 py-2 min-h-[40px] rounded-xl text-xs font-medium transition ${
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

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-3 flex items-center space-x-2 animate-fadeIn sticky top-16 z-39">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Invoice#, PO#, Vendor..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
              autoFocus
            />
          </div>
          <button 
            onClick={() => setShowMobileSearch(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        uploadType="invoice"
        title="Upload PDF Invoice for Document AI OCR"
      />
    </>
  );
}

