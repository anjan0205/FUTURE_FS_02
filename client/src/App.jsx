import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const API_URL = '/api/leads';

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
      const res = await axios.get(API_URL);
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newLead);
      setShowAddModal(false);
      setNewLead({ name: '', email: '', source: 'Website' });
      fetchLeads();
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { status });
      fetchLeads();
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(res.data);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addNote = async (id, noteText) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { note: noteText });
      setSelectedLead(res.data);
      fetchLeads();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchLeads();
        setSelectedLead(null);
      } catch (err) {
        console.error('Error deleting lead:', err);
      }
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, colorClass: 'primary' },
    { label: 'Active Leads', value: leads.filter(l => l.status === 'Contacted').length, icon: Clock, colorClass: 'warning' },
    { label: 'Converted', value: leads.filter(l => l.status === 'Converted').length, icon: CheckCircle, colorClass: 'success' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header>
        <div className="header-brand">
          <div className="header-icon">
            <Users size={28} />
          </div>
          <div>
            <h1>Mini CRM</h1>
            <p>Manage your client leads effectively</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <PlusCircle size={20} />
          Add New Lead
        </button>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
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
      <main>
        <div className="glass-card">
          <div className="controls-bar">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Lead Info</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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
                        <span className={`status-badge ${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <button className="chevron-btn">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredLeads.length === 0 && !loading && (
              <div className="empty-state">No leads found. Start by adding one!</div>
            )}
            {loading && (
              <div className="loading-state">Loading leads...</div>
            )}
          </div>
        </div>
      </main>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-backdrop">
            <div className="modal-overlay" onClick={() => setShowAddModal(false)} />
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h2>Add New Lead</h2>
              <form onSubmit={handleCreateLead}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    required
                    type="text"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    required
                    type="email"
                    value={newLead.email}
                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="input-group">
                  <label>Source</label>
                  <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                    <option>Website</option>
                    <option>Referral</option>
                    <option>LinkedIn</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn">Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Lead</button>
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
            <div className="drawer-overlay" onClick={() => setSelectedLead(null)} />
            <motion.div
              className="drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="drawer-header">
                <div>
                  <span className="drawer-label">Lead Details</span>
                  <h2>{selectedLead.name}</h2>
                  <p>{selectedLead.email}</p>
                </div>
                <button className="delete-btn" onClick={() => deleteLead(selectedLead._id)}>
                  <Trash2 size={20} />
                </button>
              </div>

              <div>
                <div className="section-label">Status Workflow</div>
                <div className="status-workflow">
                  {['New', 'Contacted', 'Converted'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedLead._id, status)}
                      className={`status-btn ${selectedLead.status === status ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-label">Activity Feed / Notes</div>
                <div className="notes-list">
                  {selectedLead.notes.length === 0 ? (
                    <div className="note-empty">No notes yet. Add your first update below.</div>
                  ) : (
                    selectedLead.notes.map((note, i) => (
                      <div key={i} className="note-card">
                        <p>{note.content}</p>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="input-group">
                <textarea
                  placeholder="Add a progress note..."
                  style={{ height: '90px', resize: 'none' }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                      e.preventDefault();
                      await addNote(selectedLead._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <p className="note-input-hint">Press Enter to save note</p>
              </div>

              <button className="close-drawer-btn" onClick={() => setSelectedLead(null)}>
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
