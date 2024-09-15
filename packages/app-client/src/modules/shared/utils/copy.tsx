import type { ComponentProps, ParentComponent } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { Button } from '@/modules/ui/components/button';
import { createSignal } from 'solid-js';

export function useCopy() {
  const [getIsJustCopied, setIsJustCopied] = createSignal(false);

  const copy = ({ text }: { text: string }) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsJustCopied(true);
      setTimeout(() => setIsJustCopied(false), 2000);
    });
  };

  return { copy, getIsJustCopied };
}

export const CopyButton: ParentComponent<{ text: string; label?: string; copiedLabel?: string } & ComponentProps<typeof Button>> = (props) => {
  const { copy, getIsJustCopied } = useCopy();
  const { t } = useI18n();

  return (
    <Button
      onClick={() => copy({ text: props.text })}
      {...props}
    >
      <div classList={{ 'i-tabler-copy': !getIsJustCopied(), 'i-tabler-check': getIsJustCopied() }} class="mr-2 text-lg" />
      {props.children || (getIsJustCopied() ? props.copiedLabel ?? t('copy.success') : props.label ?? t('copy.label'))}
    </Button>
  );
};
