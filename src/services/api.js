import { INITIAL_NOTES } from './mockData';

const STORAGE_KEY = 'azure_cloudnotes_items';

// Helper to get local persisted notes
function getLocalNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Local storage read error:', err);
    return INITIAL_NOTES;
  }
}

function saveLocalNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Local storage write error:', err);
  }
}

/**
 * Fetch all notes with optional filtering
 */
export async function getNotes(params = {}) {
  const { search = '', department = 'All Departments', semester = 'all', courseCode = '' } = params;

  try {
    // Try calling the live Azure Static Web App API endpoint
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (courseCode) query.set('courseCode', courseCode);
    if (semester !== 'all') query.set('semester', semester);

    const res = await fetch(`/api/notes?${query.toString()}`, {
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const data = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch {
    // Graceful fallback to client-side data
  }

  // Local fallback filtering
  let notes = getLocalNotes();

  if (search.trim()) {
    const q = search.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.courseCode.toLowerCase().includes(q) ||
      n.courseName.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (department && department !== 'All Departments') {
    notes = notes.filter(n => n.department === department);
  }

  if (semester && semester !== 'all') {
    notes = notes.filter(n => Number(n.semester) === Number(semester));
  }

  if (courseCode) {
    notes = notes.filter(n => n.courseCode.toLowerCase() === courseCode.toLowerCase());
  }

  return { data: notes, isLiveBackend: false };
}

/**
 * Step 1 of Valet Key Pattern: Request temporary write-only SAS URL from backend
 */
export async function getUploadSasUrl(fileMetadata) {
  try {
    const res = await fetch('/api/generate-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileMetadata),
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const result = await res.json();
      return { ...result, isLiveBackend: true };
    }
  } catch {
    // Backend API offline / in local dev without Azure functions running
  }

  // Simulated SAS token for local demonstration
  const fakeBlobPath = `${fileMetadata.courseCode.toLowerCase()}/${new Date().getFullYear()}/${Date.now()}_${fileMetadata.fileName}`;
  return {
    uploadUrl: `https://mockstorageaccount.blob.core.windows.net/student-resources/${fakeBlobPath}?sp=cw&st=2026-10-15T00:00:00Z&se=2026-10-15T00:05:00Z&spr=https&sv=2022-11-02&sr=b&sig=MOCK_VALET_KEY_SAS_TOKEN`,
    blobPath: fakeBlobPath,
    isLiveBackend: false
  };
}

/**
 * Step 2 of Valet Key Pattern: Direct browser-to-Azure Blob Storage PUT upload
 */
export async function uploadToBlobStorage(uploadUrl, file, onProgress) {
  // If it's a mock upload URL, simulate upload delay and progress
  if (uploadUrl.includes('mockstorageaccount')) {
    return new Promise((resolve) => {
      let progress = 10;
      onProgress(progress);
      const interval = setInterval(() => {
        progress += 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress(100);
          resolve({ ok: true, status: 201 });
        } else {
          onProgress(progress);
        }
      }, 250);
    });
  }

  // Real Azure Blob Storage direct PUT request using Valet SAS URL
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, status: xhr.status });
      } else {
        reject(new Error(`Azure Blob Storage returned status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error uploading directly to Azure Blob Storage'));
    xhr.send(file);
  });
}

/**
 * Step 3 of Valet Key Pattern: Save Note Metadata to Cosmos DB
 */
export async function createNoteRecord(metadata) {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const created = await res.json();
      return { data: created, isLiveBackend: true };
    }
  } catch {
    // Fall back to local
  }

  // Save to local storage
  const notes = getLocalNotes();
  const newNote = {
    ...metadata,
    id: `note_${Date.now()}`,
    upvotes: 0,
    downloads: 0,
    createdAt: new Date().toISOString()
  };

  notes.unshift(newNote);
  saveLocalNotes(notes);
  return { data: newNote, isLiveBackend: false };
}

/**
 * Upvote a note
 */
export async function upvoteNote(noteId, courseCode) {
  try {
    const res = await fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: noteId, courseCode }),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Ignore and update locally
  }

  const notes = getLocalNotes();
  const target = notes.find(n => n.id === noteId);
  if (target) {
    target.upvotes = (target.upvotes || 0) + 1;
    saveLocalNotes(notes);
    return { upvotes: target.upvotes };
  }
  return { upvotes: 1 };
}

/**
 * Record a download
 */
export function recordDownload(noteId) {
  const notes = getLocalNotes();
  const target = notes.find(n => n.id === noteId);
  if (target) {
    target.downloads = (target.downloads || 0) + 1;
    saveLocalNotes(notes);
    return target.downloads;
  }
  return 1;
}
