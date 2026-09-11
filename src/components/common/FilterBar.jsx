import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Calendar, 
  Building, 
  Tag,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FilterBar({ onReset }) {
  const { searchQuery, setSearchQuery, filters, setFilters } = useApp();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    setIsMobileFilterOpen(false);
  };

  const activeFilterCount = [
    filters.region !== 'All',
    filters.plant !== 'All',
    filters.status !== 'All',
    filters.poType !== 'All',
    filters.dateRange !== '30'
  ].filter(Boolean).length;

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Instant Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Instant Search: Invoice#, PO#, GSTIN, Vendor..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Mobile Filter Button (< lg breakpoint) */}
        <div className="flex lg:hidden items-center justify-between w-full gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2.5 px-4 min-h-[44px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filters & Categories</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button 
            onClick={handleReset}
            className="py-2.5 px-3 min-h-[44px] bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Clear</span>
          </button>
        </div>

        {/* Multi Filters Dropdowns (Desktop >= lg) */}
        <div className="hidden lg:flex flex-wrap items-center gap-2.5 w-auto">
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
            className="p-2 min-h-[36px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1 text-xs font-semibold"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet / Modal Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl z-50 animate-slideUp space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-slate-100 text-sm">Filter Options</h3>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Region */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Region</label>
                <select 
                  value={filters.region} 
                  onChange={e => handleFilterChange('region', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 min-h-[44px] text-xs font-semibold"
                >
                  <option value="All">All Regions</option>
                  <option value="West">West Region</option>
                  <option value="North">North Region</option>
                  <option value="South">South Region</option>
                  <option value="East">East Region</option>
                </select>
              </div>

              {/* Plant */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">SAP Plant Entity</label>
                <select 
                  value={filters.plant} 
                  onChange={e => handleFilterChange('plant', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 min-h-[44px] text-xs font-semibold"
                >
                  <option value="All">All Plants</option>
                  <option value="IN10">IN10 - Mumbai</option>
                  <option value="IN20">IN20 - Pune</option>
                  <option value="IN30">IN30 - Bengaluru</option>
                  <option value="IN40">IN40 - Kolkata</option>
                </select>
              </div>

              {/* PO Type */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Document Category</label>
                <select 
                  value={filters.poType} 
                  onChange={e => handleFilterChange('poType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 min-h-[44px] text-xs font-semibold"
                >
                  <option value="All">PO / Non-PO (All)</option>
                  <option value="PO Invoice">PO Invoice</option>
                  <option value="Non-PO Invoice">Non-PO Invoice</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Time Interval</label>
                <select 
                  value={filters.dateRange} 
                  onChange={e => handleFilterChange('dateRange', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 min-h-[44px] text-xs font-semibold"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">This Fiscal Year</option>
                </select>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
              <button 
                onClick={handleReset}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs min-h-[44px]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

