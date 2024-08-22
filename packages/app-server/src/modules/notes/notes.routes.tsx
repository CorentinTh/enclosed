import { z } from 'zod';
import type { ServerInstance } from '../app/server.types';
import { validateJsonBody } from '../shared/validation/validation';
import { createNoteRepository } from './notes.repository';

export { registerNotesRoutes };

function registerNotesRoutes({ app }: { app: ServerInstance }) {
  setupGetNoteRoute({ app });
  setupCreateNoteRoute({ app });
}

function setupGetNoteRoute({ app }: { app: ServerInstance }) {
  app.get('/api/note/:noteId', async (context) => {
    const { noteId } = context.req.param();

    const storage = context.get('storage');
    const notesRepository = createNoteRepository({ storage });

    const { note } = await notesRepository.getNoteById({ noteId });

    return context.json({ note });
  });
}

function setupCreateNoteRoute({ app }: { app: ServerInstance }) {
  app.post(
    '/api/notes',
    validateJsonBody(
      z.object({
        content: z.string(),
        isPasswordProtected: z.boolean(),
        ttlSeconds: z.number().optional(),
      }),
    ),
    async (context) => {
      const { content, isPasswordProtected } = context.req.valid('json');
      const storage = context.get('storage');

      const notesRepository = createNoteRepository({ storage });

      const { noteId } = await notesRepository.saveNote({ content, isPasswordProtected });

      return context.json({ noteId });
    },
  );
}
