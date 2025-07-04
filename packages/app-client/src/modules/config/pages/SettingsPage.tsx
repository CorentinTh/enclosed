import { useI18n } from '@/modules/i18n/i18n.provider';
import { EncryptionAlgorithmSelector } from '../components/EncryptionAlgorithmSelector';

/**
 * Settings page component that includes configuration options
 */
export function SettingsPage() {
  const { t } = useI18n();
  
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">{t('navbar.settings.title')}</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">{t('navbar.settings.security')}</h2>
        
        <div class="space-y-6">
          {/* Encryption Algorithm Selector */}
          <EncryptionAlgorithmSelector />
          
          {/* Other security settings can be added here */}
        </div>
      </div>
      
      {/* Additional settings sections can be added here */}
    </div>
  );
}