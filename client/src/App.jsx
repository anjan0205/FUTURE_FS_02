import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState({ name: '', email: '', source: 'Website' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const leadsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLeads(leadsData);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        status: 'New',
        notes: [],
        createdAt: serverTimestamp(),
      });
      setShowAddModal(false);
      setNewLead({ name: '', email: '', source: 'Website' });
      fetchLeads();
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      await fetchLeads();
      setSelectedLead(prev => prev && prev.id === id ? { ...prev, status } : prev);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addNote = async (id, noteText) => {
    try {
      const newNote = { content: noteText, createdAt: new Date().toISOString() };
      await updateDoc(doc(db, 'leads', id), {
        notes: arrayUnion(newNote),
      });
      await fetchLeads();
      setSelectedLead(prev => {
        if (!prev || prev.id !== id) return prev;
        return { ...prev, notes: [...(prev.notes || []), newNote] };
      });
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        setSelectedLead(null);
        fetchLeads();
      } catch (err) {
        console.error('Error deleting lead:', err);
      }
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, colorClass: 'primary' },
    { label: 'Follow-ups', value: leads.filter(l => l.status === 'Contacted').length, icon: Clock, colorClass: 'warning' },
    { label: 'Successes', value: leads.filter(l => l.status === 'Converted').length, icon: CheckCircle, colorClass: 'success' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-brand">
          <div className="header-icon">
            <Users size={24} />
          </div>
          <div>
            <h1>Mini CRM</h1>
            <p>Professional Lead Management</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <PlusCircle size={18} />
          Add New Lead
        </button>
      </motion.header>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div>
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
            <div className={`stat-icon ${stat.colorClass}`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="glass-card">
          <div className="controls-bar">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <Filter size={16} />
              Filter Results
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Lead Info</th>
                  <th>Origin</th>
                  <th>Current Status</th>
                  <th>Date Logged</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredLeads.map((lead, idx) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td>
                        <div className="lead-name">{lead.name}</div>
                        <div className="lead-email">{lead.email}</div>
                      </td>
                      <td>
                        <span className="source-badge">{lead.source}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${lead.status?.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {lead.createdAt?.toDate
                            ? lead.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="chevron-btn" style={{ padding: '8px', color: '#94a3b8' }}>
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredLeads.length === 0 && !loading && (
              <div className="empty-state">No leads available. Add your first lead to begin.</div>
            )}
            {loading && (
              <div className="loading-state">Updating...</div>
            )}
          </div>
        </div>
      </motion.main>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-backdrop">
            <motion.div
              className="modal-overlay"
              onClick={() => setShowAddModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            />
            <motion.div
              className="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 style={{ marginBottom: '24px' }}>New Lead Acquisition</h2>
              <form onSubmit={handleCreateLead}>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    required
                    type="text"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    required
                    type="email"
                    value={newLead.email}
                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="name@company.com"
                  />
                </div>
                <div className="input-group" style={{ marginBottom: '24px' }}>
                  <label>Source</label>
                  <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                    <option>Website</option>
                    <option>Referral</option>
                    <option>LinkedIn</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Lead</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <div className="drawer-backdrop">
            <motion.div
              className="drawer-overlay"
              onClick={() => setSelectedLead(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            />
            <motion.div
              className="drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 300 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lead Profile</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '4px' }}>{selectedLead.name}</h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>{selectedLead.email}</p>
                </div>
                <button className="delete-btn" onClick={() => deleteLead(selectedLead.id)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Stage</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['New', 'Contacted', 'Converted'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedLead.id, status)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedLead.status === status ? 'var(--primary)' : '#e2e8f0',
                        background: selectedLead.status === status ? '#eff6ff' : 'white',
                        color: selectedLead.status === status ? 'var(--primary)' : '#64748b',
                        fontWeight: '600',
                        fontSize: '0.8125rem',
                        cursor: 'pointer'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Recent Activity</div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '0.875rem' }}>No logged records.</div>
                  ) : (
                    selectedLead.notes.map((note, i) => (
                      <div key={i} className="animate-entrance" style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '12px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#334155' }}>{note.content}</p>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '24px' }}>
                <textarea
                  placeholder="Log an interaction..."
                  style={{ height: '80px', resize: 'none' }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                      e.preventDefault();
                      await addNote(selectedLead.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <button onClick={() => setSelectedLead(null)} style={{ marginTop: '24px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                Return to Pipeline
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
