export { createSha256Hash };

async function createSha256Hash({ buffer }: { buffer: Uint8Array }): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest('SHA-256', buffer);

  return new Uint8Array(hash);
}
