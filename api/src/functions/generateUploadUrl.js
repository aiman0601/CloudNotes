import { app } from '@azure/functions';
import { 
  BlobServiceClient, 
  generateBlobSASQueryParameters, 
  BlobSASPermissions, 
  StorageSharedKeyCredential 
} from '@azure/storage-blob';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB limit to protect Azure student credit

app.http('generateUploadUrl', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'generate-upload-url',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { fileName, courseCode, fileSize, contentType } = body;

      if (!fileName || !courseCode) {
        return {
          status: 400,
          jsonBody: { error: 'Both fileName and courseCode are required.' }
        };
      }

      // Safeguard credit against oversized uploads
      if (fileSize && fileSize > MAX_FILE_SIZE) {
        return {
          status: 400,
          jsonBody: { error: 'File exceeds maximum 15 MB limit allowed for free-tier credit protection.' }
        };
      }

      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      const containerName = process.env.STORAGE_CONTAINER_NAME || 'student-resources';

      // Fallback for local mock if connection string is not yet supplied
      if (!connectionString) {
        context.warn('AZURE_STORAGE_CONNECTION_STRING not set. Returning simulated SAS URL.');
        const mockBlobPath = `${courseCode.toLowerCase()}/${new Date().getFullYear()}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        return {
          status: 200,
          jsonBody: {
            uploadUrl: `https://mockstorageaccount.blob.core.windows.net/${containerName}/${mockBlobPath}?sp=cw&st=2026-10-15T00:00:00Z&se=2026-10-15T00:05:00Z&spr=https&sv=2022-11-02&sr=b&sig=SIMULATED_KEY`,
            blobPath: mockBlobPath,
            isMock: true
          }
        };
      }

      // Real Azure Blob Storage SAS generation
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Sanitize filename & organize into course-year hierarchy
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blobPath = `${courseCode.toLowerCase()}/${new Date().getFullYear()}/${Date.now()}_${sanitizedName}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

      // Extract account name and key from connection string
      const matches = connectionString.match(/AccountName=([^;]+);AccountKey=([^;]+)/);
      if (!matches) {
        throw new Error('Invalid AZURE_STORAGE_CONNECTION_STRING format');
      }
      const accountName = matches[1];
      const accountKey = matches[2];

      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

      // 5-minute expiry, write/create permissions only
      const startsOn = new Date();
      startsOn.setMinutes(startsOn.getMinutes() - 2); // handle slight clock skew
      const expiresOn = new Date();
      expiresOn.setMinutes(expiresOn.getMinutes() + 5);

      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName: blobPath,
        permissions: BlobSASPermissions.parse('cw'), // create + write only
        startsOn,
        expiresOn,
        contentType: contentType || 'application/pdf',
      }, sharedKeyCredential).toString();

      const uploadUrl = `${blockBlobClient.url}?${sasToken}`;

      return {
        status: 200,
        jsonBody: {
          uploadUrl,
          blobPath,
          expiresOn: expiresOn.toISOString()
        }
      };
    } catch (err) {
      context.error('Error generating SAS URL:', err);
      return {
        status: 500,
        jsonBody: { error: 'Failed to generate Azure Blob SAS URL', details: err.message }
      };
    }
  }
});
