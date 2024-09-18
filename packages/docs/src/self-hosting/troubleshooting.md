# Troubleshooting

## Why do I see a warning about insecure connexion?

Enclosed rely on native browser crypto APIs to encrypt and decrypt notes with security and great performance.
These APIs are only available in secure contexts (HTTPS). If you are running the app in a non-secure context (HTTP), you will see a warning in the app:

```plaintext
Your connection is not secure, the app must be served over HTTPS to work properly. You won't be able to create or view notes. Learn more.
```

You may also see a warning in the browser console:

```plaintext
The Cross-Origin-Opener-Policy header has been ignored because the URL's origin was untrustworthy.
```

You will need to serve the app over HTTPS to use it properly.
