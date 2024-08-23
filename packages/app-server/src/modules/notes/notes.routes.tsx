import { z } from 'zod';
import type { ServerInstance } from '../app/server.types';
import { validateJsonBody } from '../shared/validation/validation';
import { createNoteRepository } from './notes.repository';
import { ONE_MONTH_IN_SECONDS, TEN_MINUTES_IN_SECONDS } from './notes.constants';

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
        deleteAfterReading: z.boolean(),
        ttlInSeconds: z.number()
          .min(TEN_MINUTES_IN_SECONDS)
          .max(ONE_MONTH_IN_SECONDS),
      }),
    ),
    async (context) => {
      const { content, isPasswordProtected, ttlInSeconds, deleteAfterReading } = context.req.valid('json');
      const storage = context.get('storage');

      const notesRepository = createNoteRepository({ storage });

      const { noteId } = await notesRepository.saveNote({ content, isPasswordProtected, ttlInSeconds, deleteAfterReading });

      return context.json({ noteId });
    },
  );
}
