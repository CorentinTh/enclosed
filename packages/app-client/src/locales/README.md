# Contributing to Translations

We welcome contributions to improve and expand the app's internationalization (i18n) support. Below are the guidelines for adding a new language or updating an existing translation.

## Adding a New Language

1. **Create a Language File**: To add a new language, create a JSON file named with the appropriate [ISO language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g., `fr.json` for French) in the [`packages/app-client/src/locales`](./) directory.

2. **Use the Reference File**: Refer to the [`en.json`](./en.json) file, which contains all keys used in the app. Use it as a base to ensure consistency when creating your new language file. And act as a fallback if a key is missing in the new language file.

3. **Update the Locale List**: After adding the new language file, include the language code in the `locales` array found in the [`locales.ts`](./locales.ts) file.

4. **[Optional] Check for Missing Keys**: You can verify that all translation keys are included by running the following command in the `app-client` package:

   ```bash
   pnpm script:get-missing-i18n-keys
   ```

5. **Submit a Pull Request**: Once you've added the file and updated `locales.ts`, create a pull request (PR) with your changes. Ensure that your PR is clearly titled with the language being added (e.g., "Add French translations").

## Updating an Existing Language

To improve or correct an existing language:

1. **Edit the Language File**: Make updates directly to the relevant JSON file in the [`packages/app-client/src/locales`](./) directory.

2. **Submit a Pull Request**: After making your changes, submit a pull request. Clearly describe the updates in the PR.

---

Thank you for helping us make the app accessible to a broader audience!
