
# Enclosed

**Enclosed** is a minimalistic web application designed for sending private and secure notes.

All notes are end-to-end encrypted, ensuring that the server and storage have zero knowledge of the content. Users can set a password, define an expiration period (TTL), and choose to have the note self-destruct after being read.

A live instance is available at [enclosed.cc](https://enclosed.cc).

[![Enclosed](./.github/enclosed-mockup.png)](https://enclosed.cc)

## Features

- **End-to-End Encryption**: Your notes are encrypted on the client side, using AES-GCM with a 256-bit key derived using PBKDF2.
- **Zero Knowledge**: The server does not have access to the content of the notes.
- **Configurable Security Options**: Set a password, expiration time, and choose self-destruction after the note is read.
- **Minimalistic UI**: Simple and intuitive user interface for quick note sharing.
- **Dark Mode**: A dark theme for late-night note sharing.
- **Responsive Design**: Works on all devices, from desktops to mobile phones.
- **Open Source**: The source code is available under the Apache 2.0 License.
- **Self-Hostable**: Run your instance of Enclosed for private note sharing.

## Self host

### Docker

You can quickly run the application using Docker.

```bash
# From docker hub
docker run -d --name enclosed --restart unless-stopped -p 8787:8787 corentinth/enclosed
# or from GitHub Container Registry
docker run -d --name enclosed --restart unless-stopped -p 8787:8787 ghcr.io/corentin-th/enclosed
```

**With volume persistency**
Replace `/path/to/local/data` with the path to your local data directory.  

```bash
# From docker hub
docker run -d --name enclosed --restart unless-stopped -p 8787:8787 -v /path/to/local/data:/app/.data corentinth/enclosed
# or from GitHub Container Registry
docker run -d --name enclosed --restart unless-stopped -p 8787:8787 -v /path/to/local/data:/app/.data ghcr.io/corentin-th/enclosed
```

### Docker Compose

You can also use Docker Compose to run the application.

```yaml
version: '3.8'

services:
  enclosed:
    image: corentinth/enclosed
    ports:
      - 8787:8787
    volumes:
      - /path/to/local/data:/app/.data
    restart: unless-stopped
```

## Usage

1. Visit the application URL.
2. Create a new note by entering the content.
3. (Optional) Set a password and expiration time.
4. Save the note, and you will receive a unique link.
5. Share the link with the intended recipient.

## Project Structure

This project is organized as a monorepo using `pnpm` workspaces. The structure is as follows:

- **packages/app-client**: Frontend application built with SolidJS.
- **packages/app-server**: Backend application using HonoJS.

## Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` file for guidelines on how to get started, report issues, and submit pull requests.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for more information.

## Credits and Acknowledgements

This project is crafted with ❤️ by [Corentin Thomasset](https://corentin.tech).

It would not have been possible without the following open-source projects:

### Frontend

- **SolidJS**: A declarative JavaScript library for building user interfaces.
- **shadcn-solid.com**: UI components library for SolidJS.
- **Tabler Icons**: A set of open-source icons.

### Backend

- **HonoJS**: A small, fast, and lightweight web framework for building APIs.
- **unstorage**: A universal storage API.
- **Zod**: A TypeScript-first schema declaration and validation library.

### Inspiration

- **[PrivateBin](https://github.com/PrivateBin/PrivateBin)**: A minimalist, open-source online pastebin where the server has zero knowledge of pasted data.
- **[Bitwarden Send](https://bitwarden.com/products/send/)**: A secure and ephemeral way to share sensitive information.
- The [shadcn playground](https://ui.shadcn.com/examples/playground) for the ui

## Contact Information

Please use the issue tracker on GitHub for any questions or feedback.
