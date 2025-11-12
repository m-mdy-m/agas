import {colors} from "../formatters"
export function spinner(text: string) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIndex = 0;
  let interval: Timer | null = null;

  return {
    start() {
      if (interval) return;

      process.stdout.write('\x1B[?25l'); // Hide cursor

      interval = setInterval(() => {
        const frame = frames[frameIndex]!;
        process.stdout.write(`\r${colors.cyan}${frame}${colors.reset} ${text}`);
        frameIndex = (frameIndex + 1) % frames.length;
      }, 80);
    },

    stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
        process.stdout.write('\r\x1B[K'); // Clear line
        process.stdout.write('\x1B[?25h'); // Show cursor
      }
    },

    succeed(message: string) {
      this.stop();
      console.log(`${colors.green}✓${colors.reset} ${message}`);
    },

    fail(message: string) {
      this.stop();
      console.log(`${colors.red}✗${colors.reset} ${message}`);
    },

    info(message: string) {
      this.stop();
      console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
    },

    warn(message: string) {
      this.stop();
      console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
    },
  };
}
