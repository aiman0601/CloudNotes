import React from 'react';
import { BookOpen, FileText, Download, Users, Sparkles } from 'lucide-react';

export default function StatsOverview({ notes }) {
  const totalNotes = notes.length;
  const uniqueCourses = new Set(notes.map(n => n.courseCode)).size;
  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloads || 0), 0);
  const totalUpvotes = notes.reduce((sum, n) => sum + (n.upvotes || 0), 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrap bg-blue-tint">
          <FileText className="stat-icon text-cyan" size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalNotes}</span>
          <span className="stat-label">Verified Notes & Cheatsheets</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap bg-purple-tint">
          <BookOpen className="stat-icon text-purple" size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{uniqueCourses}</span>
          <span className="stat-label">Active Course Codes</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap bg-emerald-tint">
          <Download className="stat-icon text-emerald" size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalDownloads.toLocaleString()}</span>
          <span className="stat-label">Fast Direct-Blob Downloads</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap bg-amber-tint">
          <Sparkles className="stat-icon text-amber" size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalUpvotes}</span>
          <span className="stat-label">Peer Upvotes & Endorsements</span>
        </div>
      </div>
    </div>
  );
}
