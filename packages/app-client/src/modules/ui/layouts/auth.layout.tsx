import type { ParentComponent } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';

import { Button } from '@/modules/ui/components/button';
import { sample } from 'lodash-es';

const quotations = [
  {
    text: 'It\'s so secret, even I forgot what I wrote.',
    author: 'Anonymous',
  },
  {
    text: 'If this note self-destructs, you probably typed something important.',
    author: 'The Server, probably',
  },
  {
    text: 'Why write a love letter when you can send an encrypted one?',
    author: 'Cupid',
  },
  {
    text: 'Your secrets are safe. Seriously, I’m not even able to peek.',
    author: 'The Database',
  },
  {
    text: 'Even Sherlock can’t crack this code.',
    author: 'Dr. Watson, probably',
  },
  {
    text: 'Writing something you’ll regret? At least it’ll disappear.',
    author: 'The Note Timer',
  },
];

export const AuthLayout: ParentComponent = (props) => {
  const randomQuotation = sample(quotations)!;

  const { t } = useI18n();

  return (
    <div class="flex h-screen w-full">

      <div class="h-full hidden xl:flex flex-1 max-w-36% text-white p-6 flex-col justify-between  bg-zinc-900">
        <div>
          <Button variant="link" class="text-white text-lg border-b border-transparent hover:(no-underline !border-border) h-auto py-0 px-0 rounded-none !transition-border-color-250">
            {t('app.title')}
          </Button>

          <span class="text-muted-foreground hidden sm:block">
            {t('app.description')}
          </span>
        </div>

        <div>
          <div class="text-lg text-pretty">
            <span class="i-tabler-quote inline-block scale-x-[-1] text-2xl mr-2 text-muted-foreground"></span>
            {randomQuotation.text}
          </div>
          <div class="text-sm text-muted-foreground">
            -
            {' '}
            {randomQuotation.author}
          </div>
        </div>

      </div>

      <div class="px-6 mt-12 lg:mt-200px flex-1">
        <div class="md:max-w-sm mx-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
};
