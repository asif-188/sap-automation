import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Calendar, 
  Building, 
  Tag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FilterBar({ onReset }) {
  const { searchQuery, setSearchQuery, filters, setFilters } = useApp();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({
      region: 'All',
      plant: 'All',
      status: 'All',
      poType: 'All',
      dateRange: '30'
    });
    if (onReset) onReset();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Instant Search Bar */}
      <div className="relative w-full lg:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Instant Search: Invoice#, PO#, GSTIN, Vendor..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Multi Filters Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
        {/* Region Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <select 
            value={filters.region} 
            onChange={e => handleFilterChange('region', e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="All" className="bg-slate-900 text-slate-100 font-semibold">All Regions</option>
            <option value="West" className="bg-slate-900 text-slate-100 font-semibold">West Region</option>
            <option value="North" className="bg-slate-900 text-slate-100 font-semibold">North Region</option>
            <option value="South" className="bg-slate-900 text-slate-100 font-semibold">South Region</option>
            <option value="East" className="bg-slate-900 text-slate-100 font-semibold">East Region</option>
          </select>
        </div>

        {/* Plant Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <Building className="w-3.5 h-3.5 text-cyan-400" />
          <select 
            value={filters.plant} 
            onChange={e => handleFilterChange('plant', e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="All" className="bg-slate-900 text-slate-100 font-semibold">All Plants</option>
            <option value="IN10" className="bg-slate-900 text-slate-100 font-semibold">IN10 - Mumbai</option>
            <option value="IN20" className="bg-slate-900 text-slate-100 font-semibold">IN20 - Pune</option>
            <option value="IN30" className="bg-slate-900 text-slate-100 font-semibold">IN30 - Bengaluru</option>
            <option value="IN40" className="bg-slate-900 text-slate-100 font-semibold">IN40 - Kolkata</option>
          </select>
        </div>

        {/* PO Type Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <Tag className="w-3.5 h-3.5 text-purple-400" />
          <select 
            value={filters.poType} 
            onChange={e => handleFilterChange('poType', e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="All" className="bg-slate-900 text-slate-100 font-semibold">PO / Non-PO (All)</option>
            <option value="PO Invoice" className="bg-slate-900 text-slate-100 font-semibold">PO Invoice</option>
            <option value="Non-PO Invoice" className="bg-slate-900 text-slate-100 font-semibold">Non-PO Invoice</option>
          </select>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <select 
            value={filters.dateRange} 
            onChange={e => handleFilterChange('dateRange', e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="7" className="bg-slate-900 text-slate-100 font-semibold">Last 7 Days</option>
            <option value="30" className="bg-slate-900 text-slate-100 font-semibold">Last 30 Days</option>
            <option value="90" className="bg-slate-900 text-slate-100 font-semibold">Last 90 Days</option>
            <option value="365" className="bg-slate-900 text-slate-100 font-semibold">This Fiscal Year</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button 
          onClick={handleReset}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1 text-xs font-semibold"
          title="Reset All Filters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
