import fs from 'node:fs/promises';
import path from 'node:path';
import { fileToNoteAsset } from '@enclosed/lib';

export async function checkFileExist({ filePath }: { filePath: string }): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

export async function checkFilesExist({ filePaths }: { filePaths: string[] }) {
  const missingFiles = (
    await Promise.all(
      filePaths.map(async (filePath) => {
        const exists = await checkFileExist({ filePath });
        return exists ? null : filePath;
      }),
    )).filter(Boolean) as string[];

  return { missingFiles, allFilesExist: missingFiles.length === 0 };
}

export async function buildFileAssets({ filePaths }: { filePaths: string[] }) {
  const assets = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await fs.readFile(filePath);
      const file = new File([content], path.basename(filePath));

      return fileToNoteAsset({
        file,
      });
    }),
  );

  return { assets };
}
