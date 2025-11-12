import { colors } from "../formatters/colors";

export async function showIntro() {
  console.clear();
  const particleFrames = [
    "        ·                    ",
    "      · · ·                  ",
    "    · · · · ·                ",
    "  · · · · · · ·              ",
    "· · · · · · · · ·            "
  ];
  for (const frame of particleFrames) {
    console.clear();
    console.log("\n\n\n\n\n");
    console.log(`${colors.cyan}${frame}${colors.reset}`);
    await sleep(150);
  }
  console.clear();
  await sleep(300);
  const title = "AGAS";
  const subtitle = "Modern HTTP Client";
  
  console.log("\n\n\n");
  let currentTitle = "";
  for (const char of title) {
    currentTitle += char;
    process.stdout.write(`\r${colors.bright}${colors.cyan}          ${currentTitle}${colors.reset}`);
    await sleep(100);
  }
  
  console.log("\n");
  await sleep(200);
  process.stdout.write(`${colors.gray}      ${subtitle}${colors.reset}`);
  await sleep(500);
  console.log("\n\n");
  const dividerLength = 40;
  for (let i = 0; i <= dividerLength; i++) {
    const divider = "─".repeat(i);
    process.stdout.write(`\r      ${colors.cyan}${divider}${colors.reset}`);
    await sleep(20);
  }
  console.log("\n");
  await sleep(300);
  const features = [
    { icon: "⚡", text: "Lightning fast", color: colors.yellow },
    { icon: "🎯", text: "Simple and intuitive", color: colors.green },
    { icon: "🔧", text: "Powerful CLI & API", color: colors.blue },
    { icon: "📦", text: "Built with Bun", color: colors.magenta }
  ];

  for (const feature of features) {
    process.stdout.write(`      ${feature.color}${feature.icon}${colors.reset}  ${colors.white}${feature.text}${colors.reset}\n`);
    await sleep(200);
  }

  console.log("\n");
  await sleep(300);
  for (let i = 0; i <= dividerLength; i++) {
    const divider = "─".repeat(i);
    process.stdout.write(`\r      ${colors.cyan}${divider}${colors.reset}`);
    await sleep(20);
  }
  console.log("\n");

  await sleep(200);
  for (let i = 0; i < 2; i++) {
    process.stdout.write(`\r      ${colors.bright}${colors.white}Get started: ${colors.cyan}agas --help${colors.reset}    `);
    await sleep(300);
    process.stdout.write(`\r      ${colors.dim}Get started: agas --help${colors.reset}    `);
    await sleep(300);
  }
  
  process.stdout.write(`\r      ${colors.bright}${colors.white}Get started: ${colors.cyan}agas --help${colors.reset}\n\n`);
  await sleep(500);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}