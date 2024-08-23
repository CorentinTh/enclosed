/* @refresh reload */
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './app.css';

import { Suspense, render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core/color-mode';
import { routes } from './routes';
import { NoteContextProvider } from './modules/notes/notes.context';

render(
  () => {
    const initialColorMode = 'system';
    const colorModeStorageKey = 'enclosed_color_mode';
    const localStorageManager = createLocalStorageManager(colorModeStorageKey);

    return (
      <Router
        children={routes}
        root={props => (
          <Suspense>
            <NoteContextProvider>
              <ColorModeScript storageType={localStorageManager.type} storageKey={colorModeStorageKey} initialColorMode={initialColorMode} />
              <ColorModeProvider
                initialColorMode={initialColorMode}
                storageManager={localStorageManager}
              >
                <div class="min-h-screen font-sans text-sm font-400">{props.children}</div>
              </ColorModeProvider>
            </NoteContextProvider>
          </Suspense>
        )}
      />
    );
  },
  document.getElementById('root')!,
);
