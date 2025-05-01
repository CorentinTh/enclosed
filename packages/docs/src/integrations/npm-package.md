# NPM Package

The Enclosed library is available as an npm package. It provides a simple and secure way to create, manage, and access encrypted notes with optional password protection, expiration times, and file attachments.

## Installation

You can install the Enclosed library using npm, yarn, or pnpm.

### Using npm

```bash
npm install @enclosed/lib
```

### Using yarn

```bash
yarn add @enclosed/lib
```

### Using pnpm

```bash
pnpm add @enclosed/lib
```

## Basic Usage

### Creating a Note

```typescript
import { createNote } from '@enclosed/lib';

async function createSimpleNote() {
  const { noteUrl } = await createNote({
    content: 'This is a secret note',
  });
  
  console.log(`Your note is available at: ${noteUrl}`);
}
```

### Reading a Note

```typescript
import { decryptNote } from '@enclosed/lib';

async function readNote(noteUrl, password) {
  // Parse the URL to extract noteId and encryptionKey
  const { noteId, encryptionKey } = parseNoteUrl({ noteUrl });
  
  // Fetch the encrypted note from the server
  const { payload } = await fetchNote({ noteId });
  
  // Decrypt the note
  const { note } = await decryptNote({
    encryptedPayload: payload,
    encryptionKey,
    password, // Optional, only needed if the note is password-protected
  });
  
  console.log('Note content:', note.content);
  
  // If the note has file attachments
  if (note.assets.length > 0) {
    console.log('Note has file attachments:', note.assets.length);
  }
}
```

## API Reference

### createNote

Creates an encrypted note and stores it on the server.

```typescript
async function createNote({
  content,
  password,
  ttlInSeconds,
  deleteAfterReading = false,
  clientBaseUrl = 'https://enclosed.cc',
  apiBaseUrl = clientBaseUrl,
  storeNote = params => storeNoteImpl({ ...params, apiBaseUrl }),
  assets = [],
  encryptionAlgorithm = 'aes-256-gcm',
  serializationFormat = 'cbor-array',
  isPublic = true,
  pathPrefix,
}: {
  content: string;
  password?: string;
  ttlInSeconds?: number;
  deleteAfterReading?: boolean;
  clientBaseUrl?: string;
  apiBaseUrl?: string;
  assets?: NoteAsset[];
  encryptionAlgorithm?: EncryptionAlgorithm;
  serializationFormat?: SerializationFormat;
  isPublic?: boolean;
  pathPrefix?: string;
  storeNote?: (params: {
    payload: string;
    ttlInSeconds?: number;
    deleteAfterReading: boolean;
    encryptionAlgorithm: EncryptionAlgorithm;
    serializationFormat: SerializationFormat;
    isPublic?: boolean;
  }) => Promise<{ noteId: string }>;
}): Promise<{
  encryptedPayload: string;
  encryptionKey: string;
  noteId: string;
  noteUrl: string;
}>
```

#### Parameters

- `content` (required): The content of the note as a string.
- `password` (optional): A password to protect the note. If provided, the password will be required to decrypt the note.
- `ttlInSeconds` (optional): Time-to-live in seconds. The note will be automatically deleted after this time.
- `deleteAfterReading` (optional, default: `false`): If `true`, the note will be deleted after it's read once.
- `clientBaseUrl` (optional, default: `'https://enclosed.cc'`): The base URL for the client.
- `apiBaseUrl` (optional, default: `clientBaseUrl`): The base URL for the API.
- `assets` (optional, default: `[]`): An array of file assets to attach to the note.
- `encryptionAlgorithm` (optional, default: `'aes-256-gcm'`): The encryption algorithm to use.
- `serializationFormat` (optional, default: `'cbor-array'`): The serialization format to use.
- `isPublic` (optional, default: `true`): If `true`, the note is publicly accessible with the correct URL.
- `pathPrefix` (optional): A prefix for the note URL path.
- `storeNote` (optional): A custom function to store the note. By default, it uses the built-in `storeNote` function.

#### Returns

- `encryptedPayload`: The encrypted note payload.
- `encryptionKey`: The encryption key used to encrypt the note.
- `noteId`: The ID of the created note.
- `noteUrl`: The URL to access the note.

### decryptNote

Decrypts an encrypted note.

```typescript
async function decryptNote({
  encryptedPayload,
  password,
  encryptionKey,
  serializationFormat = 'cbor-array',
  encryptionAlgorithm = 'aes-256-gcm',
}: {
  encryptedPayload: string;
  password?: string;
  encryptionKey: string;
  serializationFormat?: SerializationFormat;
  encryptionAlgorithm?: EncryptionAlgorithm;
}): Promise<{
  note: Note;
}>
```

#### Parameters

- `encryptedPayload` (required): The encrypted note payload.
- `password` (optional): The password used to encrypt the note, if any.
- `encryptionKey` (required): The encryption key used to encrypt the note.
- `serializationFormat` (optional, default: `'cbor-array'`): The serialization format used.
- `encryptionAlgorithm` (optional, default: `'aes-256-gcm'`): The encryption algorithm used.

#### Returns

- `note`: The decrypted note object containing the content and any attached assets.

### fetchNote

Fetches an encrypted note from the server.

```typescript
async function fetchNote({
  noteId,
  apiBaseUrl,
}: {
  noteId: string;
  apiBaseUrl?: string;
}): Promise<{
  payload: string;
}>
```

#### Parameters

- `noteId` (required): The ID of the note to fetch.
- `apiBaseUrl` (optional): The base URL for the API.

#### Returns

- An object containing the encrypted note payload.

### URL Handling Functions

#### createNoteUrl

Creates a URL for accessing a note.

```typescript
function createNoteUrl({
  noteId,
  encryptionKey,
  clientBaseUrl,
  isPasswordProtected,
  isDeletedAfterReading,
  pathPrefix,
}: {
  noteId: string;
  encryptionKey: string;
  clientBaseUrl: string;
  isPasswordProtected?: boolean;
  isDeletedAfterReading?: boolean;
  pathPrefix?: string;
}): { noteUrl: string }
```

#### parseNoteUrl

Parses a note URL to extract the noteId, encryptionKey, and other information.

```typescript
function parseNoteUrl({ noteUrl }: { noteUrl: string }): {
  noteId: string;
  encryptionKey: string;
  isPasswordProtected: boolean;
  isDeletedAfterReading: boolean;
}
```

### File Handling Functions

#### fileToNoteAsset

Converts a File object to a NoteAsset.

```typescript
async function fileToNoteAsset({ file }: { file: File }): Promise<NoteAsset>
```

#### filesToNoteAssets

Converts an array of File objects to an array of NoteAssets.

```typescript
async function filesToNoteAssets({ files }: { files: File[] }): Promise<NoteAsset[]>
```

#### noteAssetToFile

Converts a NoteAsset to a File object.

```typescript
async function noteAssetToFile({ noteAsset }: { noteAsset: NoteAsset }): Promise<File>
```

#### noteAssetsToFiles

Converts an array of NoteAssets to an array of File objects.

```typescript
async function noteAssetsToFiles({ noteAssets }: { noteAssets: NoteAsset[] }): Promise<File[]>
```

## TypeScript Types and Interfaces

The library exports several TypeScript types and interfaces that you can use in your code.

### Note Types

```typescript
// Represents a file or other binary asset attached to a note
type NoteAsset = {
  metadata: {
    type: string;
    [key: string]: unknown;
  };
  content: Uint8Array;
};

// Represents a decrypted note
type Note = {
  content: string;
  assets: NoteAsset[];
};

// Represents an encrypted note
type EncryptedNote = {
  version: number;
  payload: string;
  encryptionAlgorithm: EncryptionAlgorithm;
  serializationFormat: SerializationFormat;
  keyDerivationAlgorithm: KeyDerivationAlgorithm;
  compressionAlgorithm: CompressionAlgorithm;
  ttlInSeconds: number;
  deleteAfterReading: boolean;
};
```

### Encryption and Serialization Types

```typescript
// Available encryption algorithms
type EncryptionAlgorithm = 'aes-256-gcm';

// Available key derivation algorithms
type KeyDerivationAlgorithm = 'pbkdf2-base-key-salted';

// Available compression algorithms
type CompressionAlgorithm = 'brotli' | 'none';

// Available serialization formats
type SerializationFormat = 'cbor-array';
```

## Advanced Usage

### Creating a Password-Protected Note

```typescript
import { createNote } from '@enclosed/lib';

async function createPasswordProtectedNote() {
  const { noteUrl } = await createNote({
    content: 'This is a password-protected note',
    password: 'my-secure-password',
  });
  
  console.log(`Your password-protected note is available at: ${noteUrl}`);
}
```

### Creating a Note with Expiration

```typescript
import { createNote } from '@enclosed/lib';

async function createExpiringNote() {
  // Create a note that expires after 1 hour (3600 seconds)
  const { noteUrl } = await createNote({
    content: 'This note will expire after 1 hour',
    ttlInSeconds: 3600,
  });
  
  console.log(`Your expiring note is available at: ${noteUrl}`);
}
```

### Creating a Note that Deletes After Reading

```typescript
import { createNote } from '@enclosed/lib';

async function createSelfDestructingNote() {
  const { noteUrl } = await createNote({
    content: 'This note will self-destruct after reading',
    deleteAfterReading: true,
  });
  
  console.log(`Your self-destructing note is available at: ${noteUrl}`);
}
```

### Creating a Note with File Attachments

```typescript
import { createNote, filesToNoteAssets } from '@enclosed/lib';

async function createNoteWithAttachments() {
  // Assuming you have File objects from a file input or other source
  const files = [
    new File(['file content'], 'document.txt', { type: 'text/plain' }),
    // Add more files as needed
  ];
  
  // Convert files to note assets
  const assets = await filesToNoteAssets({ files });
  
  const { noteUrl } = await createNote({
    content: 'This note has file attachments',
    assets,
  });
  
  console.log(`Your note with attachments is available at: ${noteUrl}`);
}
```

### Using a Custom API Endpoint

```typescript
import { createNote } from '@enclosed/lib';

async function createNoteWithCustomEndpoint() {
  const { noteUrl } = await createNote({
    content: 'This note uses a custom API endpoint',
    apiBaseUrl: 'https://my-custom-enclosed-instance.com',
    clientBaseUrl: 'https://my-custom-enclosed-instance.com',
  });
  
  console.log(`Your note is available at: ${noteUrl}`);
}
```

## Error Handling

The library throws errors in various situations. Here's how to handle them:

```typescript
import { createNote, isApiClientErrorWithCode, isApiClientErrorWithStatusCode } from '@enclosed/lib';

async function createNoteWithErrorHandling() {
  try {
    const { noteUrl } = await createNote({
      content: 'This is a note with error handling',
    });
    
    console.log(`Your note is available at: ${noteUrl}`);
  } catch (error) {
    // Check if it's a rate limit error
    if (isApiClientErrorWithStatusCode({ error, statusCode: 429 })) {
      console.error('Rate limit exceeded. Try again later.');
      return;
    }
    
    // Check if it's a specific API error
    if (isApiClientErrorWithCode({ error, code: 'NOTE_TOO_LARGE' })) {
      console.error('The note is too large. Please reduce its size.');
      return;
    }
    
    // Handle other errors
    console.error('An error occurred:', error);
  }
}
```

## Complete Examples

### Creating and Reading a Note

```typescript
import { createNote, decryptNote, fetchNote, parseNoteUrl } from '@enclosed/lib';

async function createAndReadNote() {
  // Create a note
  const { noteUrl } = await createNote({
    content: 'This is a complete example note',
  });
  
  console.log(`Note created at: ${noteUrl}`);
  
  // Parse the URL to extract noteId and encryptionKey
  const { noteId, encryptionKey } = parseNoteUrl({ noteUrl });
  
  // Fetch the encrypted note from the server
  const note = await fetchNote({ noteId });
  
  // Decrypt the note
  const { note: decryptedNote } = await decryptNote({
    encryptedPayload: note.payload,
    encryptionKey,
  });
  
  console.log('Decrypted note content:', decryptedNote.content);
}
```

### Creating and Reading a Password-Protected Note with File Attachments

```typescript
import { createNote, decryptNote, fetchNote, parseNoteUrl, filesToNoteAssets, noteAssetsToFiles } from '@enclosed/lib';

async function createAndReadComplexNote() {
  // Prepare file attachments
  const files = [
    new File(['file content'], 'document.txt', { type: 'text/plain' }),
  ];
  
  const assets = await filesToNoteAssets({ files });
  
  // Create a password-protected note with attachments that expires after 1 day
  const { noteUrl } = await createNote({
    content: 'This is a complex note example',
    password: 'secure-password',
    assets,
    ttlInSeconds: 86400, // 1 day
  });
  
  console.log(`Complex note created at: ${noteUrl}`);
  
  // Parse the URL to extract noteId and encryptionKey
  const { noteId, encryptionKey, isPasswordProtected } = parseNoteUrl({ noteUrl });
  
  // Fetch the encrypted note from the server
  const note = await fetchNote({ noteId });
  
  // Decrypt the note with password
  const { note: decryptedNote } = await decryptNote({
    encryptedPayload: note.payload,
    encryptionKey,
    password: isPasswordProtected ? 'secure-password' : undefined,
  });
  
  console.log('Decrypted note content:', decryptedNote.content);
  
  // Handle file attachments
  if (decryptedNote.assets.length > 0) {
    const attachedFiles = await noteAssetsToFiles({ noteAssets: decryptedNote.assets });
    console.log('Attached files:', attachedFiles.map(file => file.name));
  }
}
