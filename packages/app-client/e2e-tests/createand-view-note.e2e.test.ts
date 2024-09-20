import { expect, test } from '@playwright/test';

test('Can create and view a note', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Enclosed - Send private and secure notes');

  // Write a note with a password and delete after reading
  await page.getByTestId('note-content').fill('Hello, World!');
  await page.getByTestId('note-password').fill('my-cat-is-cute');
  await page.getByTestId('delete-after-reading').click();

  await page.getByTestId('create-note').click();
  const noteUrl = await page.getByTestId('note-url').inputValue();

  expect(noteUrl).toBeDefined();

  await page.goto(noteUrl);

  await page.getByTestId('note-password-prompt').fill('my-cat-is-cute');
  await page.getByTestId('note-password-submit').click();

  const noteContent = await page.getByTestId('note-content-display').textContent();

  expect(noteContent).toBe('Hello, World!');

  // Refresh the page and check if the note is still there
  await page.reload();

  await expect(page.getByText('Note not found')).toBeVisible();
});
