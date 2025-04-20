export const colors = {
  reset: (text: string) => `\x1b[0m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  italic: (text: string) => `\x1b[3m${text}\x1b[0m`,
  underline: (text: string) => `\x1b[4m${text}\x1b[0m`,

  black: (text: string) => `\x1b[30m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  white: (text: string) => `\x1b[37m${text}\x1b[0m`,

  brightBlack: (text: string) => `\x1b[90m${text}\x1b[0m`,
  brightRed: (text: string) => `\x1b[91m${text}\x1b[0m`,
  brightGreen: (text: string) => `\x1b[92m${text}\x1b[0m`,
  brightYellow: (text: string) => `\x1b[93m${text}\x1b[0m`,
  brightBlue: (text: string) => `\x1b[94m${text}\x1b[0m`,
  brightMagenta: (text: string) => `\x1b[95m${text}\x1b[0m`,
  brightCyan: (text: string) => `\x1b[96m${text}\x1b[0m`,
  brightWhite: (text: string) => `\x1b[97m${text}\x1b[0m`,

  bgBlack: (text: string) => `\x1b[40m${text}\x1b[0m`,
  bgRed: (text: string) => `\x1b[41m${text}\x1b[0m`,
  bgGreen: (text: string) => `\x1b[42m${text}\x1b[0m`,
  bgYellow: (text: string) => `\x1b[43m${text}\x1b[0m`,
  bgMagenta: (text: string) => `\x1b[45m${text}\x1b[0m`,
  bgCyan: (text: string) => `\x1b[46m${text}\x1b[0m`,
  bgWhite: (text: string) => `\x1b[47m${text}\x1b[0m`,
}

export const spinner = (text: string) => {
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let frameIndex = 0
  let intervalId: ReturnType<typeof setInterval> | null = null

  return {
    start: () => {
      if (intervalId) return

      process.stdout.write('\u001B[?25l')

      intervalId = setInterval(() => {
        const frame = spinnerFrames[frameIndex]
        process.stdout.write(`\r${colors.cyan(frame!)} ${text}`)
        frameIndex = (frameIndex + 1) % spinnerFrames.length
      }, 80)
    },

    stop: () => {
      if (!intervalId) return

      clearInterval(intervalId)
      intervalId = null

      process.stdout.write('\r\x1b[K')
      process.stdout.write('\u001B[?25h')
    },

    succeed: (message: string) => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null

        process.stdout.write('\r\x1b[K')
        console.log(`${colors.green('✓')} ${message}`)
        process.stdout.write('\u001B[?25h')
      }
    },

    fail: (message: string) => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null

        process.stdout.write('\r\x1b[K')
        console.log(`${colors.red('✗')} ${message}`)
        process.stdout.write('\u001B[?25h')
      }
    },

    info: (message: string) => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null

        process.stdout.write('\r\x1b[K')
        console.log(`${colors.blue('ℹ')} ${message}`)
        process.stdout.write('\u001B[?25h')
      }
    },

    warn: (message: string) => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null

        process.stdout.write('\r\x1b[K')
        console.log(`${colors.yellow('⚠')} ${message}`)
        process.stdout.write('\u001B[?25h')
      }
    },
  }
}
