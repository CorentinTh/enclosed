import { Show } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { useConfig, AES_256_GCM, CHACHA20_POLY1305, EncryptionAlgorithm } from '../config.provider';

interface EncryptionAlgorithmSelectorProps {
  readonly class?: string;
}

/**
 * Component that allows users to select their preferred encryption algorithm
 */
export function EncryptionAlgorithmSelector(props: EncryptionAlgorithmSelectorProps) {
  const { t } = useI18n();
  const { getEncryptionAlgorithm, setEncryptionAlgorithm } = useConfig();

  // Handle algorithm change
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newAlgorithm = target.value as EncryptionAlgorithm;
    setEncryptionAlgorithm(newAlgorithm);
  };

  return (
    <div class={`encryption-algorithm-selector ${props.class ?? ''}`}>
      <label for="encryption-algorithm" class="block text-sm font-medium mb-1">
        {t('navbar.config.encryptionAlgorithm')}
      </label>
      
      <select
        id="encryption-algorithm"
        value={getEncryptionAlgorithm()}
        onChange={handleChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      >
        <option value={AES_256_GCM}>
          {t('navbar.config.aes256gcm')} ({t('navbar.config.default')})
        </option>
        <option value={CHACHA20_POLY1305}>
          {t('navbar.config.chacha20poly1305')} ({t('navbar.config.httpCompatible')})
        </option>
      </select>
      
      <Show
        when={getEncryptionAlgorithm() === CHACHA20_POLY1305}
        fallback={
          <p class="mt-1 text-sm text-gray-500">
            {t('navbar.config.aes256gcmDescription')}
          </p>
        }
      >
        <p class="mt-1 text-sm text-gray-500">
          {t('navbar.config.chacha20poly1305Description')}
        </p>
      </Show>
    </div>
  );
}