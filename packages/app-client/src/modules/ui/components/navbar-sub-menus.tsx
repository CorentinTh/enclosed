import { useI18n } from '@/modules/i18n/i18n.provider';
import { cn } from '@/modules/shared/style/cn';
import { useThemeStore } from '@/modules/theme/theme.store';
import { DropdownMenuItem, DropdownMenuSeparator } from './dropdown-menu';

export function ThemeSwitcher() {
  const themeStore = useThemeStore();
  const { t } = useI18n();
  return (
    <>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'light' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-sun text-lg"></div>
        {t('navbar.theme.light-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'dark' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-moon text-lg"></div>
        {t('navbar.theme.dark-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'system' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-device-laptop text-lg"></div>
        {t('navbar.theme.system-mode')}
      </DropdownMenuItem>
    </>
  );
}

export function LanguageSwitcher() {
  const { t, getLocale, setLocale, locales } = useI18n();
  return (
    <>
      {locales.map(locale => (
        <DropdownMenuItem onClick={() => setLocale(locale.key)} class={cn('flex items-center gap-2 cursor-pointer', { 'font-semibold': getLocale() === locale.key })}>
          {locale.name}
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator />

      <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" rel="noopener noreferrer" href="https://github.com/CorentinTh/enclosed/tree/main/packages/app-client/src/locales">
        {t('navbar.settings.contribute-to-i18n')}
      </DropdownMenuItem>
    </>
  );
}
