import { A, type RouteDefinition } from '@solidjs/router';
import { AppLayout } from './modules/ui/layouts/app.layout';
import { CreateNotePage } from './modules/notes/pages/create-note.page';
import { ViewNotePage } from './modules/notes/pages/view-note.page';
import { Button } from './modules/ui/components/button';
import { NOTE_ID_REGEX } from './modules/notes/notes.constants';

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
        path: '/:noteId',
        component: ViewNotePage,
        matchFilters: {
          noteId: NOTE_ID_REGEX,
        },
      },
      {
        path: '*404',
        component: () => (
          <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-3xl font-light text-muted-foreground">404</div>
            <h1 class="font-semibold text-lg my-2">Page Not Found</h1>
            <p class="text-muted-foreground">The page you are looking for does not exist.</p>
            <p class="text-muted-foreground">Please check the URL and try again.</p>
            <Button as={A} href="/" class="mt-4" variant="secondary">
              <div class="i-tabler-arrow-left mr-2"></div>
              Go back home
            </Button>
          </div>
        ),
      },
    ],
  },
];
