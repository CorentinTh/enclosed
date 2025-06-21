# Enclosed CLI

This package contains the CLI for [Enclosed](https://enclosed.cc), an open-source project that aims to provide a simple and secure way to share e2e encrypted notes.

## Getting Started

To install the CLI, run the following command:

### Create a note

```bash
# Basic usage
enclosed create "Hello, World!"

# Using stdin
cat file.txt | enclosed create

# With full options
enclosed create --deleteAfterReading --password "password" --ttl 3600 "Hello, World!"
```

### Configure the enclosed instance to use

```bash
# By default, the CLI uses the public instance at enclosed.cc
enclosed config set instance-url https://enclosed.cc
```

## Usage

```bash
enclosed <command> [options]
```

### Create a note

```bash
# Basic usage
enclosed create "Hello, World!"

# Using stdin
cat file.txt | enclosed create --stdin
# or
cat file.txt | enclosed create -s

# To add files as attachments
enclosed create --file file1.txt --file file2.txt "Hello, World!"

# With full options
enclosed create --file file1.txt --deleteAfterReading --password "password" --ttl 3600 "Hello, World!"

# Get more information about the command
enclosed create --help
# or
enclosed create -h
```

### View a note

```bash
# The password will be prompted if the note is password-protected
enclosed view <note-url>

# Or you can provide the password directly
enclosed view --password "password" <note-url>
```

### Configure the enclosed instance to use

```bash
# By default, the CLI uses the public instance at enclosed.cc
enclosed config set instance-url https://enclosed.cc
```

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for more information.

## Credits and Acknowledgements

This project is crafted with ❤️ by [Corentin Thomasset](https://corentin.tech).
