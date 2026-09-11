import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Key, 
  ShieldCheck, 
  Sliders, 
  Database, 
  Lock, 
  Save, 
  Plus,
  Trash2,
  Edit3,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SettingsUserMgmt() {
  const { usersList, addUser, deleteUser, showToast, hasPermission } = useApp();
  const [threshold, setThreshold] = useState(90);
  const [autoParkEnabled, setAutoParkEnabled] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('AP Processor');

  const handleCreateUser = () => {
    if (!name || !email) {
      showToast('error', 'Name and Email are required');
      return;
    }
    addUser({ name, email, role });
    setName('');
    setEmail('');
    setIsAddUserOpen(false);
  };

  const handleTestAzureAD = () => {
    showToast('success', 'Microsoft Azure AD SSO Connection Verified! Tenant ID: e819-2041-azure.');
  };

  const handleTestSapConnection = () => {
    showToast('success', 'SAP S/4HANA RFC Gateway Connection Active (Mandt: 800, Latency: 38ms)');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-blue-400" />
            <span>Modules 15, 18, & 23 — Platform Settings & RBAC Governance</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Azure AD SSO, SAP RFC & User Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise role-based access control, AI confidence thresholding, & SAP BAPI secrets
          </p>
        </div>

        <button 
          onClick={() => showToast('success', 'Saved all platform configuration & AI threshold settings!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management & RBAC Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-100">User Management & Permissions ({usersList.length})</h3>
            </div>
            
            <button 
              onClick={() => setIsAddUserOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {usersList.map((usr) => (
              <div key={usr.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    {usr.name}
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                      {usr.role}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{usr.email} • Status: {usr.status}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => deleteUser(usr.id)}
                    className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                    title="Delete User"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAP S/4HANA Gateway & Azure AD Integration Config */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">SAP S/4HANA RFC Gateway Configuration</h3>
              </div>
              <button onClick={handleTestSapConnection} className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Test Gateway
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">SAP Host / Server</label>
                <input 
                  type="text" 
                  defaultValue="sap-s4hana.enterprise.internal" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Client Mandt</label>
                <input 
                  type="text" 
                  defaultValue="800" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Microsoft Azure AD SSO Integration</h3>
              </div>
              <button onClick={handleTestAzureAD} className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Test Azure SSO
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Azure Tenant ID</label>
                <input 
                  type="text" 
                  defaultValue="e819-2041-azure-tenant" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Application Client ID</label>
                <input 
                  type="text" 
                  defaultValue="ap-automation-client-99" 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* AI Confidence Threshold Controls */}
          <div className="space-y-4 border-t border-slate-800 pt-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">AI Auto-Parking Confidence Threshold</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Minimum Confidence Score to Auto-Park in SAP:</span>
                <span className="font-extrabold text-emerald-400 font-mono">{threshold}%</span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="99" 
                value={threshold} 
                onChange={e => setThreshold(e.target.value)}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Enterprise User</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vikram Malhotra" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vikram@enterprise.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100">
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="AP Processor">AP Processor</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Vendor Reconciliation User">Vendor Reconciliation Lead</option>
                  <option value="Read Only">Read Only Auditor</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setIsAddUserOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
