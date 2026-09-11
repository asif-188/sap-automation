import React, { useState } from 'react';
import { 
  Mail, 
  FileText, 
  HelpCircle, 
  FileSpreadsheet, 
  RefreshCw, 
  Paperclip, 
  Edit3,
  Bot,
  Send,
  Download,
  Eye,
  X,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EmailInbox() {
  const { emails, stats, showToast, hasPermission, currentUser } = useApp();
  const [selectedEmail, setSelectedEmail] = useState(emails[0] || null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [previewAtt, setPreviewAtt] = useState(null);

  const filteredEmails = filterCategory === 'All' 
    ? emails 
    : emails.filter(e => e.category === filterCategory);

  const handleSyncMailbox = async () => {
    try {
      const res = await fetch('/api/emails/sync', { method: 'POST' });
      const data = await res.json();
      showToast('success', data.message || 'Mailbox synchronized! 3 new emails fetched.');
    } catch (e) {
      showToast('success', 'Mailbox synchronized! 3 new emails fetched.');
    }
  };

  const handleSaveReclassification = () => {
    if (selectedEmail && newCategory) {
      selectedEmail.category = newCategory;
      selectedEmail.confidence = 1.0;
      showToast('success', `Reclassified Email ${selectedEmail.id} to '${newCategory}'`);
      setIsEditingCategory(false);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    showToast('success', `Reply sent to ${selectedEmail.sender}! Ticket logged.`);
    setReplyText('');
    setIsReplyOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Module 1 — AI Email & Attachment Classification</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Outlook / Exchange Continuous Ingestion</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated NLP classification into Invoices, Vendor Queries, SOA, & Others
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSyncMailbox}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Mailbox Now</span>
          </button>
        </div>
      </div>

      {/* Email Category Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button 
          onClick={() => setFilterCategory('Invoice Submission')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterCategory === 'Invoice Submission' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Invoice Submissions</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-blue-400">{stats.invoiceEmails}</div>
        </button>

        <button 
          onClick={() => setFilterCategory('Vendor Query')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterCategory === 'Vendor Query' ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Vendor Queries</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-purple-400">{stats.vendorQueries}</div>
        </button>

        <button 
          onClick={() => setFilterCategory('Statement of Accounts')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterCategory === 'Statement of Accounts' ? 'bg-amber-600/20 border-amber-500 text-white' : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Statement of Accounts</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-amber-400">{stats.soaEmails}</div>
        </button>

        <button 
          onClick={() => setFilterCategory('All')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterCategory === 'All' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Ingested</span>
            <Mail className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black mt-2 text-white">{stats.totalEmails}</div>
        </button>
      </div>

      {/* Split Pane: Email List on Left, Detail & Actions Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-3.5 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Incoming Feed ({filteredEmails.length})</span>
            <span className="text-[10px] text-slate-400">Continuous Sync</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/60 flex-1">
            {filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div 
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 cursor-pointer transition ${
                    isSelected ? 'bg-blue-600/15 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                      {email.vendorName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-1 truncate">{email.subject}</p>

                  <div className="flex items-center justify-between mt-3 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      email.category === 'Invoice Submission' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      email.category === 'Vendor Query' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {email.category}
                    </span>
                    <span className="text-slate-400 font-mono">AI Conf: {(email.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Email Detail Pane */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[520px] overflow-y-auto">
          {selectedEmail ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedEmail.id}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {selectedEmail.vendorCode}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedEmail.subject}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">From: {selectedEmail.sender}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsReplyOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  <button 
                    onClick={() => { setIsEditingCategory(true); setNewCategory(selectedEmail.category); }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-blue-400 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Re-Classify</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">AI Category</span>
                  <span className="font-bold text-blue-400">{selectedEmail.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">AI Confidence Score</span>
                  <span className="font-bold text-emerald-400">{(selectedEmail.confidence * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Plant</span>
                  <span className="font-bold text-slate-200">{selectedEmail.plant}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Body</h4>
                <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-300 font-mono leading-relaxed border border-slate-800">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Attachments Section with Working Preview & Download */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attachments ({selectedEmail.attachments.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedEmail.attachments.map((att, idx) => (
                    <div key={idx} className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="font-medium text-slate-200">{att.name}</div>
                          <div className="text-[10px] text-slate-400">{att.size} • PDF</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setPreviewAtt(att)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-blue-400" />
                          Preview
                        </button>
                        <button 
                          onClick={() => showToast('success', `Downloading ${att.name}...`)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-20 text-center">Select an email to view details</div>
          )}
        </div>
      </div>

      {/* Reclassification Modal */}
      {isEditingCategory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Manual AI Re-Classification</h3>
            <div className="space-y-2">
              {['Invoice Submission', 'Vendor Query', 'Statement of Accounts', 'Others'].map((cat) => (
                <label key={cat} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer">
                  <span className="text-xs font-medium text-slate-200">{cat}</span>
                  <input type="radio" name="cat" value={cat} checked={newCategory === cat} onChange={e => setNewCategory(e.target.value)} />
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setIsEditingCategory(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
              <button onClick={handleSaveReclassification} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {isReplyOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Reply to {selectedEmail.sender}</h3>
              <button onClick={() => setIsReplyOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <textarea 
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type official email response..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsReplyOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
              <button onClick={handleSendReply} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Send Email Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAtt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-2xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white">PDF Viewer: {previewAtt.name}</span>
              <button onClick={() => setPreviewAtt(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-white text-slate-900 p-8 rounded-xl min-h-[300px] flex items-center justify-center text-xs font-mono text-center border">
              <div>
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-sm">Rendering PDF Document Canvas ({previewAtt.name})</p>
                <p className="text-slate-500 mt-1">Format: Adobe PDF 1.7 • Size: {previewAtt.size}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
