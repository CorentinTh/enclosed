### Enclosed lib

This package contains the core functionalities of [Enclosed](https://enclosed.cc/), an open-source project that aims to provide a simple and secure way to share e2e encrypted notes.

## Installation

```bash
# with npm
npm install @enclosed/lib

# with yarn
yarn add @enclosed/lib

# with pnpm
pnpm add @enclosed/lib
```

## Usage

```javascript
import { createNote } from '@enclosed/lib';

const { noteUrl } = await createNote({
  content: 'Hello, World!',
  password: 'password',
  ttlInSeconds: 3600,
  deleteAfterReading: true,
});

console.log(noteUrl);
```

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for more information.

## Credits and Acknowledgements

This project is crafted with ❤️ by [Corentin Thomasset](https://corentin.tech).
