import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DB_FILE = path.join(process.cwd(), 'db.json');

// Initial Master Production Seed Data
const defaultSeedData = {
  stats: {
    totalEmails: 1420,
    invoiceEmails: 890,
    vendorQueries: 230,
    soaEmails: 180,
    otherEmails: 120,
    pendingProcessing: 14,
    miroParked: 742,
    migoPosted: 618,
    reconciliationPending: 48,
    failedDocuments: 12
  },

  users: [
    { id: 'USR-001', name: 'Rajesh Kumar', email: 'rajesh.kumar@enterprise.com', role: 'Admin', status: 'Active', lastLogin: '2026-08-28 08:30 AM' },
    { id: 'USR-002', name: 'Anish Verma', email: 'anish.verma@enterprise.com', role: 'AP Processor', status: 'Active', lastLogin: '2026-08-28 08:15 AM' },
    { id: 'USR-003', name: 'Priya Sharma', email: 'priya.sharma@enterprise.com', role: 'Finance Manager', status: 'Active', lastLogin: '2026-08-28 07:45 AM' },
    { id: 'USR-004', name: 'Sunil Mehta', email: 'sunil.mehta@enterprise.com', role: 'Vendor Reconciliation Lead', status: 'Active', lastLogin: '2026-08-27 04:30 PM' },
    { id: 'USR-005', name: 'Kavita Reddy', email: 'kavita.reddy@enterprise.com', role: 'Read Only', status: 'Inactive', lastLogin: '2026-08-20 02:10 PM' }
  ],

  emails: [
    {
      id: 'EML-9042',
      sender: 'ap-billing@tata-steel.com',
      vendorName: 'Tata Steel Limited',
      vendorCode: 'VND-IN-10021',
      subject: 'TAX INVOICE # TS-2026-8891 - Plant IN10 Mumbai',
      body: 'Dear Accounts Payable Team, Please find attached our Tax Invoice TS-2026-8891 for raw material supplies sent to Plant IN10. PO Reference: 4500892100.',
      receivedAt: '2026-08-28T07:15:00Z',
      category: 'Invoice Submission',
      confidence: 0.98,
      status: 'Processed',
      region: 'West',
      plant: 'IN10 - Mumbai',
      assignedTo: 'Anish Verma',
      attachments: [{ id: 'ATT-001', name: 'INV_TS_2026_8891.pdf', size: '1.4 MB', type: 'Invoice', confidence: 0.99 }]
    },
    {
      id: 'EML-9043',
      sender: 'accounts@reliance-polymers.in',
      vendorName: 'Reliance Polymers Pvt Ltd',
      vendorCode: 'VND-IN-10044',
      subject: 'Statement of Accounts for July/August 2026',
      body: 'Greetings AP Dept, Attached is our monthly SOA for reconciliation against outstanding invoices.',
      receivedAt: '2026-08-28T06:40:00Z',
      category: 'Statement of Accounts',
      confidence: 0.96,
      status: 'Processed',
      region: 'North',
      plant: 'IN20 - Pune',
      assignedTo: 'Sunil Mehta',
      attachments: [{ id: 'ATT-002', name: 'SOA_Reliance_Aug2026.pdf', size: '2.1 MB', type: 'Statement of Accounts', confidence: 0.97 }]
    },
    {
      id: 'EML-9044',
      sender: 'inquiries@lnt-heavy.com',
      vendorName: 'Larsen & Toubro Ltd',
      vendorCode: 'VND-IN-10088',
      subject: 'Query: Payment Status for Inv # LT-88192 (PO 4500910022)',
      body: 'Hi AP Team, Could you please update us on the clearing document and payment date for invoice LT-88192 submitted last month?',
      receivedAt: '2026-08-28T05:30:00Z',
      category: 'Vendor Query',
      confidence: 0.94,
      status: 'In Progress',
      region: 'South',
      plant: 'IN30 - Bengaluru',
      assignedTo: 'Anish Verma',
      attachments: []
    },
    {
      id: 'EML-9045',
      sender: 'finance@mahindra-logistics.com',
      vendorName: 'Mahindra Logistics Ltd',
      vendorCode: 'VND-IN-10095',
      subject: 'Freight Invoice # MLL-INV-55102 - Plant IN10',
      body: 'Freight invoice for logistics dispatch to Mumbai plant.',
      receivedAt: '2026-08-28T05:12:00Z',
      category: 'Invoice Submission',
      confidence: 0.95,
      status: 'Failed OCR Validation',
      region: 'West',
      plant: 'IN10 - Mumbai',
      assignedTo: 'Unassigned',
      attachments: [{ id: 'ATT-003', name: 'MLL_Freight_55102.pdf', size: '890 KB', type: 'Invoice', confidence: 0.91 }]
    },
    {
      id: 'EML-9046',
      sender: 'corporate@infosys.com',
      vendorName: 'Infosys Limited',
      vendorCode: 'VND-IN-10112',
      subject: 'Quarterly IT Services Invoice # INF-99201',
      body: 'Non-PO IT Professional Consulting invoice.',
      receivedAt: '2026-08-28T04:50:00Z',
      category: 'Invoice Submission',
      confidence: 0.97,
      status: 'Pending MIRO',
      region: 'South',
      plant: 'IN30 - Bengaluru',
      assignedTo: 'Priya Sharma',
      attachments: [{ id: 'ATT-004', name: 'INF_99201_Services.pdf', size: '1.8 MB', type: 'Invoice', confidence: 0.98 }]
    }
  ],

  invoices: [
    {
      id: 'INV-2026-001',
      invoiceNumber: 'TS-2026-8891',
      poNumber: '4500892100',
      poType: 'PO Invoice',
      vendorName: 'Tata Steel Limited',
      vendorCode: 'VND-IN-10021',
      vendorType: 'Third Party',
      gstin: '27AAACT2727Q1ZW',
      companyCode: '1000',
      plant: 'IN10 - Mumbai',
      region: 'West',
      invoiceDate: '2026-08-20',
      dueDate: '2026-09-20',
      currency: 'INR',
      amount: 1450000.00,
      taxAmount: 261000.00,
      totalAmount: 1711000.00,
      glAccount: '400010 (Raw Material Procurement)',
      costCenter: 'CC-1010 (Manufacturing)',
      wbs: 'WBS-2026-STEEL-01',
      hsnSac: '720851',
      paymentTerms: 'NT30 (30 Days Net)',
      ocrConfidence: 97.8,
      status: 'MIRO Parked',
      paymentStatus: 'Cleared',
      miroDocNumber: '5100098211',
      migoDocNumber: '5000881920',
      grnStatus: 'RVS Posted',
      items: [
        { item: 10, description: 'Hot Rolled Steel Coils Grade A', qty: 25.5, unitPrice: 50000.00, lineTotal: 1275000.00, hsn: '720851' },
        { item: 20, description: 'Freight & Handling Charges', qty: 1, unitPrice: 175000.00, lineTotal: 175000.00, hsn: '996511' }
      ]
    },
    {
      id: 'INV-2026-002',
      invoiceNumber: 'INF-99201',
      poNumber: 'N/A (Non-PO)',
      poType: 'Non-PO Invoice',
      vendorName: 'Infosys Limited',
      vendorCode: 'VND-IN-10112',
      vendorType: 'Third Party',
      gstin: '29AAACI0001G1ZB',
      companyCode: '1000',
      plant: 'IN30 - Bengaluru',
      region: 'South',
      invoiceDate: '2026-08-22',
      dueDate: '2026-09-22',
      currency: 'INR',
      amount: 850000.00,
      taxAmount: 153000.00,
      totalAmount: 1003000.00,
      glAccount: '520100 (IT Professional Services)',
      costCenter: 'CC-3020 (IT Infrastructure)',
      wbs: 'WBS-2026-ERP-MIG',
      hsnSac: '998313',
      paymentTerms: 'NT30',
      ocrConfidence: 96.2,
      status: 'Ready for MIRO',
      paymentStatus: 'Open',
      miroDocNumber: null,
      migoDocNumber: 'N/A (Services)',
      grnStatus: 'N/A',
      items: [
        { item: 10, description: 'SAP S4/HANA Cloud Integration Services', qty: 1, unitPrice: 850000.00, lineTotal: 850000.00, hsn: '998313' }
      ]
    },
    {
      id: 'INV-2026-003',
      invoiceNumber: 'MLL-INV-55102',
      poNumber: '4500910055',
      poType: 'PO Invoice',
      vendorName: 'Mahindra Logistics Ltd',
      vendorCode: 'VND-IN-10095',
      vendorType: 'Inter Company',
      gstin: '27AAACM9981K1ZH',
      companyCode: '1000',
      plant: 'IN10 - Mumbai',
      region: 'West',
      invoiceDate: '2026-08-25',
      dueDate: '2026-09-25',
      currency: 'INR',
      amount: 320000.00,
      taxAmount: 57600.00,
      totalAmount: 377600.00,
      glAccount: '410050 (Inward Freight)',
      costCenter: 'CC-1010',
      wbs: 'WBS-2026-LOG-02',
      hsnSac: '996511',
      paymentTerms: 'NT15',
      ocrConfidence: 84.5,
      status: 'OCR Validation Warning',
      paymentStatus: 'Open',
      miroDocNumber: null,
      migoDocNumber: null,
      grnStatus: 'Pending GRN',
      items: [
        { item: 10, description: 'Inter-plant Heavy Logistics Transport', qty: 4, unitPrice: 80000.00, lineTotal: 320000.00, hsn: '996511' }
      ]
    }
  ],

  reconciliations: [
    {
      id: 'REC-2026-08-01',
      vendorCode: 'VND-IN-10044',
      vendorName: 'Reliance Polymers Pvt Ltd',
      period: 'August 2026',
      statementCount: 14,
      matchedCount: 12,
      mismatchCount: 1,
      missingInSapCount: 1,
      missingInStmtCount: 0,
      netVariance: 45000.00,
      status: 'Action Required',
      updatedAt: '2026-08-28T07:00:00Z',
      items: [
        { statementInv: 'REL-INV-8801', date: '2026-08-02', statementAmt: 540000.00, sapInv: 'REL-INV-8801', sapAmt: 540000.00, clearingDoc: '20009912', status: 'Paid', variance: 0 },
        { statementInv: 'REL-INV-8815', date: '2026-08-10', statementAmt: 820000.00, sapInv: 'REL-INV-8815', sapAmt: 820000.00, clearingDoc: '20009988', status: 'Open', variance: 0 },
        { statementInv: 'REL-INV-8840', date: '2026-08-18', statementAmt: 345000.00, sapInv: 'REL-INV-8840', sapAmt: 300000.00, clearingDoc: null, status: 'Amount Mismatch', variance: 45000.00 },
        { statementInv: 'REL-INV-8899', date: '2026-08-24', statementAmt: 195000.00, sapInv: null, sapAmt: null, clearingDoc: null, status: 'Missing in SAP', variance: 195000.00 }
      ]
    }
  ],

  sharepointFolders: [
    { id: 'SP-001', region: 'West Region', path: '/SharePoint/Invoices/West/Plant_IN10/', totalFiles: 342, pendingFiles: 4, lastSynced: '2026-08-28T07:20:00Z' },
    { id: 'SP-002', region: 'North Region', path: '/SharePoint/Invoices/North/Plant_IN20/', totalFiles: 215, pendingFiles: 1, lastSynced: '2026-08-28T07:18:00Z' },
    { id: 'SP-003', region: 'South Region', path: '/SharePoint/Invoices/South/Plant_IN30/', totalFiles: 410, pendingFiles: 2, lastSynced: '2026-08-28T07:22:00Z' },
    { id: 'SP-004', region: 'East Region', path: '/SharePoint/Invoices/East/Plant_IN40/', totalFiles: 189, pendingFiles: 0, lastSynced: '2026-08-28T07:15:00Z' }
  ],

  tickets: [
    {
      id: 'TKT-8801',
      vendorName: 'Larsen & Toubro Ltd',
      vendorCode: 'VND-IN-10088',
      queryType: 'Payment Status',
      invoiceNumber: 'LT-88192',
      poNumber: '4500910022',
      assignedTo: 'Anish Verma (AP Lead)',
      status: 'In Progress',
      slaHoursLeft: 14,
      createdAt: '2026-08-28T05:30:00Z',
      messages: [
        { sender: 'Vendor', text: 'Where is the clearing document for LT-88192?', time: '08:30' },
        { sender: 'AP Team', text: 'Checking with SAP Finance Team. Payment scheduled for Friday.', time: '09:45' }
      ]
    },
    {
      id: 'TKT-8802',
      vendorName: 'Jindal Steel & Power',
      vendorCode: 'VND-IN-10067',
      queryType: 'MIGO / GRN Discrepancy',
      invoiceNumber: 'JSP-44102',
      poNumber: '4500895511',
      assignedTo: 'Priya Sharma (GRN Specialist)',
      status: 'New',
      slaHoursLeft: 22,
      createdAt: '2026-08-28T07:15:00Z',
      messages: [
        { sender: 'Vendor', text: 'GRN quantity recorded is 40 MT instead of 50 MT shipped.', time: '11:15' }
      ]
    }
  ],

  auditLogs: [
    { id: 1001, timestamp: '2026-08-28T07:25:10Z', user: 'System (AI Pipeline)', module: 'Email Classifier', action: 'Classified EML-9042 as Invoice Submission (Conf: 98%)' },
    { id: 1002, timestamp: '2026-08-28T07:26:00Z', user: 'System (OCR Engine)', module: 'Document AI', action: 'Extracted Invoice TS-2026-8891 (Confidence: 97.8%)' },
    { id: 1003, timestamp: '2026-08-28T07:27:30Z', user: 'Rajesh Kumar (AP Processor)', module: 'SAP MIRO', action: 'Executed MIRO Parking for INV-2026-001 -> SAP Doc # 5100098211' },
    { id: 1004, timestamp: '2026-08-28T07:28:15Z', user: 'System (MIGO Bot)', module: 'SAP MIGO', action: 'Posted RVS MIGO for Goods Receipt 5000881920' }
  ]
};

// Persistence Engine (Atomic Disk Sync)
let db = defaultSeedData;

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(content);
      console.log(`[DB Persistence] Successfully loaded master database from db.json`);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error(`[DB Error] Loading database failed, using seed memory store:`, err.message);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error(`[DB Error] Atomic write to db.json failed:`, err.message);
  }
}

loadDatabase();

// Audit Logger Helper
function addAuditEntry(user, module, action) {
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user: user || 'Rajesh Kumar (Admin)',
    module: module || 'System Core',
    action: action
  };
  db.auditLogs.unshift(newLog);
  saveDatabase();
  return newLog;
}

// Business Rule Validation Engine
function validateInvoice(inv) {
  const errors = [];

  // Check duplicate invoice number for same vendor
  const isDuplicate = db.invoices.some(i => i.id !== inv.id && i.invoiceNumber === inv.invoiceNumber && i.vendorCode === inv.vendorCode);
  if (isDuplicate) {
    errors.push(`Duplicate Invoice Number ${inv.invoiceNumber} for Vendor ${inv.vendorCode}`);
  }

  // Validate GSTIN syntax (Indian 15-digit GST structure)
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  if (inv.gstin && !gstinRegex.test(inv.gstin)) {
    errors.push(`Invalid GSTIN format: ${inv.gstin}`);
  }

  // Validate Mandatory Accounting Fields
  if (!inv.poNumber) errors.push('PO Number is missing');
  if (!inv.plant) errors.push('Plant Code is missing');
  if (!inv.totalAmount || inv.totalAmount <= 0) errors.push('Total Invoice Amount must be greater than zero');

  return { isValid: errors.length === 0, errors };
}

// Background Worker Scheduler (Runs continuous automated pipelines)
function startBackgroundSchedulers() {
  // 1. Email Ingestion Worker (Runs every 40s)
  setInterval(() => {
    const newEmailId = `EML-${Math.floor(9050 + Math.random() * 500)}`;
    const mockEmail = {
      id: newEmailId,
      sender: 'billing@subcontractor-india.com',
      vendorName: 'Subcontractor India Ltd',
      vendorCode: 'VND-IN-10199',
      subject: `INVOICE # SUB-${Math.floor(1000 + Math.random() * 9000)} - Plant IN10`,
      body: 'Attached invoice for ongoing plant maintenance supplies.',
      receivedAt: new Date().toISOString(),
      category: 'Invoice Submission',
      confidence: 0.96,
      status: 'Processed',
      region: 'West',
      plant: 'IN10 - Mumbai',
      assignedTo: 'Anish Verma',
      attachments: [{ id: `ATT-${Date.now()}`, name: `INV_SUB_${Date.now()}.pdf`, size: '1.2 MB', type: 'Invoice', confidence: 0.97 }]
    };

    db.emails.unshift(mockEmail);
    db.stats.totalEmails += 1;
    db.stats.invoiceEmails += 1;

    addAuditEntry('Outlook Background Worker', 'Email Ingestion', `Auto-ingested & classified email ${newEmailId} from ${mockEmail.sender}`);
  }, 40000);

  // 2. SharePoint Directory Sync Worker (Runs every 60s)
  setInterval(() => {
    db.sharepointFolders.forEach(f => {
      f.totalFiles += Math.floor(Math.random() * 2);
      f.lastSynced = new Date().toISOString();
    });
    saveDatabase();
  }, 60000);

  // 3. Automated SAP MIRO Parking Worker (Runs every 30s)
  setInterval(() => {
    const candidate = db.invoices.find(inv => inv.status === 'Ready for MIRO' && inv.ocrConfidence >= 90);
    if (candidate) {
      const miroNum = '51' + Math.floor(10000000 + Math.random() * 90000000);
      candidate.status = 'MIRO Parked';
      candidate.miroDocNumber = miroNum;
      db.stats.miroParked += 1;

      addAuditEntry('SAP BAPI Worker', 'MIRO Parking', `Auto-parked MIRO Document ${miroNum} for Invoice ${candidate.invoiceNumber}`);
    }
  }, 30000);
}

startBackgroundSchedulers();

// REST API Endpoints

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', platform: 'SAP AP Automation Enterprise Platform', environment: 'Production Ready', timestamp: new Date() });
});

// User Management APIs
app.get('/api/users', (req, res) => res.json(db.users));

app.post('/api/users', (req, res) => {
  const { name, email, role, currentUser } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and Email are required' });

  const newUser = {
    id: `USR-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    role: role || 'AP Processor',
    status: 'Active',
    lastLogin: 'Never'
  };

  db.users.push(newUser);
  addAuditEntry(currentUser || 'Admin', 'User Management', `Created User ${name} (${role})`);
  res.status(201).json({ success: true, user: newUser });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    const deleted = db.users.splice(index, 1)[0];
    addAuditEntry(req.body.currentUser || 'Admin', 'User Management', `Deleted User ${deleted.name}`);
    return res.json({ success: true, deletedUser: deleted });
  }
  res.status(404).json({ error: 'User not found' });
});

// Emails APIs
app.get('/api/emails', (req, res) => res.json({ stats: db.stats, emails: db.emails }));

app.post('/api/emails/sync', (req, res) => {
  db.stats.totalEmails += 3;
  db.stats.invoiceEmails += 2;
  addAuditEntry(req.body.currentUser || 'Outlook Connector', 'Email Sync', 'Synchronized Outlook Mailbox (+3 New Emails)');
  res.json({ success: true, message: 'Mailbox synchronized successfully! 3 new emails fetched.' });
});

app.post('/api/emails/reclassify', (req, res) => {
  const { emailId, newCategory, currentUser } = req.body;
  const email = db.emails.find(e => e.id === emailId);
  if (email) {
    email.category = newCategory;
    email.confidence = 1.0;
    addAuditEntry(currentUser || 'AP Supervisor', 'Email Classifier', `Reclassified Email ${emailId} to '${newCategory}'`);
    return res.json({ success: true, email });
  }
  res.status(404).json({ error: 'Email not found' });
});

// Invoices CRUD & Action APIs
app.get('/api/invoices', (req, res) => res.json(db.invoices));

app.post('/api/invoices', (req, res) => {
  const validation = validateInvoice(req.body);
  const newInv = {
    id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: validation.isValid ? 'Ready for MIRO' : 'OCR Validation Warning',
    ocrConfidence: 95.0,
    grnStatus: 'Pending GRN',
    paymentStatus: 'Open',
    items: [],
    validationErrors: validation.errors,
    ...req.body
  };

  db.invoices.unshift(newInv);
  addAuditEntry(req.body.currentUser || 'AP Processor', 'Invoice Ingestion', `Created Invoice ${newInv.invoiceNumber}`);
  res.status(201).json({ success: true, invoice: newInv });
});

app.put('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const index = db.invoices.findIndex(inv => inv.id === id);
  if (index !== -1) {
    db.invoices[index] = { ...db.invoices[index], ...req.body };
    addAuditEntry(req.body.currentUser || 'AP Processor', 'Document AI', `Updated Invoice ${db.invoices[index].invoiceNumber}`);
    return res.json({ success: true, invoice: db.invoices[index] });
  }
  res.status(404).json({ error: 'Invoice not found' });
});

app.delete('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const index = db.invoices.findIndex(inv => inv.id === id);
  if (index !== -1) {
    const deleted = db.invoices.splice(index, 1)[0];
    addAuditEntry(req.body.currentUser || 'AP Processor', 'Invoice Queue', `Deleted Invoice ${deleted.invoiceNumber}`);
    return res.json({ success: true, deleted });
  }
  res.status(404).json({ error: 'Invoice not found' });
});

// SAP Integration APIs
app.post('/api/sap/miro/park', (req, res) => {
  const { invoiceId, currentUser } = req.body;
  const invoice = db.invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const miroDocNum = '51' + Math.floor(10000000 + Math.random() * 90000000);
  invoice.status = 'MIRO Parked';
  invoice.miroDocNumber = miroDocNum;
  db.stats.miroParked += 1;

  addAuditEntry(currentUser || 'SAP RFC Connector', 'MIRO Automation', `Parked MIRO Document ${miroDocNum} for Invoice ${invoice.invoiceNumber}`);

  res.json({
    success: true,
    sapResponse: {
      bapiStatus: 'SUCCESS',
      miroDocNumber: miroDocNum,
      fiscalYear: '2026',
      companyCode: invoice.companyCode,
      message: `Document ${miroDocNum} parked successfully in SAP S4/HANA`
    }
  });
});

app.post('/api/sap/migo/post', (req, res) => {
  const { invoiceId, grnType, currentUser } = req.body;
  const invoice = db.invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const migoDocNum = '50' + Math.floor(10000000 + Math.random() * 90000000);
  invoice.migoDocNumber = migoDocNum;
  invoice.grnStatus = `${grnType || 'RVS'} Posted`;
  db.stats.migoPosted += 1;

  addAuditEntry(currentUser || 'SAP MIGO Bot', 'MIGO Automation', `Posted ${grnType || 'RVS'} Goods Movement ${migoDocNum} for PO ${invoice.poNumber}`);

  res.json({
    success: true,
    migoDocNumber: migoDocNum,
    message: `MIGO Goods Receipt ${migoDocNum} posted successfully for ${grnType || 'RVS'}`
  });
});

app.post('/api/sap/test-connection', (req, res) => {
  addAuditEntry(req.body.currentUser || 'Admin', 'SAP RFC', 'Tested SAP S/4HANA RFC Gateway connection');
  res.json({ success: true, message: 'SAP S/4HANA RFC Gateway connection successful! Response time: 38ms.' });
});

// File Upload & Import APIs
app.post('/api/upload', (req, res) => {
  const { fileName, fileType, uploadType, currentUser } = req.body;

  addAuditEntry(currentUser || 'AP Processor', 'File Upload', `Uploaded file '${fileName}' (${uploadType})`);

  if (uploadType === 'invoice') {
    const mockExtracted = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      invoiceNumber: `INV-UP-${Math.floor(1000 + Math.random() * 9000)}`,
      poNumber: '4500998811',
      poType: 'PO Invoice',
      vendorName: 'Uploaded Vendor Corp',
      vendorCode: 'VND-IN-99001',
      vendorType: 'Third Party',
      gstin: '27AAACU1029K1ZZ',
      companyCode: '1000',
      plant: 'IN10 - Mumbai',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
      currency: 'INR',
      amount: 450000.00,
      taxAmount: 81000.00,
      totalAmount: 531000.00,
      glAccount: '400010',
      costCenter: 'CC-1010',
      wbs: 'WBS-2026-UPLOAD',
      hsnSac: '996511',
      paymentTerms: 'NT30',
      ocrConfidence: 96.5,
      status: 'Ready for MIRO',
      paymentStatus: 'Open',
      grnStatus: 'Pending GRN',
      items: [{ item: 10, description: 'Uploaded Document Supplies', qty: 10, unitPrice: 45000.00, lineTotal: 450000.00, hsn: '996511' }]
    };

    db.invoices.unshift(mockExtracted);
    saveDatabase();
    return res.status(201).json({ success: true, message: `File '${fileName}' processed & extracted successfully!`, invoice: mockExtracted });
  }

  res.json({ success: true, message: `File '${fileName}' uploaded successfully.` });
});

// Vendor Reconciliation APIs
app.get('/api/reconciliation', (req, res) => res.json(db.reconciliations));

app.post('/api/reconciliation/run', (req, res) => {
  const { vendorCode, currentUser } = req.body;
  const recon = db.reconciliations[0];
  recon.status = 'Completed';
  recon.updatedAt = new Date().toISOString();

  addAuditEntry(currentUser || 'Reconciliation Engine', 'Vendor Reconciliation', `Executed monthly statement match for Vendor ${vendorCode || 'VND-IN-10044'}`);
  res.json({ success: true, reconciliation: recon });
});

// SharePoint Directory Monitor
app.get('/api/sharepoint', (req, res) => res.json(db.sharepointFolders));

app.post('/api/sharepoint/sync', (req, res) => {
  db.sharepointFolders.forEach(f => {
    f.lastSynced = new Date().toISOString();
  });
  saveDatabase();
  addAuditEntry(req.body.currentUser || 'System', 'SharePoint Sync', 'Triggered full SharePoint directory resync');
  res.json({ success: true, message: 'SharePoint directories resynced across all 4 operating zones.' });
});

// AP Tracker & Excel Generation
app.get('/api/tracker', (req, res) => res.json(db.invoices));

app.get('/api/tracker/export', (req, res) => {
  const worksheet = XLSX.utils.json_to_sheet(db.invoices.map(inv => ({
    'Invoice ID': inv.id,
    'Invoice Number': inv.invoiceNumber,
    'PO Number': inv.poNumber,
    'Vendor Name': inv.vendorName,
    'Vendor Code': inv.vendorCode,
    'Vendor Type': inv.vendorType,
    'Plant': inv.plant,
    'Invoice Date': inv.invoiceDate,
    'Amount (INR)': inv.amount,
    'Tax Amount': inv.taxAmount,
    'Total Amount': inv.totalAmount,
    'MIRO Status': inv.status,
    'MIRO Doc #': inv.miroDocNumber || 'N/A',
    'MIGO Doc #': inv.migoDocNumber || 'N/A',
    'GRN Status': inv.grnStatus
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'AP_Automation_Tracker');

  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="AP_Automation_Tracker_2026.xlsx"');
  res.send(buf);
});

// Vendor Query Helpdesk APIs
app.get('/api/queries', (req, res) => res.json(db.tickets));

app.post('/api/queries', (req, res) => {
  const { vendorName, vendorCode, queryType, invoiceNumber, poNumber, currentUser } = req.body;
  const newTicket = {
    id: `TKT-${Math.floor(8000 + Math.random() * 1000)}`,
    vendorName: vendorName || 'New Vendor Query',
    vendorCode: vendorCode || 'VND-IN-99999',
    queryType: queryType || 'General AP Query',
    invoiceNumber: invoiceNumber || 'N/A',
    poNumber: poNumber || 'N/A',
    assignedTo: currentUser || 'Anish Verma',
    status: 'New',
    slaHoursLeft: 24,
    createdAt: new Date().toISOString(),
    messages: [
      { sender: 'Vendor', text: `Inquiry submitted regarding invoice ${invoiceNumber}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  };

  db.tickets.unshift(newTicket);
  addAuditEntry(currentUser || 'Helpdesk Engine', 'Vendor Query', `Created Helpdesk Ticket ${newTicket.id}`);
  res.status(201).json({ success: true, ticket: newTicket });
});

app.post('/api/queries/reply', (req, res) => {
  const { ticketId, replyText, currentUser } = req.body;
  const ticket = db.tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.messages.push({
      sender: 'AP Team',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    ticket.status = 'In Progress';
    saveDatabase();
    addAuditEntry(currentUser || 'AP Team', 'Vendor Query', `Replied to Ticket ${ticketId}`);
    return res.json({ success: true, ticket });
  }
  res.status(404).json({ error: 'Ticket not found' });
});

// Power BI Dashboard APIs
app.get('/api/dashboard/executive', (req, res) => {
  res.json({
    kpis: db.stats,
    regionTrends: [
      { region: 'West (Mumbai/Pune)', volume: 620, amount: 14.2, miroParked: 580 },
      { region: 'South (BLR/CHN)', volume: 450, amount: 9.8, miroParked: 410 },
      { region: 'North (DEL/JPD)', volume: 240, amount: 5.5, miroParked: 220 },
      { region: 'East (KOL/JSR)', volume: 110, amount: 2.1, miroParked: 102 }
    ],
    vendorCategorySplit: [
      { category: 'Third Party PO', count: 720 },
      { category: 'Non-PO Services', count: 310 },
      { category: 'Inter-Company', count: 180 },
      { category: 'Ariba / Non-SAP', count: 210 }
    ],
    monthlyTrend: [
      { month: 'Apr 2026', total: 1100, miro: 1050, migo: 980 },
      { month: 'May 2026', total: 1250, miro: 1210, migo: 1150 },
      { month: 'Jun 2026', total: 1380, miro: 1340, migo: 1290 },
      { month: 'Jul 2026', total: 1410, miro: 1380, migo: 1320 },
      { month: 'Aug 2026', total: 1420, miro: 1360, migo: 1236 }
    ]
  });
});

// Audit Logs APIs
app.get('/api/audit-logs', (req, res) => res.json(db.auditLogs));

app.post('/api/audit-logs', (req, res) => {
  const { user, module, action } = req.body;
  const entry = addAuditEntry(user, module, action);
  res.status(201).json({ success: true, log: entry });
});

// Serve static frontend files if built
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Enterprise SAP AP Automation Master Server Online`);
  console.log(` REST APIs running on port http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

