import React, { useState } from 'react';
import { X, UploadCloud, FileCheck, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, HardDrive } from 'lucide-react';
import { getUploadSasUrl, uploadToBlobStorage, createNoteRecord } from '../services/api';
import { DEPARTMENTS } from '../services/mockData';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB credit-protection limit

export default function UploadModal({ isOpen, onClose, onNoteAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    courseName: '',
    semester: '5',
    department: 'Computer Science',
    description: '',
    tags: 'notes, exam-prep',
    authorName: 'Student Contributor'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Form, 1: Requesting SAS, 2: Direct Blob Upload, 3: Saving Cosmos DB, 4: Done
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Exceeds the 15 MB Azure Credit Protection limit!`);
      setSelectedFile(null);
      return;
    }

    setFileError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a PDF or resource document to upload.');
      return;
    }

    if (!formData.title.trim() || !formData.courseCode.trim()) {
      setErrorMessage('Please fill in the note title and course code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // --- STEP 1: Request SAS Token from Serverless Function API ---
      setCurrentStep(1);
      const sasResponse = await getUploadSasUrl({
        fileName: selectedFile.name,
        courseCode: formData.courseCode.toUpperCase().trim(),
        fileSize: selectedFile.size,
        contentType: selectedFile.type
      });

      // --- STEP 2: Valet Key Pattern - Direct PUT from Browser to Azure Blob Storage ---
      setCurrentStep(2);
      await uploadToBlobStorage(
        sasResponse.uploadUrl,
        selectedFile,
        (progress) => setUploadProgress(progress)
      );

      // --- STEP 3: Store Note Metadata in Azure Cosmos DB ---
      setCurrentStep(3);
      const tagList = formData.tags
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const metadataPayload = {
        courseCode: formData.courseCode.toUpperCase().trim(),
        courseName: formData.courseName.trim() || formData.courseCode.toUpperCase().trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || `Lecture notes and study resource for ${formData.courseCode}`,
        semester: Number(formData.semester),
        department: formData.department,
        fileType: selectedFile.type || 'application/pdf',
        fileSizeKB: Math.round(selectedFile.size / 1024),
        blobPath: sasResponse.blobPath,
        uploadedBy: {
          userId: `stu_${Math.floor(1000 + Math.random() * 9000)}`,
          name: formData.authorName.trim() || 'Student Contributor',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
        },
        tags: tagList
      };

      const result = await createNoteRecord(metadataPayload);

      // --- STEP 4: Success Completion ---
      setCurrentStep(4);
      setTimeout(() => {
        onNoteAdded(result.data);
        handleReset();
        onClose();
      }, 1400);

    } catch (err) {
      console.error('Upload flow error:', err);
      setErrorMessage(err.message || 'Upload failed. Check connection or SAS policy.');
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileError('');
    setCurrentStep(0);
    setUploadProgress(0);
    setErrorMessage('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-wrap">
              <UploadCloud size={20} className="text-cyan" />
            </div>
            <div>
              <h2>Upload Student Notes</h2>
              <p>Direct-to-Azure-Blob with Cosmos DB Metadata Indexing</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {/* Credit Protection Notice */}
        <div className="modal-credit-alert">
          <ShieldAlert size={16} className="text-amber" />
          <span>
            <strong>Azure Credit Guard:</strong> Max 15 MB/file. Direct Valet PUT saves server RAM and keeps monthly cost at $0.00.
          </span>
        </div>

        {/* Dynamic State: Uploading Flow vs Form */}
        {currentStep > 0 ? (
          <div className="upload-progress-view">
            <h3 className="progress-title">
              {currentStep === 4 ? 'Upload Successful!' : 'Executing Serverless Valet Flow...'}
            </h3>

            {/* Stepper tracker */}
            <div className="stepper-track">
              <div className={`step-item ${currentStep >= 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-done' : ''}`}>
                <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
                <span className="step-label">Generate SAS Token</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${currentStep >= 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-done' : ''}`}>
                <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
                <span className="step-label">Direct-to-Blob PUT</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${currentStep >= 3 ? 'step-active' : ''} ${currentStep >= 4 ? 'step-done' : ''}`}>
                <div className="step-circle">{currentStep >= 4 ? '✓' : '3'}</div>
                <span className="step-label">Save Cosmos DB Record</span>
              </div>
            </div>

            {/* Dynamic Progress indicator */}
            {currentStep === 2 && (
              <div className="blob-progress-box">
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-detail-text">
                  <span>Uploading to Azure Blob: <code>student-resources</code> container</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="success-check-box">
                <CheckCircle2 size={48} className="text-emerald animate-pulse" />
                <p>Note indexed and available for students to download!</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="upload-form">
            {errorMessage && (
              <div className="form-error-alert">
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div className="file-drop-area">
              <input 
                type="file" 
                id="note-file-input"
                accept=".pdf,.docx,.pptx,.txt,.zip,.png,.jpg"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              <label htmlFor="note-file-input" className="file-drop-label">
                <UploadCloud size={32} className="drop-icon" />
                {selectedFile ? (
                  <div className="selected-file-info">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Blob Upload
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="drop-cta">Click or drag note PDF / PPT here</span>
                    <span className="drop-hint">PDF, DOCX, PPTX up to 15 MB</span>
                  </div>
                )}
              </label>
              {fileError && <p className="file-error-msg">{fileError}</p>}
            </div>

            {/* Title & Course Code */}
            <div className="form-row-2">
              <div className="form-group flex-2">
                <label>Note Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Operating Systems - Deadlocks & Semaphores"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Course Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g. CS301"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Course Name & Semester */}
            <div className="form-row-2">
              <div className="form-group flex-2">
                <label>Course Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributed Operating Systems"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>

              <div className="form-group flex-1">
                <label>Semester</label>
                <select 
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="form-group">
              <label>Department</label>
              <select 
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description & Contents</label>
              <textarea 
                rows="3"
                placeholder="Key topics covered, exam question references, formulas..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="deadlocks, semaphores, midterm-prep"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            {/* Submit Action */}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !selectedFile}
              >
                <span>Publish to Azure</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
