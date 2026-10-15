import React, { useState } from 'react';
import { FileText, Download, ThumbsUp, Calendar, User, Eye, Check, ExternalLink } from 'lucide-react';
import { upvoteNote, recordDownload } from '../services/api';

export default function NoteCard({ note, onSelect, onTagClick }) {
  const [upvotes, setUpvotes] = useState(note.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [downloads, setDownloads] = useState(note.downloads || 0);
  const [downloading, setDownloading] = useState(false);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (hasUpvoted) return;
    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    await upvoteNote(note.id, note.courseCode);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloading(true);
    const newCount = recordDownload(note.id);
    setDownloads(newCount);

    // Create a client-side simulated PDF download or direct blob download
    setTimeout(() => {
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
      setDownloading(false);
    }, 400);
  };

  const formattedSize = note.fileSizeKB 
    ? (note.fileSizeKB > 1024 ? `${(note.fileSizeKB / 1024).toFixed(1)} MB` : `${note.fileSizeKB} KB`)
    : '2.4 MB';

  const dateFormatted = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="note-card glass-panel" onClick={() => onSelect(note)}>
      {/* Top Meta Header */}
      <div className="note-card-header">
        <div className="course-badge-wrap">
          <span className="course-code-badge">{note.courseCode}</span>
          <span className="sem-badge">Sem {note.semester}</span>
        </div>
        <span className="dept-tag">{note.department}</span>
      </div>

      {/* Main Content */}
      <div className="note-card-body">
        <h3 className="note-title">{note.title}</h3>
        {note.courseName && (
          <p className="note-course-name">{note.courseName}</p>
        )}
        <p className="note-desc">{note.description}</p>

        {/* Tags */}
        <div className="note-tags">
          {note.tags && note.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="note-tag-chip"
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
            >
              #{tag}
            </span>
          ))}
          {note.tags && note.tags.length > 3 && (
            <span className="note-tag-more">+{note.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Uploader Meta */}
      <div className="note-uploader-row">
        <div className="uploader-info">
          {note.uploadedBy?.avatar ? (
            <img 
              src={note.uploadedBy.avatar} 
              alt={note.uploadedBy.name} 
              className="uploader-img" 
            />
          ) : (
            <div className="uploader-placeholder">
              <User size={14} />
            </div>
          )}
          <span className="uploader-name">{note.uploadedBy?.name || 'Student Contributor'}</span>
        </div>
        <div className="note-date">
          <Calendar size={13} />
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="note-card-footer">
        <div className="file-info-badge">
          <FileText size={14} className="text-cyan" />
          <span>{formattedSize}</span>
        </div>

        <div className="card-actions">
          <button 
            className={`action-btn upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
            title="Upvote this resource"
          >
            <ThumbsUp size={14} />
            <span>{upvotes}</span>
          </button>

          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
            disabled={downloading}
            title="Download directly from Blob Storage"
          >
            {downloading ? (
              <span className="spinner-inline"></span>
            ) : (
              <>
                <Download size={14} />
                <span>{downloads}</span>
              </>
            )}
          </button>

          <button 
            className="action-btn preview-btn"
            onClick={() => onSelect(note)}
            title="Preview note & Cosmos DB record"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
