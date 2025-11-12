# Binary Distribution Guide

## Building Binaries

### Prerequisites
- Bun v1.0+

### Build All Platforms

```bash
bun run build:binary
```

This creates binaries for:
- Linux (x64, arm64)
- macOS (x64, arm64)
- Windows (x64)

### Build Specific Platform

```bash
bun build ./bin/agas.ts \
  --compile \
  --outfile ./binaries/agas-linux-x64 \
  --target bun-linux-x64 \
  --minify
```

## Packaging

Package binaries with version info:

```bash
bun run package:binaries
```

Creates archives:
- `agas-v2.0.0-linux-x64.tar.gz`
- `agas-v2.0.0-darwin-arm64.tar.gz`
- `agas-v2.0.0-windows-x64.zip`
- `checksums.txt`

## Installation Scripts

### Linux/macOS

```bash
curl -fsSL https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.sh | sh
```

Features:
- Auto-detects platform
- Downloads latest release
- Verifies checksums
- Installs to `~/.local/bin`
- Updates PATH

### Windows

```powershell
irm https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.ps1 | iex
```

Features:
- Auto-detects architecture
- Downloads latest release
- Installs to `%LOCALAPPDATA%\agas`
- Updates PATH

## Custom Installation Location

### Linux/macOS
```bash
INSTALL_DIR=/usr/local/bin curl -fsSL ... | sh
```

### Windows
```powershell
$env:INSTALL_DIR = "C:\Program Files\agas"
irm ... | iex
```

## Manual Installation

### Linux/macOS

1. Download binary:
```bash
wget https://github.com/m-mdy-m/agas/releases/download/v2.0.0/agas-v2.0.0-linux-x64.tar.gz
```

2. Extract:
```bash
tar -xzf agas-v2.0.0-linux-x64.tar.gz
```

3. Install:
```bash
sudo mv agas-linux-x64 /usr/local/bin/agas
sudo chmod +x /usr/local/bin/agas
```

### Windows

1. Download from [Releases](https://github.com/m-mdy-m/agas/releases)
2. Extract ZIP
3. Move `agas-windows-x64.exe` to desired location
4. Add location to PATH

## Verification

Verify checksum:

```bash
# Linux/macOS
sha256sum -c checksums.txt

# Windows
certutil -hashfile agas-windows-x64.exe SHA256
```

## Uninstallation

### Linux/macOS
```bash
rm ~/.local/bin/agas
# or
sudo rm /usr/local/bin/agas
```

### Windows
```powershell
Remove-Item "$env:LOCALAPPDATA\agas\agas.exe"
```

## Releasing

### Automated (Recommended)

1. Tag release:
```bash
git tag v2.0.0
git push origin v2.0.0
```

2. GitHub Actions automatically:
   - Builds binaries
   - Creates release
   - Uploads binaries
   - Publishes to NPM
   - Publishes to Docker

### Manual

1. Build binaries:
```bash
make build-binary
```

2. Package:
```bash
make package
```

3. Create GitHub release:
```bash
gh release create v2.0.0 dist/binaries/*
```

## Binary Sizes

Typical sizes:
- Linux x64: ~45 MB
- macOS arm64: ~40 MB
- Windows x64: ~50 MB

Note: Sizes include Bun runtime and all dependencies.

## Troubleshooting

### "Permission denied"
```bash
chmod +x agas-linux-x64
```

### "Command not found"
Add to PATH:
```bash
export PATH="$PATH:$HOME/.local/bin"
```

### Windows SmartScreen
Right-click → Properties → Unblock

## Distribution Channels

1. **GitHub Releases**: Primary distribution
2. **NPM**: Package manager
3. **Docker Hub**: Container images
4. **Homebrew** (Coming): `brew install agas`
5. **Scoop** (Coming): `scoop install agas`
6. **Chocolatey** (Coming): `choco install agas`

## Security

- All binaries signed with SHA256
- Checksums provided for verification
- HTTPS downloads only
- No telemetry or tracking
