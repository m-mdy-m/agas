
import { $ } from 'bun';
import { join } from 'path';
import pkg from "../package.json" assert {type:"json"}
const VERSION = pkg.version;
const OUTPUT_DIR = 'binaries';
const DIST_DIR = 'dist/binaries';

async function packageBinary(platform: string, arch: string, ext: string) {
  const binaryName = `agas-${platform}-${arch}${ext}`;
  const binaryPath = join(OUTPUT_DIR, binaryName);
  const archiveName = `agas-v${VERSION}-${platform}-${arch}.tar.gz`;
  const archivePath = join(DIST_DIR, archiveName);

  console.log(`📦 Packaging ${binaryName}...`);

  try {
    // Create tar.gz archive
    if (platform === 'windows') {
      // For Windows, create .zip instead
      const zipName = `agas-v${VERSION}-${platform}-${arch}.zip`;
      const zipPath = join(DIST_DIR, zipName);
      await $`zip -j ${zipPath} ${binaryPath}`;
      console.log(`✅ Created ${zipName}`);
    } else {
      // For Unix-like systems, create .tar.gz
      await $`tar -czf ${archivePath} -C ${OUTPUT_DIR} ${binaryName}`;
      console.log(`✅ Created ${archiveName}`);
    }
  } catch (error) {
    console.error(`❌ Failed to package ${binaryName}:`, error);
  }
}

async function main() {
  console.log('📦 Packaging binaries...\n');

  // Create dist directory
  await $`mkdir -p ${DIST_DIR}`;

  // Package each binary
  const platforms = [
    ['linux', 'x64', ''],
    ['linux', 'arm64', ''],
    ['darwin', 'x64', ''],
    ['darwin', 'arm64', ''],
    ['windows', 'x64', '.exe'],
  ];

  for (const [os, arch, ext] of platforms) {
    await packageBinary(os, arch, ext);
  }

  // Copy checksums
  await $`cp ${OUTPUT_DIR}/checksums.txt ${DIST_DIR}/`;

  console.log('\n✨ Packaging complete!');
  console.log(`📁 Output: ./${DIST_DIR}/`);
}

main().catch(console.error);
