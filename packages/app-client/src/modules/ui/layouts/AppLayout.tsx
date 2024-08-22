import { A } from '@solidjs/router';
import type { Component, ParentComponent } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/dropdown-menu';
import { Button } from '@/modules/ui/components/button';
import { useThemeStore } from '@/modules/theme/theme.store';

export const Navbar: Component = () => {
  const themeStore = useThemeStore();

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-baseline gap-1">
          {/* <A href="/" class="text-xl font-semibold flex items-center mb-1.5">
            Enclosed
          </A> */}
          <Button as={A} href="/" variant="ghost" class="text-lg font-semibold ml--4">
            Enclosed
          </Button>

          <span class="text-muted-foreground">
            Send private and secure notes
          </span>
        </div>

        <div class="flex gap-2 items-center">
          <Button as={A} href="/" variant="secondary">
            New note
          </Button>

          <Button variant="ghost" class="text-lg px-0 size-9" as={A} href="https://github.com/CorentinTh/enclosed" target="_blank" rel="noopener noreferrer">
            <div class="i-tabler-brand-github"></div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9" variant="ghost">
              <div classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'light' })} class="flex items-center gap-2">
                <div class="i-tabler-sun text-lg"></div>
                Light mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'dark' })} class="flex items-center gap-2">
                <div class="i-tabler-moon text-lg"></div>
                Dark mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'system' })} class="flex items-center gap-2">
                <div class="i-tabler-device-laptop text-lg"></div>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button variant="ghost" class="text-lg px-0 size-9">
            <div class="i-tabler-dots-vertical"></div>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export const AppLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen min-h-0">
      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>
    </div>
  );
};
