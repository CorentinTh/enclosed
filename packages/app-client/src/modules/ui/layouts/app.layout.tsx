import type { Component, ParentComponent } from 'solid-js';
import { authStore } from '@/modules/auth/auth.store';
import { buildTimeConfig } from '@/modules/config/config.constants';
import { useConfig } from '@/modules/config/config.provider';
import { buildDocUrl } from '@/modules/docs/docs.models';
import { useNoteContext } from '@/modules/notes/notes.context';
import { useThemeStore } from '@/modules/theme/theme.store';
import { Button } from '@/modules/ui/components/button';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { A, useNavigate } from '@solidjs/router';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/dropdown-menu';

export const Navbar: Component = () => {
  const themeStore = useThemeStore();
  const { triggerResetNoteForm } = useNoteContext();
  const navigate = useNavigate();

  const { config } = useConfig();

  const newNoteClicked = () => {
    triggerResetNoteForm();
    navigate('/');
  };

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-baseline gap-4">
          <Button variant="link" class="text-lg font-semibold border-b border-transparent hover:(no-underline !border-border) h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250" onClick={newNoteClicked}>
            Enclosed
          </Button>

          <span class="text-muted-foreground hidden sm:block">
            Send private and secure notes
          </span>
        </div>

        <div class="flex gap-2 items-center">
          <Button variant="secondary" onClick={newNoteClicked}>
            <div class="i-tabler-plus mr-1 text-muted-foreground"></div>
            New note
          </Button>

          <Button variant="ghost" class="text-lg px-0 size-9" as={A} href="https://github.com/CorentinTh/enclosed" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
            <div class="i-tabler-brand-github"></div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9" variant="ghost" aria-label="Change theme">
              <div classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-42">
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'light' })} class="flex items-center gap-2 cursor-pointer">
                <div class="i-tabler-sun text-lg"></div>
                Light mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'dark' })} class="flex items-center gap-2 cursor-pointer">
                <div class="i-tabler-moon text-lg"></div>
                Dark mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'system' })} class="flex items-center gap-2 cursor-pointer">
                <div class="i-tabler-device-laptop text-lg"></div>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9" variant="ghost" aria-label="Change theme">
              <div class="i-tabler-dots-vertical"></div>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-46">
              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href={buildDocUrl({ path: '/' })}>
                <div class="i-tabler-file-text text-lg"></div>
                Documentation
              </DropdownMenuItem>

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href={buildDocUrl({ path: '/integrations/cli' })}>
                <div class="i-tabler-terminal text-lg"></div>
                Enclosed CLI
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href="https://buymeacoffee.com/cthmsst" rel="noopener noreferrer">
                <div class="i-tabler-pig-money text-lg"></div>
                Support Enclosed
              </DropdownMenuItem>

              {config.isAuthenticationRequired && authStore.getIsAuthenticated() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="flex items-center gap-2 cursor-pointer" onClick={() => authStore.logout()}>
                    <div class="i-tabler-logout text-lg"></div>
                    Logout
                  </DropdownMenuItem>
                </>
              )}

            </DropdownMenuContent>

          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export const Footer: Component = () => {
  return (
    <div class="bg-surface border-t border-border py-6 px-6 text-center text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1">
      <div>
        Crafted by
        {' '}
        <Button variant="link" as="a" href="https://corentin.tech" target="_blank" class="p-0 text-muted-foreground underline hover:text-primary transition font-normal h-auto">Corentin Thomasset</Button>
        .
      </div>
      <div>
        Source code available on
        {' '}
        <Button variant="link" as="a" href="https://github.com/CorentinTh/enclosed" target="_blank" class="p-0 text-muted-foreground underline hover:text-primary transition font-normal h-auto">GitHub</Button>
        .
      </div>

      <div>
        Version
        {' '}
        <Button variant="link" as="a" href={`https://github.com/CorentinTh/enclosed/tree/v${buildTimeConfig.enclosedVersion}`} target="_blank" class="p-0 text-muted-foreground underline hover:text-primary transition font-normal h-auto">
          v
          {buildTimeConfig.enclosedVersion}
        </Button>

      </div>
    </div>
  );
};

export const AppLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen min-h-0">
      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>

      <Footer />

    </div>
  );
};
