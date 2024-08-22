import type { RouteDefinition } from '@solidjs/router';
import { AppLayout } from './modules/ui/layouts/AppLayout';
import { CreateNotePage } from './modules/notes/pages/create-note.page';
import { ViewNotePage } from './modules/notes/pages/view-note.page';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        component: CreateNotePage,
      },
      {
        path: '/:noteId/:encryptionKey',
        component: ViewNotePage,
      },
    ],
  },
];
