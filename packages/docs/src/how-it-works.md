---
outline: deep
---

# How It Works

Enclosed is designed with a focus on security and privacy, ensuring that your notes remain confidential from creation to retrieval. This section explains the entire process, from creating a note to decrypting it, highlighting the end-to-end encryption that makes Enclosed a secure platform.

## 1. Note Creation

When you create a note, you enter your content and, optionally, set a password. This step is performed entirely on the client side, meaning your data never leaves your device in an unencrypted form.

## 2. Key Generation

A **base key** is generated on your device. This key is crucial for the encryption process and ensures that even if no password is set, your note remains secure. The base key is unique and is not known to the server.

## 3. Master Key Derivation

If you set a password, a **master key** is derived from the combination of the base key and your password using **PBKDF2 with SHA-256**. This process adds an additional layer of security, ensuring that only someone with the correct password can decrypt the note.

## 4. Note Encryption

Your note is encrypted using the master key with **AES-GCM** encryption. AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) is a highly secure encryption method that provides both confidentiality and integrity for your data.

## 5. Sending to Server

The encrypted note, along with some metadata (such as the expiration time and whether the note should self-destruct after reading), is sent to the server. Importantly, the server only stores the encrypted note and metadata; it never has access to the content of the note or the keys used to encrypt it.

## 6. Storage and ID Assignment

The server stores the encrypted note and assigns it a unique **ID**. This ID is used to retrieve the note later. Because the note is encrypted before it reaches the server, even if the server is compromised, your note remains secure.

## 7. Link Generation

A **link** is generated that contains the note ID and the base key as a URL hash fragment. The URL hash fragment (everything after the `#`) is never sent to the server, making it a secure way to transmit the key needed for decryption.

## 8. Link Sharing

You share this link with the intended recipient. The security of the note relies on the secrecy of the link, as it contains the necessary information to decrypt the note.

## 9. Note Retrieval

When the recipient opens the link, the application fetches the encrypted note and its metadata from the server using the note ID. The base key, which was included in the URL hash fragment, remains on the client side.

## 10. Key Extraction

The base key is extracted from the URL hash fragment. Since this fragment was never sent to the server, the key remains secure and is only available to the recipient.

## 11. Password Prompt (If Applicable)

If the note is password-protected, the recipient is prompted to enter the password. This step ensures that only authorized users can decrypt the note.

## 12. Master Key Derivation

If a password was set, the master key is derived from the base key and the entered password using PBKDF2 with SHA-256. This process ensures that the recipient has the correct key to decrypt the note.

## 13. Note Decryption

The note is decrypted using the master key with AES-GCM encryption. Once decrypted, the recipient can read the note.
