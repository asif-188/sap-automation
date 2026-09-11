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
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExtractionStudio() {
  const { invoices, saveInvoice, showToast, hasPermission } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0] || null);
  const [formData, setFormData] = useState(invoices[0] || {});

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
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Module 3 — AI Document Intelligence Studio</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">OCR Data Extraction & Validation Studio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Split-view PDF preview with real-time field validation, missing field detection, & line-item verification
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleReExtract}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Re-Extract OCR</span>
          </button>

          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Extracted Fields</span>
          </button>
        </div>
      </div>

      {/* Selector Ribbon */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {invoices.map((inv) => (
          <button
            key={inv.id}
            onClick={() => handleSelectInvoice(inv)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center space-x-3 shrink-0 transition ${
              selectedInvoice?.id === inv.id 
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <div className="font-bold text-slate-200">{inv.invoiceNumber}</div>
              <div className="text-[10px] text-slate-400">{inv.vendorName}</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {inv.ocrConfidence}%
            </span>
          </button>
        ))}
      </div>

      {/* Main Split Layout: PDF Preview Left vs Form Fields Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[600px] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Original Invoice PDF Viewer</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">INV_{formData.invoiceNumber}.pdf</span>
          </div>

          <div className="flex-1 bg-white text-slate-900 p-6 rounded-xl shadow-2xl font-sans text-xs space-y-4 border border-slate-300 relative overflow-y-auto">
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-wide">{formData.vendorName || 'VENDING CORP'}</h1>
                <p className="text-[10px] text-slate-600">GSTIN: {formData.gstin}</p>
                <p className="text-[10px] text-slate-600">Plant: {formData.plant}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-blue-100 text-blue-900 font-bold text-[10px] rounded uppercase">TAX INVOICE</span>
                <p className="font-extrabold text-sm text-slate-900 mt-1"># {formData.invoiceNumber}</p>
                <p className="text-[10px] text-slate-600">Date: {formData.invoiceDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2.5 rounded border text-[11px]">
              <div>
                <strong className="block text-[10px] text-slate-500 uppercase">Bill To Entity:</strong>
                <span className="font-semibold text-slate-800">Enterprise India Operations Ltd</span>
                <span className="block text-slate-600">Company Code: {formData.companyCode}</span>
              </div>
              <div>
                <strong className="block text-[10px] text-slate-500 uppercase">PO Reference:</strong>
                <span className="font-bold text-blue-700">{formData.poNumber}</span>
                <span className="block text-slate-600">Terms: {formData.paymentTerms}</span>
              </div>
            </div>

            <table className="w-full text-left text-[10px] border-collapse mt-2">
              <thead className="bg-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-1.5 border">Item</th>
                  <th className="p-1.5 border">Description</th>
                  <th className="p-1.5 border">HSN</th>
                  <th className="p-1.5 border text-right">Qty</th>
                  <th className="p-1.5 border text-right">Rate</th>
                  <th className="p-1.5 border text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(formData.items || []).map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-1.5 border">{it.item}</td>
                    <td className="p-1.5 border font-medium">{it.description}</td>
                    <td className="p-1.5 border font-mono">{it.hsn}</td>
                    <td className="p-1.5 border text-right">{it.qty}</td>
                    <td className="p-1.5 border text-right">₹{it.unitPrice}</td>
                    <td className="p-1.5 border text-right font-bold">₹{it.lineTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end pt-2 text-right">
              <div className="w-48 space-y-1 text-[11px]">
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

        {/* Extracted Form Fields & Line Items Editor */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Document AI Extraction Result</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Extracted Header & Accounting Fields</h3>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Overall Confidence: {formData.ocrConfidence}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Invoice Number</label>
              <input 
                type="text" 
                value={formData.invoiceNumber || ''} 
                onChange={e => handleFieldChange('invoiceNumber', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">PO Number</label>
              <input 
                type="text" 
                value={formData.poNumber || ''} 
                onChange={e => handleFieldChange('poNumber', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-blue-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Vendor GSTIN</label>
              <input 
                type="text" 
                value={formData.gstin || ''} 
                onChange={e => handleFieldChange('gstin', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Invoice Date</label>
              <input 
                type="date" 
                value={formData.invoiceDate || ''} 
                onChange={e => handleFieldChange('invoiceDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Due Date</label>
              <input 
                type="date" 
                value={formData.dueDate || ''} 
                onChange={e => handleFieldChange('dueDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Target Plant</label>
              <input 
                type="text" 
                value={formData.plant || ''} 
                onChange={e => handleFieldChange('plant', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Net Amount (INR)</label>
              <input 
                type="number" 
                value={formData.amount || 0} 
                onChange={e => handleFieldChange('amount', parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">GST Tax Amount</label>
              <input 
                type="number" 
                value={formData.taxAmount || 0} 
                onChange={e => handleFieldChange('taxAmount', parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Total Gross Amount</label>
              <input 
                type="number" 
                value={formData.totalAmount || 0} 
                onChange={e => handleFieldChange('totalAmount', parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Extracted Line Items</h4>
              <button 
                onClick={handleAddLineItem}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {(formData.items || []).map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs items-center">
                  <div className="col-span-1 text-slate-400 font-mono text-center">#{it.item}</div>
                  <div className="col-span-4">
                    <input 
                      type="text"
                      value={it.description}
                      onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="text"
                      value={it.hsn}
                      onChange={e => handleLineItemChange(idx, 'hsn', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={it.qty}
                      onChange={e => handleLineItemChange(idx, 'qty', parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-right"
                    />
                  </div>
                  <div className="col-span-2 text-right font-bold text-emerald-400">
                    ₹{it.lineTotal?.toLocaleString('en-IN')}
                  </div>
                  <div className="col-span-1 text-center">
                    <button onClick={() => handleDeleteLineItem(idx)} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
