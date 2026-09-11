import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Plus, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VendorQueryTickets() {
  const { tickets, showToast, currentUser } = useApp();
  const [selectedTicket, setSelectedTicket] = useState(tickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New ticket form
  const [newVendor, setNewVendor] = useState('');
  const [newType, setNewType] = useState('Payment Status');
  const [newInv, setNewInv] = useState('');
  const [newPo, setNewPo] = useState('');

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    try {
      await fetch('/api/queries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selectedTicket.id, replyText, currentUser: currentUser.name })
      });
    } catch (e) {}

    selectedTicket.messages.push({
      sender: 'AP Team',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    selectedTicket.status = 'In Progress';

    showToast('success', `Sent response for Ticket #${selectedTicket.id}`);
    setReplyText('');
  };

  const handleCreateTicket = async () => {
    if (!newVendor.trim()) return;

    const newTktObj = {
      vendorName: newVendor,
      queryType: newType,
      invoiceNumber: newInv || 'N/A',
      poNumber: newPo || 'N/A',
      currentUser: currentUser.name
    };

    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTktObj)
      });
      const data = await res.json();
      if (data.ticket) {
        tickets.unshift(data.ticket);
        setSelectedTicket(data.ticket);
      }
    } catch (e) {}

    showToast('success', `Created new Vendor Query Ticket for ${newVendor}`);
    setIsAddOpen(false);
    setNewVendor('');
    setNewInv('');
    setNewPo('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <MessageSquareText className="w-4 h-4 text-purple-400" />
            <span>Module 12 — Vendor Query Ticketing & SLA Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Vendor Helpdesk & SLA Response Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated ticket routing for payment inquiries, MIGO discrepancies, and statement follow-ups
          </p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Split Ticket Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-3.5 border-b border-slate-800 bg-slate-800/40 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-200">Helpdesk Tickets ({tickets.length})</span>
            <span className="text-[10px] text-purple-400 font-mono">SLA: 24h</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1">
            {tickets.map((tkt) => (
              <div 
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`p-4 cursor-pointer transition ${
                  selectedTicket?.id === tkt.id ? 'bg-purple-600/15 border-l-4 border-purple-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-200">{tkt.vendorName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    SLA: {tkt.slaHoursLeft}h left
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium mt-1">
                  Type: {tkt.queryType} (Inv # {tkt.invoiceNumber})
                </p>

                <div className="flex items-center justify-between mt-3 text-[10px]">
                  <span className="text-slate-400">Owner: {tkt.assignedTo}</span>
                  <span className="font-mono text-slate-500">{tkt.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Ticket Conversation */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[520px]">
          {selectedTicket ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{selectedTicket.id}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      PO: {selectedTicket.poNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedTicket.vendorName}</h3>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Assigned AP Lead</span>
                  <span className="font-semibold text-slate-200">{selectedTicket.assignedTo}</span>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
                {selectedTicket.messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl max-w-lg text-xs space-y-1 ${
                      msg.sender === 'AP Team' 
                        ? 'bg-blue-600/20 border border-blue-500/30 ml-auto text-blue-100' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-bold">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="text" 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type official response to vendor..." 
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                />
                <button 
                  onClick={handleSendReply}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Response</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-20 text-center">Select a ticket to respond</div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Vendor Helpdesk Ticket</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vendor Name</label>
                <input type="text" value={newVendor} onChange={e => setNewVendor(e.target.value)} placeholder="e.g. Tata Steel Ltd" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Query Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100">
                  <option value="Payment Status">Payment Status</option>
                  <option value="MIGO / GRN Discrepancy">MIGO / GRN Discrepancy</option>
                  <option value="Statement Variance">Statement Variance</option>
                  <option value="Tax / GST Query">Tax / GST Query</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Invoice Number</label>
                  <input type="text" value={newInv} onChange={e => setNewInv(e.target.value)} placeholder="TS-2026-8891" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PO Number</label>
                  <input type="text" value={newPo} onChange={e => setNewPo(e.target.value)} placeholder="4500892100" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
              <button onClick={handleCreateTicket} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
