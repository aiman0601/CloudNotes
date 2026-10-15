import React from 'react';
import { Cloud, Upload, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Navbar({ onOpenUpload, onOpenArch, isLiveBackend }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div className="brand-group">
          <div className="brand-logo">
            <Cloud className="brand-icon" size={24} />
            <div className="brand-pulse"></div>
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">CloudNotes</span>
              <span className="badge badge-blue">Azure Free-Tier</span>
            </div>
            <p className="brand-subtitle">Serverless Student Resource & Notes Network</p>
          </div>
        </div>

        {/* Center status pill */}
        <div className="backend-pill" title={isLiveBackend ? "Connected to Azure Functions & Cosmos DB" : "Running in instant local-preview mode (Auto-switches when Azure is connected)"}>
          <div className={`status-dot ${isLiveBackend ? 'dot-live' : 'dot-mock'}`}></div>
          <span className="status-text">
            {isLiveBackend ? 'Azure SWA Live API' : 'Local Dev Mode (Safe)'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          <button 
            className="btn-secondary arch-btn"
            onClick={onOpenArch}
            title="Inspect Azure Zero-Dollar Architecture"
          >
            <Layers size={18} />
            <span>Azure Architecture</span>
          </button>

          <button 
            className="btn-primary"
            onClick={onOpenUpload}
          >
            <Upload size={18} />
            <span>Upload Notes</span>
          </button>

          {/* User profile simulated auth */}
          <div className="user-profile-badge">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces" 
              alt="Student" 
              className="user-avatar"
            />
            <div className="user-info-text">
              <span className="user-name">Student Account</span>
              <span className="user-role">Entra ID</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
