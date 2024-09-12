# Troubleshooting

## App accessible but unable to create a note

The app must be served over HTTPS to create notes. You will not be able to interact with the API if the app is not served over HTTPS.
You will see an error message like this in the console:

```plaintext
The Cross-Origin-Opener-Policy header has been ignored because the URL's origin was untrustworthy.
```
