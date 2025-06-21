# Contributing to Enclosed

First off, thanks for taking the time to contribute to Enclosed! We welcome contributions of all types and encourage you to help make this project better for everyone.

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code. Please report unacceptable behavior to <corentinth@proton.me>

## How Can I Contribute?

### Reporting Issues

If you find a bug, have a feature request, or need help, feel free to open an issue in the [GitHub Issue Tracker](https://github.com/CorentinTh/enclosed/issues). You're also welcome to comment on existing issues.

### Submitting Pull Requests

We follow a **GitHub Flow** model where all PRs should target the `main` branch, which is continuously deployed to production.

**Guidelines for submitting PRs:**

- Each PR should be small and atomic. Please avoid solving multiple unrelated issues in a single PR.
- Ensure that the **CI is green** before submitting. Some of the following checks are automatically run for each package: linting, type checking, testing, and building.
- PRs without a corresponding issue are welcome.
- If your PR fixes an issue, please reference the issue number in the PR description.
- If your PR adds a new feature, please include tests and update the documentation if necessary.
- Be prepared to address feedback and iterate on your PR.
- Resolving merge conflicts is part of the PR author's responsibility.

### Branching

- **Main branch**: This is the production branch. All pull requests must target this branch.
- **Feature branches**: Create a new branch for your feature (e.g., `my-new-feature`), make your changes, and then open a PR targeting `main`.

### Commit Guidelines

We use **[Conventional Commits](https://www.conventionalcommits.org/)** to keep commit messages consistent and meaningful. Please follow these guidelines when writing commit messages. While you can structure commits however you like, PRs will be squashed on merge.

## i18n

Information about the translation process can be found in the [locales README](./packages/app-client/src/locales/README.md).

### Updating an Existing Language

If you want to update an existing language file, you can do so directly in the corresponding JSON file in the [`packages/app-client/src/locales`](./packages/app-client/src/locales) directory.

## Development Setup

### Local Environment Setup

We recommend running the app locally for development. Follow these steps:

1. Clone the repository and navigate inside the project directory.

   ```bash
   git clone https://github.com/CorentinTh/enclosed.git
   cd enclosed
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server for the backend:

   ```bash
   cd packages/app-server
   pnpm dev
   ```

4. Start the frontend:

   ```bash
   cd packages/app-client
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

### Testing

We use **Vitest** for testing. Each package comes with its own testing commands.

- To run the tests for any package:

   ```bash
   pnpm test
   ```

- To run tests in watch mode:

   ```bash
   pnpm test:watch
   ```

All new features must be covered by unit or integration tests. Be sure to use business-oriented test names (avoid vague descriptions like `it('should return true')`).

## Writing Documentation

If your code changes affect the documentation, you must update the docs. The documentation is powered by **VitePress**.

To start the documentation server for local development:

1. Navigate to the `packages/docs` directory:

   ```bash
   cd packages/docs
   ```

2. Start the documentation server:

   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3001`.

## Coding Style

- Use functional programming where possible.
- Focus on clarity and maintainability over performance.
- Choose meaningful, relevant names for variables, functions, and components.

## Issue Labels

Look out for issues tagged as **good first issue** for tasks that are well-suited for new contributors. Feel free to comment on existing issues or create new ones.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License, the same as the project itself.
