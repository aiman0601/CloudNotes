import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import CostGuardBanner from './components/CostGuardBanner';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import NoteCard from './components/NoteCard';
import UploadModal from './components/UploadModal';
import ArchitectureModal from './components/ArchitectureModal';
import NoteDetailModal from './components/NoteDetailModal';
import { getNotes } from './services/api';
import { Sparkles, BookOpen, Upload, Layers, Search, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('all');
  const [activeTag, setActiveTag] = useState('');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch notes
  const fetchNotesList = async () => {
    setLoading(true);
    try {
      const { data, isLiveBackend: live } = await getNotes({
        search,
        department,
        semester
      });
      setNotes(data);
      setIsLiveBackend(live);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesList();
  }, [department, semester]);

  // Debounced or direct search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotesList();
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  // Extract popular tags
  const popularTags = useMemo(() => {
    const tagCount = {};
    notes.forEach(note => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach(t => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [notes]);

  // Filter by tag on client
  const displayedNotes = useMemo(() => {
    if (!activeTag) return notes;
    return notes.filter(n => Array.isArray(n.tags) && n.tags.includes(activeTag));
  }, [notes, activeTag]);

  const handleNoteAdded = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArch={() => setIsArchOpen(true)}
        isLiveBackend={isLiveBackend}
      />

      <main className="main-content">
        {/* Cost Guard & Safety Notification */}
        <CostGuardBanner onOpenArch={() => setIsArchOpen(true)} />

        {/* Hero Banner */}
        <section className="hero-section">
          <div className="hero-badge-wrap">
            <span className="badge badge-blue">
              <Sparkles size={13} />
              Azure Serverless Cloud
            </span>
            <span className="badge badge-green">Zero-Cost Architecture</span>
          </div>

          <h1 className="hero-title">
            Student Notes & Study Hub <br />
            <span className="hero-gradient-text">Scaled to Zero. Built for Campus.</span>
          </h1>

          <p className="hero-desc">
            Find handwritten lecture notes, previous-year question sets, formula sheets, and exam prep resources.
            Powered by Microsoft Azure Free-Tier with direct Blob Storage Valet Keys and Cosmos DB NoSQL.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              <Upload size={18} />
              <span>Share Notes & Earn Karma</span>
            </button>
            <button className="btn-secondary" onClick={() => setIsArchOpen(true)}>
              <Layers size={18} />
              <span>Explore Azure Architecture</span>
            </button>
          </div>
        </section>

        {/* Real-time stats */}
        <StatsOverview notes={notes} />

        {/* Filter & Search Bar */}
        <FilterBar 
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          semester={semester}
          setSemester={setSemester}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          popularTags={popularTags}
        />

        {/* Notes Grid */}
        <section className="notes-section">
          <div className="notes-header-row">
            <div>
              <h2 className="section-title">Available Study Resources</h2>
              <p className="section-subtitle">
                Showing {displayedNotes.length} verified notes {activeTag ? `matching #${activeTag}` : ''}
              </p>
            </div>
            <button 
              className="btn-secondary refresh-btn" 
              onClick={fetchNotesList}
              title="Refresh notes list"
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Sync</span>
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching notes from Cosmos DB...</p>
            </div>
          ) : displayedNotes.length === 0 ? (
            <div className="empty-state glass-panel">
              <BookOpen size={48} className="empty-icon text-muted" />
              <h3>No resources found</h3>
              <p>We couldn't find any notes matching your filters. Try clearing tags or search terms.</p>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearch('');
                  setDepartment('All Departments');
                  setSemester('all');
                  setActiveTag('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {displayedNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onSelect={(n) => setSelectedNote(n)}
                  onTagClick={(t) => setActiveTag(t)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-title">CloudNotes Hub</span>
            <p className="footer-sub">Microsoft Azure Serverless Architecture for Academic Resource Sharing</p>
          </div>
          <div className="footer-tags">
            <span className="badge badge-blue">Azure Static Web Apps</span>
            <span className="badge badge-purple">Azure Blob Storage (Valet Key)</span>
            <span className="badge badge-green">Cosmos DB NoSQL (1k RU/s Free)</span>
            <span className="badge badge-amber">$100 Student Credit Optimized</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onNoteAdded={handleNoteAdded}
      />

      <ArchitectureModal 
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      <NoteDetailModal 
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
}
