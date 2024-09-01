import { password as prompt } from '@inquirer/prompts';

export { promptForPassword };

async function promptForPassword(): Promise<string> {
  const password = await prompt({
    message: 'Enter the password',
  });

  console.log(''); // Add a new line after the password prompt

  return password;
}
