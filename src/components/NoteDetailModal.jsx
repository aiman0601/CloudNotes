import React, { useState } from 'react';
import { X, FileText, Download, ThumbsUp, Calendar, User, Tag, HardDrive, Database, Code, Check } from 'lucide-react';
import { upvoteNote, recordDownload } from '../services/api';

export default function NoteDetailModal({ note, onClose }) {
  const [upvotes, setUpvotes] = useState(note?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [downloads, setDownloads] = useState(note?.downloads || 0);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    await upvoteNote(note.id, note.courseCode);
  };

  const handleDownload = () => {
    const newCount = recordDownload(note.id);
    setDownloads(newCount);
    const blob = new Blob([
      `%PDF-1.4\n% Azure CloudNotes\n% Title: ${note.title}\n% Course: ${note.courseCode} - ${note.courseName || ''}\n% Semester: ${note.semester}\n% Department: ${note.department}\n% Uploaded By: ${note.uploadedBy?.name || 'Anonymous'}\n\nSummary:\n${note.description}\n\n[Azure Serverless Blob Storage Direct Valet Download Simulation]\n`
    ], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.courseCode}_${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSize = note.fileSizeKB 
    ? (note.fileSizeKB > 1024 ? `${(note.fileSizeKB / 1024).toFixed(1)} MB` : `${note.fileSizeKB} KB`)
    : '2.4 MB';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog glass-panel detail-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="course-code-badge large">{note.courseCode}</span>
            <div>
              <h2>{note.title}</h2>
              <p>{note.courseName || note.department} • Semester {note.semester}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="detail-body">
          {/* Uploader Card */}
          <div className="detail-uploader-bar">
            <div className="uploader-info">
              {note.uploadedBy?.avatar ? (
                <img src={note.uploadedBy.avatar} alt={note.uploadedBy.name} className="uploader-img" />
              ) : (
                <div className="uploader-placeholder"><User size={16} /></div>
              )}
              <div>
                <strong>{note.uploadedBy?.name || 'Student Contributor'}</strong>
                <span className="uploader-sub">Contributed on {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="detail-stat-pills">
              <span className="detail-pill">
                <FileText size={14} className="text-cyan" />
                {formattedSize}
              </span>
              <span className="detail-pill">
                <Download size={14} className="text-emerald" />
                {downloads} downloads
              </span>
              <span className="detail-pill">
                <ThumbsUp size={14} className="text-amber" />
                {upvotes} upvotes
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h4>Description & Study Notes Overview</h4>
            <p className="detail-text">{note.description}</p>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="detail-section">
              <h4>Topics & Keywords</h4>
              <div className="detail-tags-row">
                {note.tags.map(t => (
                  <span key={t} className="note-tag-chip">#{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Azure Blob & Cosmos Metadata */}
          <div className="detail-section">
            <div className="section-header-flex">
              <h4>Azure Resource Coordinates</h4>
              <button 
                className="btn-text-small"
                onClick={() => setShowJson(!showJson)}
              >
                <Code size={14} />
                <span>{showJson ? 'Hide Cosmos DB JSON' : 'View Cosmos DB JSON'}</span>
              </button>
            </div>
            
            <div className="blob-path-box">
              <HardDrive size={16} className="text-cyan" />
              <span>Azure Blob Path: <code>{note.blobPath || `${note.courseCode.toLowerCase()}/${note.id}.pdf`}</code></span>
            </div>

            {showJson && (
              <pre className="code-block animate-fade-in" style={{ marginTop: 12 }}>
                {JSON.stringify(note, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-actions-footer">
          <button className="btn-secondary" onClick={handleCopyLink}>
            {copied ? <Check size={16} className="text-emerald" /> : 'Share Link'}
          </button>
          <button 
            className={`btn-secondary ${hasUpvoted ? 'btn-active' : ''}`}
            onClick={handleUpvote}
          >
            <ThumbsUp size={16} />
            <span>Upvote ({upvotes})</span>
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
