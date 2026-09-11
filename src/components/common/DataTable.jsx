import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  CheckSquare, 
  Square, 
  Trash2, 
  CheckCircle, 
  Download, 
  SlidersHorizontal,
  Eye
} from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  keyField = 'id', 
  onRowClick, 
  bulkActions = [], 
  searchQuery = '',
  filters = {} 
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Search Engine
  const processedData = useMemo(() => {
    let result = [...data];

    // Search query filter across all keys
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Filter controls (Region, Plant, Status, PO Type)
    if (filters.region && filters.region !== 'All') {
      result = result.filter(row => row.region?.toLowerCase().includes(filters.region.toLowerCase()) || row.plant?.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.plant && filters.plant !== 'All') {
      result = result.filter(row => row.plant?.toLowerCase().includes(filters.plant.toLowerCase()));
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter(row => row.status === filters.status || row.grnStatus === filters.status);
    }
    if (filters.poType && filters.poType !== 'All') {
      result = result.filter(row => row.poType === filters.poType);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField] ?? '';
        let valB = b[sortField] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, filters, sortField, sortDirection]);

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Checkbox handlers
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row[keyField]));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !paginatedData.some(r => r[keyField] === id)));
    } else {
      const pageIds = paginatedData.map(r => r[keyField]);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar if items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-600/20 border border-blue-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-blue-200 animate-fadeIn">
          <div className="flex items-center space-x-2 font-bold">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>{selectedIds.length} Rows Selected</span>
          </div>

          <div className="flex items-center space-x-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => { action.onClick(selectedIds); setSelectedIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${action.className || 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                {action.icon && <action.icon className="w-3.5 h-3.5" />}
                <span>{action.label}</span>
              </button>
            ))}
            <button 
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider select-none sticky top-0 z-10 backdrop-blur">
              <tr>
                <th className="p-3.5 w-10 text-center border-b border-slate-800">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                    {isAllSelected ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                {columns.map((col) => (
                  <th 
                    key={col.field}
                    onClick={() => col.sortable !== false && handleSort(col.field)}
                    className={`p-3.5 border-b border-slate-800 ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <div className={`flex items-center space-x-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-500">
                          {sortField === col.field ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row[keyField]);
                return (
                  <tr 
                    key={row[keyField]}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-slate-800/50 transition cursor-pointer ${isSelected ? 'bg-blue-600/10' : ''}`}
                  >
                    <td className="p-3.5 text-center" onClick={(e) => toggleSelectRow(row[keyField], e)}>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                    </td>
                    {columns.map((col) => (
                      <td key={col.field} className={`p-3.5 text-slate-200 ${col.align === 'right' ? 'text-right' : ''}`}>
                        {col.render ? col.render(row[col.field], row) : (row[col.field] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-500 text-xs">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Showing {processedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries</span>
            
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px]">Rows per page:</span>
              <select 
                value={pageSize} 
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
