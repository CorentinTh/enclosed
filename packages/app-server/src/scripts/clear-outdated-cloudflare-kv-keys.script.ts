/* eslint-disable no-console */
import process from 'node:process';
import { $, minimist } from 'zx';
import { isNil, map } from 'lodash-es';
import { isNoteExpired } from '../modules/notes/notes.models';

const { namespaceId } = minimist(process.argv.slice(2), {
  string: ['namespaceId'],

});

if (isNil(namespaceId)) {
  console.log('Missing argument:\n\n\t--namespaceId <namespaceId> is required');

  process.exit(1);
}

const noteIds: string[] = map(await $`npx wrangler kv key list --namespace-id ${namespaceId}`.json(), 'name');

console.log(`Found ${noteIds.length} notes`);

const noteDeletedIds: string[] = [];

for (const noteId of noteIds) {
  const note = await $`npx wrangler kv key get --namespace-id ${namespaceId} ${noteId}`.json();

  if (isNil(note) || isNil(note.expirationDate) || isNoteExpired({ note })) {
    console.log(`Deleting note with id: ${noteId} - ${note.expirationDate}`);
    await $`npx wrangler kv key delete --namespace-id ${namespaceId} ${noteId}`;
    noteDeletedIds.push(noteId);

    continue;
  }

  console.log(`Note with id: ${noteId} is not expired`);
}

console.log(`Deleted ${noteDeletedIds.length} notes out of ${noteIds.length}`);
