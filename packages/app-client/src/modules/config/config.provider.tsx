import { createContext, createEffect, useContext } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import { createSignal, ParentComponent } from 'solid-js';

// Define encryption algorithm constants
export const AES_256_GCM = 'aes-256-gcm';
export const CHACHA20_POLY1305 = 'chacha20-poly1305';

// Configuration object type
export interface Config {
  viewNotePathPrefix: string;
  isAuthenticationRequired: boolean;
  preferredEncryptionAlgorithm: EncryptionAlgorithm;
}

// Default configuration
const defaultConfig: Config = {
  viewNotePathPrefix: 'n',
  isAuthenticationRequired: false,
  preferredEncryptionAlgorithm: AES_256_GCM,
};

// Get the application configuration
export function getConfig(): Config {
  try {
    // Try to get the config from the context if we're in a component
    const context = useContext(ConfigContext);
    if (context) {
      return context.config;
    }
  } catch (error) {
    // If we're not in a component context, continue with the fallback
  }
  
  // Fallback: Try to get the preferred encryption algorithm from localStorage
  let preferredEncryptionAlgorithm = AES_256_GCM;
  
  try {
    const storedAlgorithm = localStorage.getItem('enclosed_encryption_algorithm');
    if (storedAlgorithm && (storedAlgorithm === AES_256_GCM || storedAlgorithm === CHACHA20_POLY1305)) {
      preferredEncryptionAlgorithm = storedAlgorithm as EncryptionAlgorithm;
    }
  } catch (error) {
    console.error('Failed to read encryption algorithm from localStorage:', error);
  }
  
  return {
    ...defaultConfig,
    preferredEncryptionAlgorithm: preferredEncryptionAlgorithm as EncryptionAlgorithm,
  };
}

// Define the encryption algorithm type
export type EncryptionAlgorithm = typeof AES_256_GCM | typeof CHACHA20_POLY1305;

// Define the configuration context type
interface ConfigContextType {
  getEncryptionAlgorithm: () => EncryptionAlgorithm;
  setEncryptionAlgorithm: (algorithm: EncryptionAlgorithm) => void;
  supportedEncryptionAlgorithms: readonly EncryptionAlgorithm[];
  config: Config;
}

// Create the context with a default undefined value
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Hook to use the config context
export function useConfig() {
  const context = useContext(ConfigContext);
  
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
}

// Configuration provider component
export const ConfigProvider: ParentComponent = (props) => {
  // Create a persisted signal for the encryption algorithm
  const [getEncryptionAlgorithm, setEncryptionAlgorithm] = makePersisted(
    createSignal<EncryptionAlgorithm>(AES_256_GCM),
    { name: 'enclosed_encryption_algorithm', storage: localStorage }
  );
  
  // List of supported encryption algorithms
  const supportedEncryptionAlgorithms = [AES_256_GCM, CHACHA20_POLY1305] as const;
  
  // Validate the stored algorithm on load
  createEffect(() => {
    const currentAlgorithm = getEncryptionAlgorithm();
    const isValidAlgorithm = supportedEncryptionAlgorithms.includes(currentAlgorithm as EncryptionAlgorithm);
    
    if (!isValidAlgorithm) {
      setEncryptionAlgorithm(AES_256_GCM);
    }
  });
  
  // Create a reactive config object that updates when the encryption algorithm changes
  const [config, setConfig] = createSignal<Config>({
    ...defaultConfig,
    preferredEncryptionAlgorithm: getEncryptionAlgorithm()
  });
  
  // Update config when encryption algorithm changes
  createEffect(() => {
    const algorithm = getEncryptionAlgorithm();
    setConfig(prev => ({
      ...prev,
      preferredEncryptionAlgorithm: algorithm
    }));
  });
  
  // Create the context value
  const contextValue: ConfigContextType = {
    getEncryptionAlgorithm,
    setEncryptionAlgorithm,
    supportedEncryptionAlgorithms,
    config: config()
  };
  
  return (
    <ConfigContext.Provider value={contextValue}>
      {props.children}
    </ConfigContext.Provider>
  );
};
