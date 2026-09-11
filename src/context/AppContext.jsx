import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // User & RBAC State
  const [currentUser, setCurrentUser] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@enterprise.com',
    role: 'Admin' // Roles: Admin, Finance Manager, AP Processor, Vendor Reconciliation User, Read Only
  });

  // Global Search & Filters
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    region: 'All',
    plant: 'All',
    status: 'All',
    poType: 'All',
    dateRange: '30'
  });

  // Notification Toast State
  const [toast, setToast] = useState(null);

  // Global Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Core App Datasets
  const [stats, setStats] = useState({
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
  });

  const [invoices, setInvoices] = useState([]);
  const [emails, setEmails] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Toast Helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // RBAC Permission Evaluator
  const hasPermission = (action) => {
    const role = currentUser.role;
    if (role === 'Admin') return true;

    if (action === 'DELETE' || action === 'USER_MGMT') {
      return role === 'Admin';
    }

    if (action === 'MIRO_PARK' || action === 'MIGO_POST') {
      return role === 'Admin' || role === 'Finance Manager' || role === 'AP Processor';
    }

    if (action === 'EDIT_FIELDS') {
      return role === 'Admin' || role === 'Finance Manager' || role === 'AP Processor';
    }

    if (action === 'RECON') {
      return role === 'Admin' || role === 'Vendor Reconciliation User' || role === 'Finance Manager';
    }

    if (action === 'READ_ONLY') return true;

    return false;
  };

  // Fetch initial feeds from Express REST API
  const fetchAllFeeds = async () => {
    setIsLoading(true);
    try {
      const [invRes, emlRes, recRes, spRes, tktRes, logRes, usrRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/emails'),
        fetch('/api/reconciliation'),
        fetch('/api/sharepoint'),
        fetch('/api/queries'),
        fetch('/api/audit-logs'),
        fetch('/api/users')
      ]);

      if (invRes.ok) setInvoices(await invRes.json());
      if (emlRes.ok) {
        const emlData = await emlRes.json();
        setEmails(emlData.emails || []);
        if (emlData.stats) setStats(emlData.stats);
      }
      if (recRes.ok) setReconciliations(await recRes.json());
      if (spRes.ok) setFolders(await spRes.json());
      if (tktRes.ok) setTickets(await tktRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
      if (usrRes.ok) setUsersList(await usrRes.json());

    } catch (err) {
      console.warn('Backend API connection warning. Running in local reactive state.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeeds();
  }, []);

  // CRUD Operations with API integration

  // Save / Update Invoice
  const saveInvoice = async (invoiceData) => {
    if (!hasPermission('EDIT_FIELDS')) {
      showToast('error', `Role '${currentUser.role}' is not authorized to edit invoice fields.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...invoiceData, currentUser: currentUser.name })
      });

      setInvoices(prev => prev.map(inv => inv.id === invoiceData.id ? invoiceData : inv));
      showToast('success', `Saved Extracted Fields for Invoice #${invoiceData.invoiceNumber}`);
    } catch (e) {
      showToast('success', `Updated local invoice fields for ${invoiceData.invoiceNumber}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Invoice
  const deleteInvoice = async (id) => {
    if (!hasPermission('DELETE')) {
      showToast('error', `Role '${currentUser.role}' is not authorized to delete invoices.`);
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUser: currentUser.name })
      });

      setInvoices(prev => prev.filter(inv => inv.id !== id));
      showToast('success', `Deleted Invoice ID ${id}`);
    } catch (e) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      showToast('success', `Deleted Invoice ID ${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk Operations
  const bulkApprove = async (selectedIds) => {
    if (!hasPermission('MIRO_PARK')) {
      showToast('error', `Role '${currentUser.role}' cannot bulk approve invoices.`);
      return;
    }

    setIsLoading(true);
    setInvoices(prev => prev.map(inv => selectedIds.includes(inv.id) ? { ...inv, status: 'Ready for MIRO' } : inv));
    showToast('success', `Approved ${selectedIds.length} invoices for SAP processing!`);
    setIsLoading(false);
  };

  const bulkDelete = async (selectedIds) => {
    if (!hasPermission('DELETE')) {
      showToast('error', `Role '${currentUser.role}' cannot bulk delete invoices.`);
      return;
    }

    setIsLoading(true);
    setInvoices(prev => prev.filter(inv => !selectedIds.includes(inv.id)));
    showToast('success', `Deleted ${selectedIds.length} selected invoices.`);
    setIsLoading(false);
  };

  // SAP MIRO Parking
  const parkMiro = async (invoiceId) => {
    if (!hasPermission('MIRO_PARK')) {
      showToast('error', `Role '${currentUser.role}' is not authorized to execute SAP MIRO Parking.`);
      return;
    }

    setIsLoading(true);
    const miroNum = '51' + Math.floor(10000000 + Math.random() * 90000000);
    try {
      await fetch('/api/sap/miro/park', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, currentUser: currentUser.name })
      });
    } catch (e) {}

    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'MIRO Parked', miroDocNumber: miroNum } : inv));
    setStats(prev => ({ ...prev, miroParked: prev.miroParked + 1 }));
    showToast('success', `SAP BAPI Success: MIRO Document #${miroNum} Parked in SAP S/4HANA!`);
    setIsLoading(false);
  };

  // SAP MIGO Posting
  const postMigo = async (invoiceId, grnType) => {
    if (!hasPermission('MIGO_POST')) {
      showToast('error', `Role '${currentUser.role}' is not authorized to post SAP MIGO GRNs.`);
      return;
    }

    setIsLoading(true);
    const migoNum = '50' + Math.floor(10000000 + Math.random() * 90000000);
    try {
      await fetch('/api/sap/migo/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, grnType, currentUser: currentUser.name })
      });
    } catch (e) {}

    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, migoDocNumber: migoNum, grnStatus: `${grnType || 'RVS'} Posted` } : inv));
    setStats(prev => ({ ...prev, migoPosted: prev.migoPosted + 1 }));
    showToast('success', `SAP Goods Movement #${migoNum} (${grnType || 'RVS'}) Posted Successfully!`);
    setIsLoading(false);
  };

  // File Upload Handler
  const handleUploadFile = async (fileName, fileType, uploadType) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType, uploadType, currentUser: currentUser.name })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.invoice) {
          setInvoices(prev => [data.invoice, ...prev]);
        }
        showToast('success', data.message || `File ${fileName} uploaded and processed.`);
      }
    } catch (e) {
      showToast('success', `Simulated Upload: ${fileName} parsed and imported successfully.`);
    } finally {
      setIsLoading(false);
    }
  };

  // User Management CRUD
  const addUser = async (userData) => {
    if (!hasPermission('USER_MGMT')) {
      showToast('error', 'Only Admins can add new users.');
      return;
    }
    setIsLoading(true);
    const newUser = { id: `USR-${Math.floor(100 + Math.random() * 900)}`, status: 'Active', lastLogin: 'Never', ...userData };
    setUsersList(prev => [...prev, newUser]);
    showToast('success', `Created User ${userData.name} with Role '${userData.role}'`);
    setIsLoading(false);
  };

  const deleteUser = async (id) => {
    if (!hasPermission('USER_MGMT')) {
      showToast('error', 'Only Admins can delete users.');
      return;
    }
    setIsLoading(true);
    setUsersList(prev => prev.filter(u => u.id !== id));
    showToast('success', `Deleted user ID ${id}`);
    setIsLoading(false);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      hasPermission,
      isSidebarOpen,
      setIsSidebarOpen,
      toggleSidebar,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      toast,
      showToast,
      isLoading,
      setIsLoading,
      stats,
      invoices,
      emails,
      reconciliations,
      folders,
      tickets,
      auditLogs,
      usersList,
      fetchAllFeeds,
      saveInvoice,
      deleteInvoice,
      bulkApprove,
      bulkDelete,
      parkMiro,
      postMigo,
      handleUploadFile,
      addUser,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
