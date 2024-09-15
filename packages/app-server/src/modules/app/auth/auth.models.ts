export { extractAccessToken };

function extractAccessToken({ autorisationHeader }: { autorisationHeader: string | undefined }) {
  if (!autorisationHeader) {
    return { accessToken: undefined };
  }

  const [type, accessToken] = autorisationHeader.split(' ').map(part => part.trim());

  if (type !== 'Bearer') {
    return { accessToken: undefined };
  }

  return { accessToken };
}
