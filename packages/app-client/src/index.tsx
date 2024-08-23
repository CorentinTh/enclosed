/* @refresh reload */
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './app.css';

import { Suspense, render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { ColorModeProvider, ColorModeScript } from '@kobalte/core/color-mode';
import { routes } from './routes';
import { NoteContextProvider } from './modules/notes/notes.context';

render(
  () => (
    <Router
      children={routes}
      root={props => (
        <Suspense>
          <NoteContextProvider>
            <ColorModeScript storageType="localStorage" storageKey="color_mode" initialColorMode="system" />
            <ColorModeProvider>
              <div class="min-h-screen font-sans text-sm font-400">{props.children}</div>
            </ColorModeProvider>
          </NoteContextProvider>
        </Suspense>
      )}
    />
  ),
  document.getElementById('root')!,
);
