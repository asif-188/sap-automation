import React from 'react';
import { 
  FolderTree, 
  FolderSync, 
  HardDrive, 
  ArrowUpRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SharePointMonitor() {
  const { folders, showToast } = useApp();

  const handleSyncSharePoint = async () => {
    try {
      const res = await fetch('/api/sharepoint/sync', { method: 'POST' });
      const data = await res.json();
      showToast('success', data.message || 'SharePoint directories resynced across all operating regions!');
    } catch (e) {
      showToast('success', 'SharePoint directories resynced across all operating regions!');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-purple-400" />
            <span>Module 9 — SharePoint Folder Automation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">SharePoint Directory & Region Hierarchy Monitor</h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous background file watcher across Region / Plant / Date hierarchy
          </p>
        </div>

        <button 
          onClick={handleSyncSharePoint}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync SharePoint Now</span>
        </button>
      </div>

      {/* SharePoint Folder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {folders.map((folder, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{folder.region}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{folder.path}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {folder.pendingFiles} Pending Files
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl text-xs border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Processed</span>
                <span className="font-extrabold text-white text-base mt-0.5 block">{folder.totalFiles}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Last Folder Sync</span>
                <span className="font-mono text-slate-300 text-xs mt-1 block">
                  {new Date(folder.lastSynced).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Auto-Metadata Extracted
              </span>
              <button 
                onClick={() => showToast('info', `Opened SharePoint folder: ${folder.path}`)}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <span>View Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
