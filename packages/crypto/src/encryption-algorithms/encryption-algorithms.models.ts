export { defineEncryptionMethods };

function defineEncryptionMethods(args: {
  encryptBuffer: (args: { buffer: Uint8Array; encryptionKey: Uint8Array }) => Promise<{ encryptedString: string }>;
  decryptString: (args: { encryptedString: string; encryptionKey: Uint8Array }) => Promise<{ decryptedBuffer: Uint8Array }>;
}) {
  return args;
}
