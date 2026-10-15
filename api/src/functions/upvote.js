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

app.http('upvote', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'upvote',
  handler: async (request, context) => {
    try {
      const { id, courseCode } = await request.json();

      if (!id || !courseCode) {
        return {
          status: 400,
          jsonBody: { error: 'Both id and courseCode (partition key) are required' }
        };
      }

      const container = getContainer();
      if (!container) {
        return { status: 200, jsonBody: { success: true, simulated: true } };
      }

      // Point read with partition key consumes only 1 RU!
      const itemRef = container.item(id, courseCode.toUpperCase());
      const { resource } = await itemRef.read();

      if (!resource) {
        return { status: 404, jsonBody: { error: 'Note not found' } };
      }

      resource.upvotes = (resource.upvotes || 0) + 1;
      const { resource: updated } = await itemRef.replace(resource);

      return {
        status: 200,
        jsonBody: { upvotes: updated.upvotes }
      };
    } catch (err) {
      context.error('Upvote Error:', err);
      return {
        status: 500,
        jsonBody: { error: 'Failed to record upvote', details: err.message }
      };
    }
  }
});
