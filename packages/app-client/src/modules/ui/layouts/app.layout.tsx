import { authStore } from '@/modules/auth/auth.store';
import { buildTimeConfig } from '@/modules/config/config.constants';
import { getConfig } from '@/modules/config/config.provider';
import { buildDocUrl } from '@/modules/docs/docs.models';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { useNoteContext } from '@/modules/notes/notes.context';
import { useThemeStore } from '@/modules/theme/theme.store';
import { Button } from '@/modules/ui/components/button';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { A, useNavigate } from '@solidjs/router';
import { type Component, type ParentComponent, Show } from 'solid-js';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../components/dropdown-menu';
import { LanguageSwitcher, ThemeSwitcher } from '../components/navbar-sub-menus';

export const Navbar: Component = () => {
  const themeStore = useThemeStore();
  const { triggerResetNoteForm } = useNoteContext();
  const navigate = useNavigate();
  const { t } = useI18n();

  const config = getConfig();

  const newNoteClicked = () => {
    triggerResetNoteForm();
    navigate('/');
  };

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-baseline gap-4">
          <Button variant="link" class="text-lg font-semibold border-b border-transparent hover:(no-underline !border-border) h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250" onClick={newNoteClicked}>
            {t('app.title')}
          </Button>

          <span class="text-muted-foreground hidden sm:block">
            {t('app.description')}
          </span>
        </div>

        <div class="flex gap-2 items-center">
          <Button variant="secondary" onClick={newNoteClicked}>
            <div class="i-tabler-plus text-muted-foreground sm:text-base text-2xl"></div>
            <span class="hidden ml-1 sm:inline-block">{t('navbar.new-note')}</span>
          </Button>

          <Button variant="ghost" class="text-lg px-0 size-9 hidden sm:inline-flex" as={A} href="https://github.com/CorentinTh/enclosed" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
            <div class="i-tabler-brand-github"></div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden sm:inline-flex" variant="ghost" aria-label="Change theme">
              <div classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-42">
              <ThemeSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden sm:inline-flex" variant="ghost" aria-label="Language">
              <div class="i-custom-language size-4"></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <LanguageSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>

            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9" variant="ghost" aria-label="Menu icon">
              <div class="i-tabler-dots-vertical hidden sm:block"></div>
              <div class="i-tabler-menu-2 block sm:hidden"></div>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-46">

              {/* Mobile only items */}
              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer sm:hidden" target="_blank" href="https://github.com/CorentinTh/enclosed" rel="noopener noreferrer">
                <div class="i-tabler-brand-github text-lg"></div>
                {t('navbar.github')}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center gap-2 sm:hidden" aria-label="Change theme">
                  <div class="text-lg" classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
                  {t('navbar.theme.theme')}
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <ThemeSwitcher />
                </DropdownMenuSubContent>

              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center text-medium gap-2 sm:hidden" aria-label="Change language">
                  <div class="i-custom-language size-4"></div>
                  {t('navbar.language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <LanguageSwitcher />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Default items */}
              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href={buildDocUrl({ path: '/' })}>
                <div class="i-tabler-file-text text-lg"></div>
                {t('navbar.settings.documentation')}
              </DropdownMenuItem>

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href={buildDocUrl({ path: '/integrations/cli' })}>
                <div class="i-tabler-terminal text-lg"></div>
                {t('navbar.settings.cli')}
              </DropdownMenuItem>

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href="https://github.com/CorentinTh/enclosed/issues/new/choose" rel="noopener noreferrer">
                <div class="i-tabler-bug text-lg"></div>
                {t('navbar.settings.report-bug')}
              </DropdownMenuItem>

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href="https://buymeacoffee.com/cthmsst" rel="noopener noreferrer">
                <div class="i-tabler-pig-money text-lg"></div>
                {t('navbar.settings.support')}
              </DropdownMenuItem>

              {config.isAuthenticationRequired && authStore.getIsAuthenticated() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="flex items-center gap-2 cursor-pointer" onClick={() => authStore.logout()}>
                    <div class="i-tabler-logout text-lg"></div>
                    {t('navbar.settings.logout')}
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
  const { t } = useI18n();

  return (
    <div class="bg-surface border-t border-border py-6 px-6 text-center text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1">
      <div>
        {t('footer.crafted-by')}
        {' '}
        <Button variant="link" as="a" href="https://corentin.tech" target="_blank" class="p-0 text-muted-foreground underline hover:text-primary transition font-normal h-auto">Corentin Thomasset</Button>
        .
      </div>
      <div>
        {t('footer.source-code')}
        {' '}
        <Button variant="link" as="a" href="https://github.com/CorentinTh/enclosed" target="_blank" class="p-0 text-muted-foreground underline hover:text-primary transition font-normal h-auto">{t('footer.github')}</Button>
        .
      </div>

      <div>
        {t('footer.version')}
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
  const getIsSecureContext = () => {
    return window.isSecureContext ?? window.location.protocol === 'https:';
  };

  const { t } = useI18n();

  return (
    <div class="flex flex-col h-screen min-h-0">
      <Show when={!getIsSecureContext()}>
        <div class="bg-warning px-6 py-2 text-center gap-2 justify-center bg-op-20 text-warning text-pretty">
          <div class="i-tabler-alert-triangle text-base hidden lg:inline-block vertical-mid mr-2"></div>
          {t('insecureContextWarning.description')}
          {' '}
          <a href={buildDocUrl({ path: '/self-hosting/troubleshooting#why-do-i-see-a-warning-about-insecure-connexion' })} target="_blank" rel="noopener noreferrer" class="underline hover:text-primary transition">
            {t('insecureContextWarning.learn-more')}
          </a>
        </div>
      </Show>

      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>

      <Footer />

    </div>
  );
};
