<h1 align="center">
  <img alt="ZeroneXCode Baileys" src="https://raw.githubusercontent.com/XzeroOffc/baileys/refs/heads/master/Media/logo.png" height="75">
</h1>

<h1 align="center">ZeroneXCode Baileys</h1>

<div align="center">
A ZeroneXCode-maintained fork of Baileys, a WebSocket-based TypeScript library for interacting with WhatsApp Web.
</div>

## Package

```bash
npm install @zeronexcode/baileys
```

or:

```bash
yarn add @zeronexcode/baileys
```

Latest GitHub version:

```bash
npm install github:XzeroOffc/baileys
```

Requires **Node.js 20 or newer**.

## Basic Usage

```ts
import makeWASocket, {
  Browsers,
  useMultiFileAuthState
} from '@zeronexcode/baileys'

const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

const sock = makeWASocket({
  auth: state,
  browser: Browsers.ubuntu('ZeroneXCode')
})

sock.ev.on('creds.update', saveCreds)
```

For the complete Baileys API and usage guide, see the upstream documentation:
https://baileys.wiki/docs/intro/

## Repository

- ZeroneXCode fork: https://github.com/XzeroOffc/baileys
- Upstream project: https://github.com/WhiskeySockets/Baileys
- npm package: `@zeronexcode/baileys`

## Upstream Attribution

This project is derived from the open-source **Baileys** project maintained by
**WhiskeySockets** and its contributors.

ZeroneXCode does not claim authorship of the original Baileys codebase.
Original copyright notices and the MIT License are preserved.

Changes made in this fork include package branding, distribution configuration,
release workflow changes, and future ZeroneXCode-specific maintenance.

## Disclaimer

This project is not affiliated with, authorized by, endorsed by, or officially
connected with WhatsApp or Meta.

Use this library responsibly and in accordance with applicable terms, policies,
and laws. Do not use it for spam, stalkerware, abusive automation, or other
harmful activity.

## License

Copyright (c) 2025 Rajeh Taher/WhiskeySockets

Licensed under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
