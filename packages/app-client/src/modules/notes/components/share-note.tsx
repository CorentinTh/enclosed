import type { Component } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { Button } from '@/modules/ui/components/button';
import { Dialog, DialogContent, DialogTitle } from '@/modules/ui/components/dialog';
import { createSignal } from 'solid-js';

export const ShareNote: Component<{ noteUrl: string; deleteAfterReading: boolean; ttlInSeconds?: number; password?: string }> = (props) => {
  const { t } = useI18n();
  const [getOpenShareDialog, setOpenShareDialog] = createSignal(false);

  const onShareClick = () => {
    setOpenShareDialog(true);
  };

  return (
    <>
      <Button onClick={onShareClick}>
        {t('create.share.button')}
      </Button>

      <Dialog open={getOpenShareDialog()} onOpenChange={setOpenShareDialog}>
        <DialogContent>
          <DialogTitle>
            {t('create.share.title')}
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
};
