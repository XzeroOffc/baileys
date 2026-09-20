<h1 align="center">
  <img alt="ZeroneXCode Baileys" src="https://raw.githubusercontent.com/XzeroOffc/baileys/refs/heads/master/Media/logo.png" height="75">
</h1>

<h1 align="center">ZeroneXCode Baileys</h1>

<div align="center">
A ZeroneXCode-maintained fork of Baileys, a WebSocket-based TypeScript library for interacting with WhatsApp Web.
</div>

> [!IMPORTANT]
> ZeroneXCode Baileys is based on the open-source Baileys project maintained by WhiskeySockets.
>
> Most Baileys documentation and examples can be used directly by replacing:
>
> ```ts
> '@whiskeysockets/baileys'
> ```
>
> with:
>
> ```ts
> '@zeronexcode/baileys'
> ```

## Package

Using npm:

```bash
npm install @zeronexcode/baileys
```

Using Yarn:

```bash
yarn add @zeronexcode/baileys
```

Latest GitHub version:

```bash
npm install github:XzeroOffc/baileys
```

Requires **Node.js 20 or newer**.

---

## Import

Basic import:

```ts
import makeWASocket from '@zeronexcode/baileys'
```

Import with helpers:

```ts
import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from '@zeronexcode/baileys'
```

If an original Baileys example uses:

```ts
import makeWASocket from '@whiskeysockets/baileys'
```

change it to:

```ts
import makeWASocket from '@zeronexcode/baileys'
```

---

## Basic Usage

```ts
import makeWASocket, {
  useMultiFileAuthState
} from '@zeronexcode/baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')

const sock = makeWASocket({
  auth: state,
  printQRInTerminal: false,
  markOnlineOnConnect: false
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', update => {
  const { connection } = update

  if (connection === 'open') {
    console.log('WhatsApp connected')
  }

  if (connection === 'close') {
    console.log('WhatsApp disconnected')
  }
})
```

---

# Connecting Account

Baileys connects your account as a WhatsApp Web companion device.

You can connect using:

- QR Code
- Pairing Code

---

## Starting Socket with QR Code

```ts
import makeWASocket, {
  Browsers
} from '@zeronexcode/baileys'

const sock = makeWASocket({
  browser: Browsers.ubuntu('My App'),
  printQRInTerminal: true
})
```

Scan the generated QR code using:

**WhatsApp → Linked Devices → Link a Device**

---

## Starting Socket with Pairing Code

Pairing Code allows you to connect WhatsApp Web without scanning a QR code.

The phone number must:

- include the country code
- contain numbers only
- not contain `+`
- not contain spaces
- not contain `()`
- not contain `-`

Example:

```ts
import makeWASocket from '@zeronexcode/baileys'

const sock = makeWASocket({
  printQRInTerminal: false
})

if (!sock.authState.creds.registered) {
  const number = '6281234567890'
  const code = await sock.requestPairingCode(number)
  console.log(code)
}
```

Example Indonesian number:

```text
6281234567890
```

Not:

```text
+6281234567890
081234567890
62 812 3456 7890
```

---

## Saving & Restoring Sessions

Baileys provides `useMultiFileAuthState` for simple session storage.

```ts
import makeWASocket, {
  useMultiFileAuthState
} from '@zeronexcode/baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')

const sock = makeWASocket({
  auth: state,
  printQRInTerminal: false
})

sock.ev.on('creds.update', saveCreds)
```

For production environments, using a database-backed auth state is recommended instead of relying only on filesystem sessions.

---

# Handling Messages

Listen for incoming messages:

```ts
sock.ev.on('messages.upsert', async ({ messages, type }) => {
  const msg = messages[0]

  if (!msg?.message) return

  console.log(type)
  console.log(msg)
})
```

Get message text:

```ts
const text =
  msg.message?.conversation ||
  msg.message?.extendedTextMessage?.text ||
  ''
```

---

# Sending Messages

## Text Message

```ts
await sock.sendMessage(
  '6281234567890@s.whatsapp.net',
  {
    text: 'Hello from ZeroneXCode Baileys'
  }
)
```

## Reply Message

```ts
await sock.sendMessage(
  msg.key.remoteJid,
  {
    text: 'Hello!'
  },
  {
    quoted: msg
  }
)
```

## Image

```ts
await sock.sendMessage(jid, {
  image: {
    url: './image.jpg'
  },
  caption: 'Hello from ZeroneXCode'
})
```

## Video

```ts
await sock.sendMessage(jid, {
  video: {
    url: './video.mp4'
  },
  caption: 'Video'
})
```

## Audio

```ts
await sock.sendMessage(jid, {
  audio: {
    url: './audio.mp3'
  },
  mimetype: 'audio/mpeg'
})
```

## Reaction

```ts
await sock.sendMessage(jid, {
  react: {
    text: '🔥',
    key: msg.key
  }
})
```

---

# Presence

```ts
await sock.sendPresenceUpdate('available')
await sock.sendPresenceUpdate('composing', jid)
await sock.sendPresenceUpdate('paused', jid)
```

If you want WhatsApp mobile notifications to continue normally:

```ts
const sock = makeWASocket({
  markOnlineOnConnect: false
})
```

---

# Groups

## Create Group

```ts
const group = await sock.groupCreate(
  'My Group',
  [
    '6281111111111@s.whatsapp.net',
    '6282222222222@s.whatsapp.net'
  ]
)
```

## Group Metadata

```ts
const metadata = await sock.groupMetadata(jid)
console.log(metadata)
```

## Add / Remove / Promote / Demote Participant

```ts
await sock.groupParticipantsUpdate(jid, ['6281234567890@s.whatsapp.net'], 'add')
await sock.groupParticipantsUpdate(jid, ['6281234567890@s.whatsapp.net'], 'remove')
await sock.groupParticipantsUpdate(jid, ['6281234567890@s.whatsapp.net'], 'promote')
await sock.groupParticipantsUpdate(jid, ['6281234567890@s.whatsapp.net'], 'demote')
```

## Leave Group

```ts
await sock.groupLeave(jid)
```

---

# Profile

```ts
await sock.updateProfileName('ZeroneXCode Bot')
await sock.updateProfileStatus('Using ZeroneXCode Baileys')
await sock.updateProfilePicture(jid, { url: './profile.jpg' })
```

---

# Privacy

```ts
const settings = await sock.fetchPrivacySettings(true)
console.log(settings)

const blocklist = await sock.fetchBlocklist()
console.log(blocklist)

await sock.updateBlockStatus(jid, 'block')
await sock.updateBlockStatus(jid, 'unblock')
```

---

# Full Baileys Documentation

This fork follows the upstream Baileys API.

For advanced usage and the complete API reference:

- Upstream Docs: https://baileys.wiki/docs/intro/
- Upstream Repository: https://github.com/WhiskeySockets/Baileys
- ZeroneXCode Repository: https://github.com/XzeroOffc/baileys
- ZeroneXCode npm package: `@zeronexcode/baileys`

When reading upstream documentation, simply replace:

```ts
import makeWASocket from '@whiskeysockets/baileys'
```

with:

```ts
import makeWASocket from '@zeronexcode/baileys'
```

The same applies to other imports:

```ts
import {
  useMultiFileAuthState,
  Browsers,
  DisconnectReason
} from '@zeronexcode/baileys'
```

---

## ZeroneXCode

**Baileys modified by ZeroneXCode**

Telegram:

```text
@ZerBackup
```

Package:

```text
@zeronexcode/baileys
```

Repository:

```text
https://github.com/XzeroOffc/baileys
```

---

## Repository

- ZeroneXCode fork: https://github.com/XzeroOffc/baileys
- Upstream project: https://github.com/WhiskeySockets/Baileys
- npm package: `@zeronexcode/baileys`

---

## Upstream Attribution

This project is derived from the open-source **Baileys** project maintained by
**WhiskeySockets** and its contributors.

ZeroneXCode does not claim authorship of the original Baileys codebase.

Original copyright notices and the MIT License are preserved.

Changes made in this fork include package branding, distribution configuration,
release workflow changes, documentation improvements, and ZeroneXCode-specific maintenance.

---

## Disclaimer

This project is not affiliated with, authorized by, endorsed by, or officially
connected with WhatsApp or Meta.

Use this library responsibly and in accordance with applicable terms, policies,
and laws.

Do not use it for spam, stalkerware, abusive automation, or other harmful activity.

---

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
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
