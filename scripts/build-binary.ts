/**
 * Build standalone binaries for different platforms
 * Uses Bun's built-in compiler
 */

import { $ } from 'bun';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import pkg from "../package.json" assert { type: "json" };

const PLATFORMS = [
  { os: 'linux', arch: 'x64', ext: '' },
  { os: 'linux', arch: 'arm64', ext: '' },
  { os: 'darwin', arch: 'x64', ext: '' },
  { os: 'darwin', arch: 'arm64', ext: '' },
  { os: 'windows', arch: 'x64', ext: '.exe' },
];

const OUTPUT_DIR = 'binaries';
const VERSION = pkg.version

interface BuildConfig {
  os: string;
  arch: string;
  ext: string;
}

async function buildBinary(config: BuildConfig) {
  const { os, arch, ext } = config;
  const binaryName = `agas-${os}-${arch}${ext}`;
  const outputPath = join(OUTPUT_DIR, binaryName);

  console.log(`\n🔨 Building binary for ${os}-${arch}...`);

  try {
    // Bun compile command
    await $`bun build ./bin/agas.ts \
      --compile \
      --outfile ${outputPath} \
      --target bun-${os}-${arch} \
      --minify`;

    console.log(`✅ Built: ${binaryName}`);
    
    // Get file size
    const stats = await Bun.file(outputPath).stat();
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`   Size: ${sizeMB} MB`);

    return {
      platform: `${os}-${arch}`,
      path: outputPath,
      size: stats.size,
    };
  } catch (error) {
    console.error(`❌ Failed to build ${binaryName}:`, error);
    return null;
  }
}

async function createChecksums(builds: Array<{ platform: string; path: string }>) {
  console.log('\n📝 Creating checksums...');

  const checksumFile = join(OUTPUT_DIR, 'checksums.txt');
  let checksumContent = '';

  for (const build of builds) {
    const file = Bun.file(build.path);
    const buffer = await file.arrayBuffer();
    
    // Create SHA256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const filename = build.path.split('/').pop();
    checksumContent += `${hashHex}  ${filename}\n`;
  }

  await Bun.write(checksumFile, checksumContent);
  console.log(`✅ Checksums saved to ${checksumFile}`);
}

async function main() {
  console.log('🚀 Agas Binary Build System');
  console.log(`📦 Version: ${VERSION}\n`);

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Build for all platforms
  const results = [];
  for (const platform of PLATFORMS) {
    const result = await buildBinary(platform);
    if (result) {
      results.push(result);
    }
  }

  // Create checksums
  if (results.length > 0) {
    await createChecksums(results);
  }

  console.log('\n✨ Build complete!');
  console.log(`📦 Binaries: ${results.length}/${PLATFORMS.length}`);
  console.log(`📁 Output: ./${OUTPUT_DIR}/`);
}

main().catch(console.error);
