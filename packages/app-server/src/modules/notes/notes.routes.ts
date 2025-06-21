import type { ServerInstance } from '../app/server.types';
import { encryptionAlgorithms, serializationFormats } from '@enclosed/lib';
import { isNil } from 'lodash-es';
import { z } from 'zod';
import { createUnauthorizedError } from '../app/auth/auth.errors';
import { protectedRouteMiddleware } from '../app/auth/auth.middleware';
import { validateJsonBody } from '../shared/validation/validation';
import { ONE_MONTH_IN_SECONDS, TEN_MINUTES_IN_SECONDS } from './notes.constants';
import { createCannotCreatePrivateNoteOnPublicInstanceError, createExpirationDelayRequiredError, createNotePayloadTooLargeError } from './notes.errors';
import { formatNoteForApi } from './notes.models';
import { createNoteRepository } from './notes.repository';
import { getRefreshedNote } from './notes.usecases';

export { registerNotesRoutes };

function registerNotesRoutes({ app }: { app: ServerInstance }) {
  setupGetNoteRoute({ app });
  setupGetNoteExistsRoute({ app });
  setupCreateNoteRoute({ app });
}

function setupGetNoteRoute({ app }: { app: ServerInstance }) {
  app.get(
    '/api/notes/:noteId',
    async (context, next) => {
      const config = context.get('config');

      if (!config.public.isAuthenticationRequired) {
        return next();
      }

      const storage = context.get('storage');
      const { noteId } = context.req.param();
      const isAuthenticated = context.get('isAuthenticated');

      const { getNoteById } = createNoteRepository({ storage });

      const { note } = await getNoteById({ noteId });

      if (!note) {
        throw createUnauthorizedError();
      }

      if (note.isPublic) {
        return next();
      }

      if (!isAuthenticated) {
        throw createUnauthorizedError();
      }

      return next();
    },

    async (context) => {
      const { noteId } = context.req.param();

      const storage = context.get('storage');
      const notesRepository = createNoteRepository({ storage });

      const { note } = await getRefreshedNote({ noteId, notesRepository });

      const { apiNote } = formatNoteForApi({ note });

      return context.json({ note: apiNote });
    },
  );
}

function setupGetNoteExistsRoute({ app }: { app: ServerInstance }) {
  app.get(
    '/api/notes/:noteId/exists',
    async (context) => {
      const { noteId } = context.req.param();
      const storage = context.get('storage');

      const notesRepository = createNoteRepository({ storage });

      const { noteExists } = await notesRepository.getNoteExists({ noteId });

      return context.json({ noteExists });
    },
  );
}

function setupCreateNoteRoute({ app }: { app: ServerInstance }) {
  app.post(
    '/api/notes',
    protectedRouteMiddleware,
    validateJsonBody(
      z.object({
        payload: z.string(),
        deleteAfterReading: z.boolean(),
        ttlInSeconds: z.number()
          .min(TEN_MINUTES_IN_SECONDS)
          .max(ONE_MONTH_IN_SECONDS)
          .optional(),

        // @ts-expect-error zod wants strict non empty array
        encryptionAlgorithm: z.enum(encryptionAlgorithms),
        // @ts-expect-error zod wants strict non empty array
        serializationFormat: z.enum(serializationFormats),

        isPublic: z.boolean().optional().default(true),
      }),
    ),

    async (context, next) => {
      const config = context.get('config');
      const { payload, isPublic, ttlInSeconds } = context.req.valid('json');

      if (payload.length > config.notes.maxEncryptedPayloadLength) {
        throw createNotePayloadTooLargeError();
      }

      if (isPublic === false && !config.public.isAuthenticationRequired) {
        throw createCannotCreatePrivateNoteOnPublicInstanceError();
      }

      if (isNil(ttlInSeconds) && !config.public.isSettingNoExpirationAllowed) {
        throw createExpirationDelayRequiredError();
      }

      await next();
    },

    async (context) => {
      const { payload, ttlInSeconds, deleteAfterReading, encryptionAlgorithm, serializationFormat, isPublic } = context.req.valid('json');
      const storage = context.get('storage');

      const notesRepository = createNoteRepository({ storage });

      const { noteId } = await notesRepository.saveNote({ payload, ttlInSeconds, deleteAfterReading, encryptionAlgorithm, serializationFormat, isPublic });

      return context.json({ noteId });
    },
  );
}
