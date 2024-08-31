export type CryptoServices = {
  encryptNote: (args: { content: string; password?: string }) => Promise<{ encryptedContent: string; encryptionKey: string }>;
};
