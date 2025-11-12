# Binary Distribution Guide

This guide explains how Agas binaries are built, distributed, and installed. If you're a user looking to install Agas, the install scripts handle everything automatically. This guide is for maintainers and contributors who want to understand the distribution process.

## Overview

Agas is distributed as standalone binaries for multiple platforms. Users can download and run these binaries without installing Node.js, Bun, or any other dependencies.

## Supported Platforms

Agas provides pre-built binaries for:

- **Linux**: x64 and ARM64
- **macOS**: x64 (Intel) and ARM64 (Apple Silicon)
- **Windows**: x64

Each binary is a completely standalone executable that includes the Bun runtime.

## Building Binaries

### Prerequisites

To build binaries yourself, you need:

- Bun v1.0 or later
- Access to the target platform (or use GitHub Actions for cross-compilation)

### Building All Platforms

The simplest way to build all binaries:

```bash
bun run build:binary
```

This script:
1. Creates a `binaries` directory
2. Compiles Agas for each platform
3. Generates SHA256 checksums
4. Reports the size of each binary

### Building for a Specific Platform

If you only want to build for one platform:

```bash
bun build ./bin/agas.ts \
  --compile \
  --outfile ./binaries/agas-linux-x64 \
  --target bun-linux-x64 \
  --minify
```

Available targets:
- `bun-linux-x64`
- `bun-linux-arm64`
- `bun-darwin-x64`
- `bun-darwin-arm64`
- `bun-windows-x64`

### Build Output

After building, you'll find in the `binaries` directory:

```
binaries/
  agas-linux-x64
  agas-linux-arm64
  agas-darwin-x64
  agas-darwin-arm64
  agas-windows-x64.exe
  checksums.txt
```

Binary sizes are typically:
- Linux: 45-50 MB
- macOS: 50-55 MB  
- Windows: 50-55 MB

## Packaging

### Creating Release Archives

After building binaries, package them for distribution:

```bash
bun run package:binaries
```

This creates:
- `.tar.gz` archives for Linux and macOS
- `.zip` archives for Windows
- A checksums file with SHA256 hashes

Output structure:

```
dist/binaries/
  agas-v2.0.2-linux-x64.tar.gz
  agas-v2.0.2-linux-arm64.tar.gz
  agas-v2.0.2-darwin-x64.tar.gz
  agas-v2.0.2-darwin-arm64.tar.gz
  agas-v2.0.2-windows-x64.zip
  checksums.txt
```

### Full Release Process

Build and package everything in one command:

```bash
bun run release:binaries
```

## Installation Methods

Agas can be installed in several ways, each suited for different use cases.

### Install Scripts (Recommended)

The easiest installation method uses our automated scripts.

**Linux and macOS:**

```bash
curl -fsSL https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.sh | sh
```

What it does:
1. Detects your operating system and processor type
2. Finds the latest release from GitHub
3. Downloads the appropriate binary
4. Verifies the checksum
5. Installs to `~/.local/bin`
6. Adds that directory to your PATH

**Windows:**

```powershell
irm https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.ps1 | iex
```

What it does:
1. Detects your processor architecture
2. Downloads the latest Windows release
3. Installs to `%LOCALAPPDATA%\agas`
4. Adds that directory to your PATH

### Custom Installation Location

You can specify where to install:

**Linux/macOS:**
```bash
INSTALL_DIR=/usr/local/bin curl -fsSL ... | sh
```

**Windows:**
```powershell
$env:INSTALL_DIR = "C:\Program Files\agas"
irm ... | iex
```

### Manual Installation

If you prefer to install manually:

**Linux/macOS:**

1. Download the binary for your platform from [GitHub Releases](https://github.com/m-mdy-m/agas/releases)

2. Extract the archive:
   ```bash
   tar -xzf agas-v2.0.2-linux-x64.tar.gz
   ```

3. Make it executable and move it:
   ```bash
   chmod +x agas-linux-x64
   sudo mv agas-linux-x64 /usr/local/bin/agas
   ```

4. Verify:
   ```bash
   agas --version
   ```

**Windows:**

1. Download the `.zip` file from [GitHub Releases](https://github.com/m-mdy-m/agas/releases)

2. Extract the archive

3. Move `agas-windows-x64.exe` to a directory in your PATH, or:
   - Create a directory like `C:\Program Files\agas`
   - Move the `.exe` file there
   - Add that directory to your PATH through System Properties

4. Verify by opening a new terminal:
   ```powershell
   agas --version
   ```

## Verification

Always verify downloaded binaries using the checksums file.

### Linux/macOS

```bash
# Download checksums
curl -fsSL https://github.com/m-mdy-m/agas/releases/download/v2.0.2/checksums.txt -o checksums.txt

# Verify your binary
sha256sum -c checksums.txt --ignore-missing
```

You should see output like:
```
agas-linux-x64: OK
```

### Windows

```powershell
# Calculate the hash of your binary
certutil -hashfile agas-windows-x64.exe SHA256

# Compare with the checksums.txt file
```

The hashes should match exactly.

## Uninstalling

### Linux/macOS

If installed to `~/.local/bin`:
```bash
rm ~/.local/bin/agas
```

If installed to `/usr/local/bin`:
```bash
sudo rm /usr/local/bin/agas
```

### Windows

If installed via script:
```powershell
Remove-Item "$env:LOCALAPPDATA\agas\agas.exe"
```

Then remove the directory from your PATH through System Properties.

## Troubleshooting

### Permission Denied

**Linux/macOS:**

If you get "permission denied" when trying to run the binary:

```bash
chmod +x agas-linux-x64
```

### Command Not Found

If the `agas` command isn't found after installation:

**Linux/macOS:**

Add the installation directory to your PATH. Edit your shell configuration file (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export PATH="$PATH:$HOME/.local/bin"
```

Then reload:
```bash
source ~/.bashrc  # or ~/.zshrc
```

**Windows:**

The installation script should handle this automatically, but if not:

1. Open System Properties
2. Go to Environment Variables
3. Edit the PATH variable for your user
4. Add the installation directory
5. Restart your terminal

### Windows SmartScreen Warning

Windows might show a warning because the binary isn't signed with a certificate. This is normal for open source software.

To run anyway:
1. Click "More info"
2. Click "Run anyway"

Or, right-click the file, select Properties, and check "Unblock" at the bottom.

### Binary Won't Run

If the binary crashes or won't start:

1. Make sure you downloaded the correct version for your platform
2. Check that your operating system is supported
3. Try re-downloading in case the file was corrupted
4. On Linux, some systems might need additional libraries

## Distribution Channels

Agas is available through multiple distribution channels:

### 1. GitHub Releases

Primary distribution method. Each release includes:
- Pre-built binaries for all platforms
- Source code archives
- Checksums file
- Release notes

Download: https://github.com/m-mdy-m/agas/releases

### 2. NPM Registry

Available as a Node.js package:

```bash
npm install -g @medishn/agas
```

This method:
- Requires Node.js or Bun
- Provides the JavaScript library
- Includes the CLI tool
- Gets updates through npm

### 3. Docker Hub

Available as a Docker image:

```bash
docker pull bitsgenix/agas:latest
```

Advantages:
- No local installation needed
- Consistent environment
- Easy to integrate into CI/CD

### 4. Future Distribution

We're working on adding:

- **Homebrew** (macOS): `brew install agas`
- **Scoop** (Windows): `scoop install agas`
- **Chocolatey** (Windows): `choco install agas`
- **APT repository** (Debian/Ubuntu)
- **Snapcraft** (Linux): `snap install agas`

## Release Process

For maintainers creating a new release:

### 1. Update Version

Update the version in `package.json`:

```json
{
  "version": "2.0.3"
}
```

### 2. Update Changelog

Add release notes to `docs/CHANGELOG.md`.

### 3. Build and Test

```bash
# Run tests
bun test

# Build everything
bun run build:all

# Build binaries
bun run release:binaries
```

### 4. Create Git Tag

```bash
git add .
git commit -m "chore: release v2.0.3"
git tag v2.0.3
```

### 5. Push

```bash
git push origin main
git push origin v2.0.3
```

### 6. Automated Actions

GitHub Actions will automatically:
1. Build binaries for all platforms
2. Create a GitHub release
3. Upload binaries and checksums
4. Publish to NPM
5. Build and push Docker image

The process takes about 10-15 minutes.

### 7. Verify

After the release:
1. Check the GitHub release page
2. Verify binaries are available
3. Test the install scripts
4. Check NPM package
5. Verify Docker image

## CI/CD Pipeline

Our GitHub Actions workflow handles:

### Binary Building

The `release.yml` workflow:
- Builds for all platforms in parallel
- Creates checksums
- Packages archives
- Uploads artifacts

### Publishing

On tag push (`v*.*.*`):
- Creates GitHub release
- Uploads binaries
- Publishes to NPM
- Pushes Docker image

### Testing

The `ci.yml` workflow:
- Runs tests on every push
- Checks TypeScript compilation
- Validates the build

## Binary Details

### Size Optimization

Binaries are optimized using:
- Bun's built-in minification
- Tree shaking of unused code
- Compression in archives

Typical sizes:
- Uncompressed: 50 MB
- Compressed (tar.gz): 15-20 MB
- Compressed (zip): 15-20 MB

### Runtime Inclusion

Each binary includes:
- Agas code
- Bun runtime
- Required system libraries

This makes them truly standalone but increases size.

### Security

Binaries are:
- Built in GitHub's secure environment
- Checksummed for verification
- Distributed over HTTPS

We don't currently sign Windows binaries with a certificate, which is why you might see a SmartScreen warning.

## Support

If you have questions about distribution or installation:

- Check existing issues: https://github.com/m-mdy-m/agas/issues
- Open a new issue if needed
- Read the main documentation: https://github.com/m-mdy-m/agas

For security issues, see our [Security Policy](./SECURITY.md).