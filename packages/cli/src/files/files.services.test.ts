import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { checkFileExist, checkFilesExist } from './files.services';

async function createTempDir() {
  const ostmpdir = os.tmpdir();
  const tmpdir = path.join(ostmpdir, 'unit-test-');
  return await fs.mkdtemp(tmpdir);
}

describe('files services', () => {
  let tmpDir: string = '';
  let fileAPath: string = '';
  let fileBPath: string = '';
  let nonExistentFilePath: string = '';

  beforeAll(async () => {
    tmpDir = await createTempDir();
    fileAPath = path.join(tmpDir, 'file-a.txt');
    fileBPath = path.join(tmpDir, 'file-b.txt');
    nonExistentFilePath = path.join(tmpDir, 'non-existent-file.txt');

    await fs.writeFile(fileAPath, 'file a content');
    await fs.writeFile(fileBPath, 'file b content');
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true });
  });

  describe('checkFileExist', () => {
    test('checks if a file exists', async () => {
      expect(await checkFileExist({ filePath: fileAPath })).to.eql(true);
      expect(await checkFileExist({ filePath: nonExistentFilePath })).to.eql(false);
    });

    test('a directory is not a file', async () => {
      expect(await checkFileExist({ filePath: tmpDir })).to.eql(false);
    });
  });

  describe('checkFilesExist', () => {
    test('ensures all provided files exist', async () => {
      expect(
        await checkFilesExist({ filePaths: [fileAPath, fileBPath] }),
      ).to.eql({
        missingFiles: [],
        allFilesExist: true,
      });
    });

    test('the missing files are reported', async () => {
      expect(
        await checkFilesExist({ filePaths: [fileAPath, fileBPath, nonExistentFilePath, tmpDir] }),
      ).to.eql({
        missingFiles: [nonExistentFilePath, tmpDir],
        allFilesExist: false,
      });
    });

    test('when no files are provided, they are all considered to exist', async () => {
      expect(
        await checkFilesExist({ filePaths: [] }),
      ).to.eql({
        missingFiles: [],
        allFilesExist: true,
      });
    });
  });
});
