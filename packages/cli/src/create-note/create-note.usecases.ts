import { readFromStdin as readFromStdinImpl } from '../shared/cli.models';

export async function getNoteContent({
  rawContent,
  shouldReadFromStdin,
  readFromStdin = readFromStdinImpl,
}: {
  rawContent: string | undefined;
  shouldReadFromStdin?: boolean;
  readFromStdin?: () => Promise<string>;
}) {
  if (shouldReadFromStdin) {
    const content = await readFromStdin();
    return content;
  }

  return rawContent;
}
