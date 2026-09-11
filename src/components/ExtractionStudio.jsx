import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Cpu, 
  Eye, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExtractionStudio() {
  const { invoices, saveInvoice, showToast, hasPermission } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0] || null);
  const [formData, setFormData] = useState(invoices[0] || {});
  const [activeMobileTab, setActiveMobileTab] = useState('form'); // 'pdf' or 'form'
  const [pdfZoom, setPdfZoom] = useState(100);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [isLineItemsOpen, setIsLineItemsOpen] = useState(true);
  const [isSapStatusOpen, setIsSapStatusOpen] = useState(true);

  useEffect(() => {
    if (invoices.length > 0 && !selectedInvoice) {
      setSelectedInvoice(invoices[0]);
      setFormData(invoices[0]);
    }
  }, [invoices]);

  const handleSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setFormData(inv);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (idx, field, value) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[idx][field] = value;
    if (field === 'qty' || field === 'unitPrice') {
      updatedItems[idx].lineTotal = (updatedItems[idx].qty || 0) * (updatedItems[idx].unitPrice || 0);
    }
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddLineItem = () => {
    const items = formData.items || [];
    const newItem = {
      item: (items.length + 1) * 10,
      description: 'New Material / Service Line Item',
      hsn: '996511',
      qty: 1,
      unitPrice: 1000,
      lineTotal: 1000
    };
    setFormData(prev => ({ ...prev, items: [...items, newItem] }));
  };

  const handleDeleteLineItem = (idx) => {
    const updated = (formData.items || []).filter((_, i) => i !== idx);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const handleReExtract = () => {
    showToast('info', 'Re-triggering Document AI LayoutLM model extraction...');
    setTimeout(() => {
      setFormData(prev => ({ ...prev, ocrConfidence: 99.1 }));
      showToast('success', 'OCR Re-extraction complete! Confidence updated to 99.1%');
    }, 1000);
  };

  const handleSave = () => {
    if (formData.id) {
      saveInvoice(formData);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Module 3 — AI Document Intelligence Studio</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">OCR Data Extraction & Validation Studio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Split-view PDF preview with real-time field validation, missing field detection, & line-item verification
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={handleReExtract}
            className="px-3 py-2 min-h-[44px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Re-Extract OCR</span>
            <span className="sm:hidden text-[11px]">Re-Extract</span>
          </button>

          <button 
            onClick={handleSave}
            className="px-3.5 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Fields</span>
          </button>
        </div>
      </div>

      {/* Selector Ribbon */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
        {invoices.map((inv) => (
          <button
            key={inv.id}
            onClick={() => handleSelectInvoice(inv)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center space-x-2.5 shrink-0 transition min-h-[44px] ${
              selectedInvoice?.id === inv.id 
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-slate-200">{inv.invoiceNumber}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[100px] sm:max-w-none">{inv.vendorName}</div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {inv.ocrConfidence}%
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Mode Switcher (< 1024px) */}
      <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveMobileTab('form')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition min-h-[40px] flex items-center justify-center space-x-1.5 ${
            activeMobileTab === 'form' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Extracted Data & Validation</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('pdf')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition min-h-[40px] flex items-center justify-center space-x-1.5 ${
            activeMobileTab === 'pdf' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>PDF Document Viewer</span>
        </button>
      </div>

      {/* Main Split Layout: PDF Preview Left vs Form Fields Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PDF Document Viewer Pane */}
        <div className={`lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[500px] lg:min-h-[600px] relative overflow-hidden ${
          activeMobileTab === 'pdf' ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Original Invoice PDF Viewer</span>
            </div>

            {/* Mobile PDF Zoom & Action Controls */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setPdfZoom(prev => Math.max(prev - 25, 50))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-300 px-1">{pdfZoom}%</span>
              <button 
                onClick={() => setPdfZoom(prev => Math.min(prev + 25, 200))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setPdfZoom(100)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Fit to Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => showToast('success', `Downloading INV_${formData.invoiceNumber}.pdf`)}
                className="p-1 text-blue-400 hover:text-blue-300 rounded"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white text-slate-900 p-4 sm:p-6 rounded-xl shadow-2xl font-sans text-xs space-y-4 border border-slate-300 relative overflow-auto max-h-[500px]">
            <div className="transition-transform origin-top-left" style={{ transform: `scale(${pdfZoom / 100})`, width: pdfZoom > 100 ? `${100 * (100 / pdfZoom)}%` : '100%' }}>
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
                <div>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">{formData.vendorName || 'VENDING CORP'}</h1>
                  <p className="text-[10px] text-slate-600">GSTIN: {formData.gstin}</p>
                  <p className="text-[10px] text-slate-600">Plant: {formData.plant}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-blue-100 text-blue-900 font-bold text-[10px] rounded uppercase">TAX INVOICE</span>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1"># {formData.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-600">Date: {formData.invoiceDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 bg-slate-50 p-2 sm:p-2.5 rounded border text-[10px] sm:text-[11px] my-3">
                <div>
                  <strong className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Bill To Entity:</strong>
                  <span className="font-semibold text-slate-800">Enterprise India Operations Ltd</span>
                  <span className="block text-slate-600">Company Code: {formData.companyCode}</span>
                </div>
                <div>
                  <strong className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">PO Reference:</strong>
                  <span className="font-bold text-blue-700">{formData.poNumber}</span>
                  <span className="block text-slate-600">Terms: {formData.paymentTerms}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px] sm:text-[10px] border-collapse mt-2">
                  <thead className="bg-slate-200 text-slate-700 uppercase font-bold">
                    <tr>
                      <th className="p-1 sm:p-1.5 border">Item</th>
                      <th className="p-1 sm:p-1.5 border">Description</th>
                      <th className="p-1 sm:p-1.5 border">HSN</th>
                      <th className="p-1 sm:p-1.5 border text-right">Qty</th>
                      <th className="p-1 sm:p-1.5 border text-right">Rate</th>
                      <th className="p-1 sm:p-1.5 border text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(formData.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-1 sm:p-1.5 border">{it.item}</td>
                        <td className="p-1 sm:p-1.5 border font-medium">{it.description}</td>
                        <td className="p-1 sm:p-1.5 border font-mono">{it.hsn}</td>
                        <td className="p-1 sm:p-1.5 border text-right">{it.qty}</td>
                        <td className="p-1 sm:p-1.5 border text-right">₹{it.unitPrice}</td>
                        <td className="p-1 sm:p-1.5 border text-right font-bold">₹{it.lineTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2 text-right">
                <div className="w-48 space-y-1 text-[10px] sm:text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{formData.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST Tax (18%):</span>
                    <span>₹{formData.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-xs border-t pt-1">
                    <span>Total Amount:</span>
                    <span>₹{formData.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Form Fields & Line Items Editor Pane */}
        <div className={`lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 ${
          activeMobileTab === 'form' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Document AI Extraction Result</span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">Extracted Header & Accounting Fields</h3>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Confidence: {formData.ocrConfidence}%</span>
            </div>
          </div>

          {/* Section 1: Header Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <button
              onClick={() => setIsHeaderOpen(!isHeaderOpen)}
              className="w-full p-3 bg-slate-900 flex justify-between items-center text-xs font-bold text-slate-200 border-b border-slate-800"
            >
              <span>1. Invoice Header & Vendor Metadata</span>
              {isHeaderOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isHeaderOpen && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Invoice Number</label>
                  <input 
                    type="text" 
                    value={formData.invoiceNumber || ''} 
                    onChange={e => handleFieldChange('invoiceNumber', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">PO Number</label>
                  <input 
                    type="text" 
                    value={formData.poNumber || ''} 
                    onChange={e => handleFieldChange('poNumber', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-blue-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Vendor GSTIN</label>
                  <input 
                    type="text" 
                    value={formData.gstin || ''} 
                    onChange={e => handleFieldChange('gstin', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Invoice Date</label>
                  <input 
                    type="date" 
                    value={formData.invoiceDate || ''} 
                    onChange={e => handleFieldChange('invoiceDate', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate || ''} 
                    onChange={e => handleFieldChange('dueDate', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Target Plant</label>
                  <input 
                    type="text" 
                    value={formData.plant || ''} 
                    onChange={e => handleFieldChange('plant', e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Net Amount (INR)</label>
                  <input 
                    type="number" 
                    value={formData.amount || 0} 
                    onChange={e => handleFieldChange('amount', parseFloat(e.target.value))}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">GST Tax Amount</label>
                  <input 
                    type="number" 
                    value={formData.taxAmount || 0} 
                    onChange={e => handleFieldChange('taxAmount', parseFloat(e.target.value))}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Total Gross Amount</label>
                  <input 
                    type="number" 
                    value={formData.totalAmount || 0} 
                    onChange={e => handleFieldChange('totalAmount', parseFloat(e.target.value))}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: SAP Status & Approvals Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <button
              onClick={() => setIsSapStatusOpen(!isSapStatusOpen)}
              className="w-full p-3 bg-slate-900 flex justify-between items-center text-xs font-bold text-slate-200 border-b border-slate-800"
            >
              <span>2. SAP Status, MIRO & MIGO Posting</span>
              {isSapStatusOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isSapStatusOpen && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">MIRO Parking Status</span>
                  <span className={`font-bold mt-1 block ${formData.miroDocNumber ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {formData.status} {formData.miroDocNumber ? `#${formData.miroDocNumber}` : ''}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">MIGO GRN Status</span>
                  <span className={`font-bold mt-1 block ${formData.migoDocNumber ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {formData.grnStatus || 'Pending Posting'} {formData.migoDocNumber ? `#${formData.migoDocNumber}` : ''}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Reconciliation Status</span>
                  <span className="font-bold text-blue-400 mt-1 block">Matched & Cleared</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Extracted Line Items Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <div className="p-3 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <button
                onClick={() => setIsLineItemsOpen(!isLineItemsOpen)}
                className="flex items-center space-x-2 text-xs font-bold text-slate-200"
              >
                <span>3. Extracted Line Items ({formData.items?.length || 0})</span>
                {isLineItemsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <button 
                onClick={handleAddLineItem}
                className="px-2.5 py-1 min-h-[36px] bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {isLineItemsOpen && (
              <div className="p-4 space-y-3">
                {(formData.items || []).map((it, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>Line Item #{it.item}</span>
                      <button onClick={() => handleDeleteLineItem(idx)} className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-6">
                        <label className="text-[9px] text-slate-400 uppercase font-semibold block sm:hidden">Description</label>
                        <input 
                          type="text"
                          value={it.description}
                          onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                          className="w-full min-h-[38px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[9px] text-slate-400 uppercase font-semibold block sm:hidden">HSN Code</label>
                        <input 
                          type="text"
                          value={it.hsn}
                          onChange={e => handleLineItemChange(idx, 'hsn', e.target.value)}
                          className="w-full min-h-[38px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-mono text-center"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[9px] text-slate-400 uppercase font-semibold block sm:hidden">Quantity</label>
                        <input 
                          type="number"
                          value={it.qty}
                          onChange={e => handleLineItemChange(idx, 'qty', parseFloat(e.target.value))}
                          className="w-full min-h-[38px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-right"
                        />
                      </div>
                      <div className="sm:col-span-2 text-right font-bold text-emerald-400 py-1">
                        ₹{it.lineTotal?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

