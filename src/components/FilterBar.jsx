import React from 'react';
import { Search, X, Filter, Tag, BookMarked } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../services/mockData';

export default function FilterBar({
  search,
  setSearch,
  department,
  setDepartment,
  semester,
  setSemester,
  activeTag,
  setActiveTag,
  popularTags = []
}) {
  return (
    <div className="filter-wrapper glass-panel">
      {/* Top Search & Department Row */}
      <div className="filter-primary-row">
        {/* Search Bar */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes by subject, course code (e.g. CS301), topics or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="dept-select-wrap">
          <Filter size={16} className="dept-icon" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="dept-select"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="semester-tabs-row">
        <span className="filter-row-label">Semester:</span>
        <div className="semester-pill-group">
          {SEMESTERS.map((sem) => {
            const isActive = semester.toString() === sem.value.toString();
            return (
              <button
                key={sem.value}
                className={`sem-pill ${isActive ? 'sem-pill-active' : ''}`}
                onClick={() => setSemester(sem.value)}
              >
                {sem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Tags Chips */}
      {popularTags.length > 0 && (
        <div className="tags-chips-row">
          <span className="filter-row-label">
            <Tag size={13} style={{ display: 'inline', marginRight: 4 }} />
            Hot Tags:
          </span>
          <div className="tags-chips-list">
            {popularTags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  className={`tag-chip ${isSelected ? 'tag-chip-active' : ''}`}
                  onClick={() => setActiveTag(isSelected ? '' : tag)}
                >
                  #{tag}
                  {isSelected && <X size={12} style={{ marginLeft: 4 }} />}
                </button>
              );
            })}
            {activeTag && (
              <button 
                className="clear-all-tags-btn"
                onClick={() => setActiveTag('')}
              >
                Reset tag filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
