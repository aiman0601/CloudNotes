import { app } from '@azure/functions';
import { CosmosClient } from '@azure/cosmos';

let cosmosContainer = null;

function getContainer() {
  if (cosmosContainer) return cosmosContainer;
  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  if (!connectionString) return null;

  const client = new CosmosClient(connectionString);
  const db = client.database(process.env.COSMOS_DATABASE_ID || 'NotesDB');
  cosmosContainer = db.container(process.env.COSMOS_CONTAINER_ID || 'Resources');
  return cosmosContainer;
}

// In-memory fallback if Cosmos connection string is not yet supplied locally
let localNotesStore = [];

app.http('notesGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notes',
  handler: async (request, context) => {
    try {
      const container = getContainer();
      const url = new URL(request.url);
      const courseCode = url.searchParams.get('courseCode');
      const semester = url.searchParams.get('semester');
      const search = url.searchParams.get('search');

      if (!container) {
        context.warn('Cosmos DB connection not configured. Returning memory notes.');
        let results = [...localNotesStore];
        if (courseCode) results = results.filter(n => n.courseCode.toLowerCase() === courseCode.toLowerCase());
        if (semester) results = results.filter(n => Number(n.semester) === Number(semester));
        if (search) {
          const q = search.toLowerCase();
          results = results.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
        }
        return { status: 200, jsonBody: results };
      }

      // Parameterized query targeting partition key /courseCode when available
      let queryText = 'SELECT * FROM c WHERE 1=1';
      const parameters = [];

      if (courseCode) {
        queryText += ' AND c.courseCode = @courseCode';
        parameters.push({ name: '@courseCode', value: courseCode.toUpperCase() });
      }

      if (semester && semester !== 'all') {
        queryText += ' AND c.semester = @semester';
        parameters.push({ name: '@semester', value: Number(semester) });
      }

      if (search) {
        queryText += ' AND (CONTAINS(LOWER(c.title), @search) OR CONTAINS(LOWER(c.description), @search))';
        parameters.push({ name: '@search', value: search.toLowerCase() });
      }

      queryText += ' ORDER BY c.createdAt DESC';

      const querySpec = {
        query: queryText,
        parameters
      };

      const { resources } = await container.items.query(querySpec).fetchAll();
      return { status: 200, jsonBody: resources };
    } catch (err) {
      context.error('Cosmos DB Query Error:', err);
      return {
        status: 500,
        jsonBody: { error: 'Failed to query Cosmos DB', details: err.message }
      };
    }
  }
});

app.http('notesPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notes',
  handler: async (request, context) => {
    try {
      const noteData = await request.json();

      if (!noteData.courseCode || !noteData.title || !noteData.blobPath) {
        return {
          status: 400,
          jsonBody: { error: 'courseCode, title, and blobPath are mandatory fields.' }
        };
      }

      const document = {
        id: noteData.id || `note_${Date.now()}`,
        courseCode: noteData.courseCode.toUpperCase().trim(),
        courseName: noteData.courseName || '',
        title: noteData.title.trim(),
        description: noteData.description || '',
        semester: Number(noteData.semester) || 1,
        department: noteData.department || 'General',
        fileType: noteData.fileType || 'application/pdf',
        fileSizeKB: Number(noteData.fileSizeKB) || 0,
        blobPath: noteData.blobPath,
        uploadedBy: noteData.uploadedBy || { userId: 'stu_anon', name: 'Anonymous Student' },
        tags: Array.isArray(noteData.tags) ? noteData.tags : [],
        upvotes: 0,
        downloads: 0,
        createdAt: new Date().toISOString()
      };

      const container = getContainer();

      if (!container) {
        context.warn('Cosmos DB connection not configured. Saving to local memory store.');
        localNotesStore.unshift(document);
        return { status: 201, jsonBody: document };
      }

      // Insert directly into Cosmos DB with partition key /courseCode
      const { resource } = await container.items.create(document);

      return {
        status: 201,
        jsonBody: resource
      };
    } catch (err) {
      context.error('Cosmos DB Insert Error:', err);
      return {
        status: 500,
        jsonBody: { error: 'Failed to write record to Cosmos DB', details: err.message }
      };
    }
  }
});
