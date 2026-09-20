import makeWASocket from './Socket/index'

declare global {
  var __ZERONEX_BAILEYS_BRANDING__: boolean | undefined
}

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
}

if (!globalThis.__ZERONEX_BAILEYS_BRANDING__) {
  globalThis.__ZERONEX_BAILEYS_BRANDING__ = true

  console.log('')
  console.log(`${c.cyan}${c.bold}███████╗██╗  ██╗${c.reset}`)
  console.log(`${c.cyan}${c.bold}╚══███╔╝╚██╗██╔╝${c.reset}`)
  console.log(`${c.cyan}${c.bold}  ███╔╝  ╚███╔╝ ${c.reset}`)
  console.log(`${c.cyan}${c.bold} ███╔╝   ██╔██╗ ${c.reset}`)
  console.log(`${c.cyan}${c.bold}███████╗██╔╝ ██╗${c.reset}`)
  console.log(`${c.cyan}${c.bold}╚══════╝╚═╝  ╚═╝${c.reset}`)
  console.log('')
  console.log(`${c.green}${c.bold}Baileys modified by ZeroneXCode${c.reset}`)
  console.log(`${c.magenta}Tele: @ZerBackup${c.reset}`)
  console.log(`${c.gray}Package: @zeronexcode/baileys${c.reset}`)
  console.log('')
}

export * from '../WAProto/index.js'
export * from './Utils/index'
export * from './Types/index'
export * from './Defaults/index'
export * from './WABinary/index'
export * from './WAM/index'
export * from './WAUSync/index'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket }
export default makeWASocket
