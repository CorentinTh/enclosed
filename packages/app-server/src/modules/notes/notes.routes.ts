import { z } from 'zod';
import { omit } from 'lodash-es';
import type { ServerInstance } from '../app/server.types';
import { validateJsonBody } from '../shared/validation/validation';
import { createNoteRepository } from './notes.repository';
import { ONE_MONTH_IN_SECONDS, TEN_MINUTES_IN_SECONDS } from './notes.constants';
import { getRefreshedNote } from './notes.usecases';

export { registerNotesRoutes };

function registerNotesRoutes({ app }: { app: ServerInstance }) {
  setupGetNoteRoute({ app });
  setupCreateNoteRoute({ app });
}

function setupGetNoteRoute({ app }: { app: ServerInstance }) {
  app.get('/api/notes/:noteId', async (context) => {
    const { noteId } = context.req.param();

    const storage = context.get('storage');
    const notesRepository = createNoteRepository({ storage });

    const { note } = await getRefreshedNote({ noteId, notesRepository });

    const formattedNote = omit(note, 'expirationDate');

    return context.json({ note: formattedNote });
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
