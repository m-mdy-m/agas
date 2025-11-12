#!/usr/bin/env bash
# Install script for Linux/macOS

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="m-mdy-m/agas"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"
BINARY_NAME="agas"

# Detect OS and Architecture
detect_platform() {
  OS="$(uname -s)"
  ARCH="$(uname -m)"

  case "$OS" in
    Linux*)
      OS="linux"
      ;;
    Darwin*)
      OS="darwin"
      ;;
    *)
      echo -e "${RED}❌ Unsupported OS: $OS${NC}"
      exit 1
      ;;
  esac

  case "$ARCH" in
    x86_64|amd64)
      ARCH="x64"
      ;;
    aarch64|arm64)
      ARCH="arm64"
      ;;
    *)
      echo -e "${RED}❌ Unsupported architecture: $ARCH${NC}"
      exit 1
      ;;
  esac

  echo -e "${BLUE}🔍 Detected platform: ${OS}-${ARCH}${NC}"
}

# Get latest version
get_latest_version() {
  VERSION=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
  
  if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Failed to get latest version${NC}"
    exit 1
  fi

  echo -e "${BLUE}📦 Latest version: v${VERSION}${NC}"
}

# Download binary
download_binary() {
  ARCHIVE_NAME="agas-v${VERSION}-${OS}-${ARCH}.tar.gz"
  DOWNLOAD_URL="https://github.com/${REPO}/releases/download/v${VERSION}/${ARCHIVE_NAME}"
  
  echo -e "${BLUE}⬇️  Downloading ${ARCHIVE_NAME}...${NC}"
  
  TMP_DIR=$(mktemp -d)
  cd "$TMP_DIR"
  
  if ! curl -fsSL -o "$ARCHIVE_NAME" "$DOWNLOAD_URL"; then
    echo -e "${RED}❌ Failed to download binary${NC}"
    rm -rf "$TMP_DIR"
    exit 1
  fi
  
  echo -e "${GREEN}✅ Downloaded successfully${NC}"
}

# Verify checksum
verify_checksum() {
  echo -e "${BLUE}🔐 Verifying checksum...${NC}"
  
  CHECKSUMS_URL="https://github.com/${REPO}/releases/download/v${VERSION}/checksums.txt"
  
  if ! curl -fsSL -o "checksums.txt" "$CHECKSUMS_URL"; then
    echo -e "${YELLOW}⚠️  Could not download checksums, skipping verification${NC}"
    return
  fi
  
  if command -v sha256sum >/dev/null 2>&1; then
    if sha256sum -c --ignore-missing checksums.txt >/dev/null 2>&1; then
      echo -e "${GREEN}✅ Checksum verified${NC}"
    else
      echo -e "${RED}❌ Checksum verification failed${NC}"
      rm -rf "$TMP_DIR"
      exit 1
    fi
  else
    echo -e "${YELLOW}⚠️  sha256sum not found, skipping verification${NC}"
  fi
}

# Install binary
install_binary() {
  echo -e "${BLUE}📦 Installing binary...${NC}"
  
  # Extract archive
  tar -xzf "$ARCHIVE_NAME"
  
  # Create install directory
  mkdir -p "$INSTALL_DIR"
  
  # Move binary
  BINARY_FILE="agas-${OS}-${ARCH}"
  mv "$BINARY_FILE" "$INSTALL_DIR/$BINARY_NAME"
  chmod +x "$INSTALL_DIR/$BINARY_NAME"
  
  # Cleanup
  cd -
  rm -rf "$TMP_DIR"
  
  echo -e "${GREEN}✅ Installed to $INSTALL_DIR/$BINARY_NAME${NC}"
}

# Add to PATH
setup_path() {
  # Check if already in PATH
  if command -v agas >/dev/null 2>&1; then
    echo -e "${GREEN}✅ agas is already in PATH${NC}"
    return
  fi
  
  # Detect shell
  SHELL_NAME=$(basename "$SHELL")
  
  case "$SHELL_NAME" in
    bash)
      PROFILE="$HOME/.bashrc"
      ;;
    zsh)
      PROFILE="$HOME/.zshrc"
      ;;
    fish)
      PROFILE="$HOME/.config/fish/config.fish"
      ;;
    *)
      PROFILE="$HOME/.profile"
      ;;
  esac
  
  # Add to PATH if not already there
  if ! grep -q "$INSTALL_DIR" "$PROFILE" 2>/dev/null; then
    echo -e "${BLUE}📝 Adding $INSTALL_DIR to PATH in $PROFILE${NC}"
    echo "" >> "$PROFILE"
    echo "# Added by Agas installer" >> "$PROFILE"
    echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> "$PROFILE"
    echo -e "${YELLOW}⚠️  Please restart your shell or run: source $PROFILE${NC}"
  fi
}

# Main installation
main() {
  echo -e "${BLUE}"
  echo "     █████╗  ██████╗  █████╗ ███████╗"
  echo "    ██╔══██╗██╔════╝ ██╔══██╗██╔════╝"
  echo "    ███████║██║  ███╗███████║███████╗"
  echo "    ██╔══██║██║   ██║██╔══██║╚════██║"
  echo "    ██║  ██║╚██████╔╝██║  ██║███████║"
  echo "    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝"
  echo ""
  echo "    Installation Script"
  echo -e "${NC}"
  
  detect_platform
  get_latest_version
  download_binary
 # verify_checksum
  install_binary
  setup_path
  
  echo ""
  echo -e "${GREEN}🎉 Installation complete!${NC}"
  echo ""
  echo "Run 'agas --help' to get started"
  echo ""
}

main
