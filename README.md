
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

### Configuration

You can configure the application using environment variables. Here are the available options:

<!-- env-table-start -->

| Environment Variable | Description | Default Value |
| -------------------- | ----------- | ------------- |
| `PORT` | The port to listen on when using node server | `8787` |
| `CORS_ORIGIN` | The CORS origin the server should allow | `*` |
| `TASK_DELETE_EXPIRED_NOTES_ENABLED` | Whether to enable a periodic task to delete expired notes (not available for cloudflare) | `true` |
| `TASK_DELETE_EXPIRED_NOTES_CRON` | The frequency with which to run the task to delete expired notes (cron syntax) | `0 * * * *` |
| `TASK_DELETE_EXPIRED_NOTES_RUN_ON_STARTUP` | Whether the task to delete expired notes should run on startup | `true` |
| `STORAGE_DRIVER` | The storage driver to use (cloudflare-kv-binding is not available for non-Cloudflare environments) | `cloudflare-kv-binding` |
| `STORAGE_DRIVER_CLOUDFLARE_KV_BINDING` | (only for cloudflare-kv-binding driver) The name of the Cloudflare KV binding to use | `notes` |
| `STORAGE_DRIVER_FS_LITE_PATH` | (only for fs-lite driver) The path to the directory where the data will be stored | `./.data` |

<!-- env-table-end -->

## How It Works

1. **Note Creation**: A user creates a note with some content and optionally sets a password.
2. **Key Generation**: A **base key** is generated on the client side to ensure encryption, even if no password is set.
3. **Master Key Derivation**: A **master key** is derived from the base key and the optional password using **PBKDF2 with SHA-256**.
4. **Note Encryption**: The note is encrypted using the master key with **AES-GCM** encryption.
5. **Sending to Server**: The encrypted note is sent to the server along with some metadata (ttl, is the note password-protected, should it self-destruct after reading).
6. **Storage and ID Assignment**: The server stores the encrypted note and provides an **ID** for it.
7. **Link Generation**: A **link** is generated that includes the note ID and the base key (included as a URL hash fragment to maximize security since hashes are not sent to the server).
8. **Link Sharing**: The link is shared with the intended recipient.
9. **Note Retrieval**: The recipient opens the link, and the app fetches the encrypted note and metadata from the server using the note ID.
10. **Key Extraction**: The base key is extracted from the URL hash fragment.
11. **Password Prompt (If Applicable)**: If the note is password-protected, the recipient is prompted to enter the password.
12. **Master Key Derivation**: The master key is derived from the base key and the entered password using **PBKDF2 with SHA-256**.
13. **Note Decryption**: The note is decrypted using the master key with **AES-GCM** and can now be read by the recipient.

This ensures that the note remains securely encrypted during transmission and storage, with decryption only possible by those with the correct link and (if applicable) password.

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
