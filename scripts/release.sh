#!/usr/bin/env bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"
echo ""

# Ask for new version
echo -e "${YELLOW}Enter new version (e.g., 2.0.1):${NC}"
read NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
  echo -e "${RED}Version cannot be empty${NC}"
  exit 1
fi

# Validate version format
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Invalid version format. Use X.Y.Z${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Preparing release v${NEW_VERSION}...${NC}"

# Update package.json
echo -e "${YELLOW}Updating package.json...${NC}"
node -e "
const pkg = require('./package.json');
pkg.version = '$NEW_VERSION';
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Update CHANGELOG.md
echo -e "${YELLOW}Update CHANGELOG.md manually if needed${NC}"
echo -e "${YELLOW}Press Enter when ready to continue...${NC}"
read

# Run tests
echo -e "${BLUE}Running tests...${NC}"
bun test

# Build
echo -e "${BLUE}Building...${NC}"
bun run build:all

# Git operations
echo -e "${BLUE}Creating git commit and tag...${NC}"
git add package.json docs/CHANGELOG.md
git commit -m "chore: release v${NEW_VERSION}"
git tag "v${NEW_VERSION}"

echo ""
echo -e "${GREEN}✓ Release prepared!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review changes: git log -1 -p"
echo "2. Push commit: git push origin main"
echo "3. Push tag: git push origin v${NEW_VERSION}"
echo ""
echo -e "${BLUE}GitHub Actions will automatically:${NC}"
echo "  - Build binaries for all platforms"
echo "  - Create GitHub release"
echo "  - Upload binaries"
echo "  - Publish to NPM"
echo "  - Publish Docker image"
echo ""
