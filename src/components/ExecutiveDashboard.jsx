import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Building, 
  Filter, 
  Download,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExportModal from './common/ExportModal';

const COLORS = ['#0070f2', '#00c3ff', '#f0ab00', '#10b981', '#8b5cf6'];

export default function ExecutiveDashboard({ onNavigateTab }) {
  const { stats, filters, setFilters, invoices } = useApp();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const monthlyTrendData = [
    { month: 'Apr 2026', total: 1100, miro: 1050, migo: 980 },
    { month: 'May 2026', total: 1250, miro: 1210, migo: 1150 },
    { month: 'Jun 2026', total: 1380, miro: 1340, migo: 1290 },
    { month: 'Jul 2026', total: 1410, miro: 1380, migo: 1320 },
    { month: 'Aug 2026', total: 1420, miro: 1360, migo: 1236 }
  ];

  const regionalData = [
    { region: 'West (Mumbai/Pune)', volume: 620, amount: 14.2 },
    { region: 'South (BLR/CHN)', volume: 450, amount: 9.8 },
    { region: 'North (DEL/JPD)', volume: 240, amount: 5.5 },
    { region: 'East (KOL/JSR)', volume: 110, amount: 2.1 }
  ];

  const categoryData = [
    { name: 'Third Party PO', value: 720 },
    { name: 'Non-PO Services', value: 310 },
    { name: 'Inter-Company', value: 180 },
    { name: 'Ariba / Non-SAP', value: 210 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Power BI Executive Analytics Dashboard</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Accounts Payable Enterprise Performance Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any KPI card below to drill directly into filtered operational records
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select 
              value={filters.region} 
              onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-100 font-semibold">All Regions</option>
              <option value="West" className="bg-slate-900 text-slate-100 font-semibold">West Region</option>
              <option value="South" className="bg-slate-900 text-slate-100 font-semibold">South Region</option>
              <option value="North" className="bg-slate-900 text-slate-100 font-semibold">North Region</option>
              <option value="East" className="bg-slate-900 text-slate-100 font-semibold">East Region</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <select 
              value={filters.plant} 
              onChange={e => setFilters(prev => ({ ...prev, plant: e.target.value }))}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-100 font-semibold">All Plants</option>
              <option value="IN10" className="bg-slate-900 text-slate-100 font-semibold">IN10 - Mumbai</option>
              <option value="IN20" className="bg-slate-900 text-slate-100 font-semibold">IN20 - Pune</option>
              <option value="IN30" className="bg-slate-900 text-slate-100 font-semibold">IN30 - Bengaluru</option>
              <option value="IN40" className="bg-slate-900 text-slate-100 font-semibold">IN40 - Kolkata</option>
            </select>
          </div>

          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Power BI PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Clickable KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          onClick={() => onNavigateTab && onNavigateTab('emails')}
          className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-blue-500/60 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Total Ingestion</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalEmails}</div>
          <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
            <span>Drill to Emails Feed →</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('sap-queue')}
          className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-emerald-500/60 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">MIRO Parked</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.miroParked}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Drill to SAP Queue →</div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('sap-queue')}
          className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-cyan-500/60 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">MIGO Posted (GRN)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.migoPosted}</div>
          <div className="text-[11px] text-cyan-400 mt-1">Drill to MIGO Postings →</div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('reconciliation')}
          className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-amber-500/60 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Pending Recon</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.reconciliationPending}</div>
          <div className="text-[11px] text-amber-400 mt-1">Drill to Statements →</div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('operations')}
          className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-red-500/60 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Exceptions / Failed</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.failedDocuments}</div>
          <div className="text-[11px] text-red-400 mt-1">Drill to Exception Queue →</div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Invoice Processing & SAP Posting Velocity</h3>
              <p className="text-xs text-slate-400">Monthly Volume vs SAP MIRO Parked vs MIGO Posted</p>
            </div>
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
              FY 2026-27
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070f2" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0070f2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMiro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#0070f2" fillOpacity={1} fill="url(#colorTotal)" name="Total Ingested" />
                <Area type="monotone" dataKey="miro" stroke="#10b981" fillOpacity={1} fill="url(#colorMiro)" name="MIRO Parked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Vendor & PO Type Distribution</h3>
            <p className="text-xs text-slate-400">PO Invoices vs Services vs Inter-Company</p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                <span className="text-slate-400 truncate">{cat.name}:</span>
                <span className="font-bold text-slate-200">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Export Executive Performance Dashboard Report"
      />
    </div>
  );
}
