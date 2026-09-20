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

## Interactive Message (Single Select)

ZeroneXCode Baileys adds high-level support for WhatsApp Native Flow interactive messages using `single_select`.

Basic example:

```ts
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'ZeroneXCode Bot',
    header: '🍃 Main Menu',
    footer: 'Powered by ZeroneXCode',
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '🍃 Menu Utama',
          sections: [
            {
              title: 'Pilih Menu',
              rows: [
                {
                  title: 'Ping',
                  description: 'Cek speed bot',
                  id: '.ping'
                },
                {
                  title: 'Owner',
                  description: 'Lihat owner bot',
                  id: '.owner'
                }
              ]
            }
          ]
        })
      }
    ]
  }
})
```

With quoted message:

```ts
await sock.sendMessage(
  jid,
  {
    interactiveMessage: {
      title: 'ZeroneXCode Bot',
      header: '🍃 Main Menu',
      footer: 'Powered by ZeroneXCode',
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🍃 Menu Utama',
            sections: [
              {
                title: 'Pilih Menu',
                rows: [
                  {
                    title: 'Ping',
                    description: 'Cek speed bot',
                    id: '.ping'
                  }
                ]
              }
            ]
          })
        }
      ]
    }
  },
  { quoted: msg }
)
```

Interactive messages can also be wrapped as view-once messages:

```ts
await sock.sendMessage(jid, {
  viewOnce: true,
  interactiveMessage: {
    title: 'ZeroneXCode Bot',
    header: '🍃 Main Menu',
    footer: 'Powered by ZeroneXCode',
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: 'Pilih Menu',
          sections: [
            {
              title: 'Main',
              rows: [
                {
                  title: 'Ping',
                  description: 'Cek speed bot',
                  id: '.ping'
                }
              ]
            }
          ]
        })
      }
    ]
  }
})
```

> [!NOTE]
> The current ZeroneXCode high-level interactive helper intentionally supports `single_select` only. Other Native Flow button types are not enabled by this helper yet.

---


# Extended Message API

This section documents ZeroneXCode extended message helpers and advanced WhatsApp message payloads.

## Album Messages

```ts
await sock.sendMessage(jid, {
  albumMessage: [
    { image: { url: './photo1.jpg' }, caption: 'First' },
    { image: { url: './photo2.jpg' }, caption: 'Second' },
    { video: { url: './clip.mp4' }, caption: 'Video' }
  ]
})
```

> [!NOTE]
> Album helpers should set `expectedImageCount` and `expectedVideoCount` from the supplied media entries.

---

# AI Rich Response Messages

AI Rich Response messages are designed to render structured content such as tables, lists, code blocks, rich text, and inline links through WhatsApp rich-response message primitives.

## Table V1

```ts
await sock.sendTable(
  jid,
  'Java vs JavaScript',
  ['Feature', 'Java', 'JavaScript'],
  [
    ['Type', 'Compiled', 'Interpreted'],
    ['Typing', 'Static', 'Dynamic'],
    ['Main Use', 'Enterprise', 'Web, Full-stack']
  ],
  quoted,
  {
    headerText: 'Comparison:',
    footer: 'Powered by ZeroneXCode'
  }
)
```

## List

```ts
await sock.sendList(
  jid,
  'Bot Info',
  [
    ['Name', 'ZeroneXCode Bot'],
    ['Version', '1.0.0'],
    ['Developer', 'ZeroneXCode']
  ],
  quoted,
  {
    footer: '© ZeroneXCode'
  }
)
```

## Code Block V1

```ts
await sock.sendCodeBlock(
  jid,
  `const greeting = "Hello World"
function sayHello(name) {
  return greeting + " " + name
}
sayHello("ZeroneXCode")`,
  quoted,
  {
    language: 'javascript',
    title: 'Example Code',
    footer: 'Powered by ZeroneXCode'
  }
)
```

Supported V1 languages:

- `javascript`
- `typescript`
- `python`

## Table V2 (Unified Response)

The V2 table uses a unified-response structure with `GenATableUXPrimitive` and base64-encoded data.

Features:

- string-based table input
- `|` or `,` column delimiters
- `;;` row delimiter
- unified-response sections
- `GenATableUXPrimitive`
- `GenAIMarkdownTextUXPrimitive`
- dual row output for submessages and sections
- extended `contextInfo`

```ts
await sock.sendTableV2(
  jid,
  [
    'Java vs JavaScript',
    'Feature | Java | JavaScript',
    'Type | Compiled | Interpreted;;Typing | Static | Dynamic;;Main Use | Enterprise | Web, Full-stack'
  ],
  quoted,
  {
    headerText: 'Comparison:',
    text: 'Here is a comparison table:',
    footer: 'Powered by ZeroneXCode'
  }
)
```

Input format:

- `table[0]` — title
- `table[1]` — header row
- `table[2+]` — data rows
- columns can use `|` or `,`
- multiple rows can use `;;`

V2 options:

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Title if `headerText` is not set |
| `headerText` | `string` | — | Text before the table |
| `text` | `string` | — | Markdown text section |
| `footer` | `string` | — | Footer text |

## Code Block V2 (Unified Response)

```ts
await sock.sendCodeBlockV2(
  jid,
  `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
  quoted,
  {
    language: 'go',
    title: 'Go Example',
    text: 'Here is a Go code snippet:',
    footer: 'Powered by ZeroneXCode'
  }
)
```

Supported V2 language families:

| Language Key | Aliases |
|---|---|
| `javascript` | `js`, `typescript`, `ts` |
| `python` | `py` |
| `go` | `golang` |
| `lua` | — |
| `bash` | `sh`, `shell` |

V2 options:

| Option | Type | Default | Description |
|---|---|---|---|
| `language` | `string` | `javascript` | Syntax-highlighting language |
| `title` | `string` | — | Title above code |
| `text` | `string` | — | Markdown text section |
| `footer` | `string` | — | Footer text |

Token types:

| Code | V1 Name | V2 Name | Description |
|---|---|---|---|
| 0 | `DEFAULT` | `DEFAULT` | Normal text, whitespace, operators |
| 1 | `KEYWORD` | `KEYWORD` | Language keywords |
| 2 | `METHOD` | `METHOD` | Function or method calls |
| 3 | `STRING` | `STR` | String literals |
| 4 | `NUMBER` | `NUMBER` | Numeric values |
| 5 | `COMMENT` | `COMMENT` | Comments |

---

# Link Message

## Inline Embed Links

```ts
await sock.sendLink(
  jid,
  'Upload results:\n✅ Freeimage\n🔗 Klik: {{IE_0}}link disini{{/IE_0}}\n✅ Yardsansh\n🔗 Klik: {{IE_1}}link disini{{/IE_1}}',
  [
    'https://example.com/upload1',
    'https://example.com/upload2'
  ],
  quoted,
  {
    headerText: '📁 Media Uploader',
    footer: '✨ Selesai!',
    botJid: '867051314767696@bot',
    forwardingScore: 3,
    citations: [
      {
        sourceTitle: 'Freeimage',
        citationNumber: 1,
        faviconCdnUrl: 'https://cdn.example.com/favicon.ico'
      },
      {
        sourceTitle: 'Yardsansh',
        citationNumber: 2
      }
    ],
    proofs: [
      {
        version: 1,
        useCase: 1,
        signature: 'base64signature==',
        certificateChain: ['base64cert1', 'base64cert2']
      }
    ]
  }
)
```

Link options:

| Option | Type | Default | Description |
|---|---|---|---|
| `headerText` | `string` | — | Text shown before link content |
| `footer` | `string` | — | Footer text |
| `botJid` | `string` | `867051314767696@bot` | Bot JID for forwarded AI context |
| `forwardingScore` | `number` | `3` | Forward score |
| `citations` | `Citation[]` | `[]` | Citation metadata |
| `proofs` | `Proof[]` | `[]` | Verification proof entries |

Citation object:

| Field | Type | Description |
|---|---|---|
| `sourceQuery` | `string` | Source query text |
| `faviconCdnUrl` | `string` | CDN URL for favicon |
| `citationNumber` | `number` | Citation index |
| `sourceTitle` | `string` | Source title |

Proof object:

| Field | Type | Description |
|---|---|---|
| `version` | `number` | Proof version |
| `useCase` | `number` | Use-case identifier |
| `signature` | `string` | Base64 signature |
| `certificateChain` | `string[]` | Base64 certificate chain |

## Link V2

```ts
await sock.sendLinkV2(
  jid,
  'Search results:\n- {{IE_0}}Official docs{{/IE_0}}\n- {{IE_1}}GitHub repo{{/IE_1}}',
  [
    {
      url: 'https://www.npmjs.com/package/@zeronexcode/baileys',
      displayName: 'Official package',
      sourceDisplayName: 'npm',
      sourceSubtitle: 'package registry'
    },
    {
      url: 'https://github.com/XzeroOffc/baileys',
      displayName: 'GitHub repo',
      sourceDisplayName: 'github',
      sourceSubtitle: 'source hosting'
    }
  ],
  quoted,
  {
    headerText: '@zeronexcode/baileys',
    footer: 'Reference links',
    searchEngine: 'MAME'
  }
)
```

---

# Other Advanced Message Types

## Payment Request

```ts
await sock.sendMessage(jid, {
  requestPaymentMessage: {
    amount: 50000,
    currency: 'IDR',
    note: 'Payment for order #123',
    from: '628xxx@s.whatsapp.net'
  }
})
```

## Event

```ts
await sock.sendMessage(jid, {
  eventMessage: {
    name: 'Community Meetup',
    description: 'Join us for the monthly meetup!',
    startTime: Date.now() + 86400000,
    endTime: Date.now() + 90000000,
    location: {
      name: 'Jakarta',
      degreesLatitude: -6.2,
      degreesLongitude: 106.8
    }
  }
})
```

## Poll Result

```ts
await sock.sendMessage(jid, {
  pollResultMessage: {
    name: 'Favorite Color?',
    pollVotes: [
      { optionName: 'Red', optionVoteCount: 42 },
      { optionName: 'Blue', optionVoteCount: 38 },
      { optionName: 'Green', optionVoteCount: 25 }
    ]
  }
})
```

## Status with Mentions

```ts
await sock.sendStatusMention(
  { text: 'Big update coming!' },
  [
    '628xxx@s.whatsapp.net',
    'groupid@g.us'
  ]
)
```

## Product Message

```ts
await sock.sendMessage(jid, {
  productMessage: {
    title: 'Wireless Headphones',
    description: 'High quality bluetooth headphones',
    productId: 'WH-001',
    retailerId: 'zeronex-shop',
    url: 'https://example.com/product',
    priceAmount1000: 299000,
    currencyCode: 'IDR',
    thumbnail: { url: 'https://example.com/product.jpg' },
    body: 'Check out this product!',
    footer: 'ZeroneXCode Shop'
  }
})
```

## Mixed Rich Message

```ts
await sock.sendRichMessage(
  jid,
  [
    {
      messageType: 2,
      messageText: 'Here is some info:'
    },
    {
      messageType: 4,
      tableMetadata: {
        title: 'Stats',
        rows: [
          { items: ['Metric', 'Value'], isHeading: true },
          { items: ['Users', '1000'] },
          { items: ['Uptime', '99.9%'] }
        ]
      }
    },
    {
      messageType: 2,
      messageText: 'And some code:'
    },
    {
      messageType: 5,
      codeMetadata: {
        codeLanguage: 'javascript',
        codeBlocks: [
          {
            highlightType: 0,
            codeContent: 'console.log("OK")'
          }
        ]
      }
    }
  ],
  quoted
)
```

SubMessage types:

| messageType | Name | Payload Field |
|---|---|---|
| 0 | UNKNOWN | — |
| 1 | GRID_IMAGE | `gridImageMetadata` |
| 2 | TEXT | `messageText` |
| 3 | INLINE_IMAGE | `imageMetadata` |
| 4 | TABLE | `tableMetadata` |
| 5 | CODE | `codeMetadata` |
| 6 | DYNAMIC | `dynamicMetadata` |
| 7 | MAP | `mapMetadata` |
| 8 | LATEX | `latexMetadata` |
| 9 | CONTENT_ITEMS | `contentItemsMetadata` |

---

# Newsletter Methods

```ts
const info = await sock.cekIDSaluran('https://whatsapp.com/channel/xxxxx')
console.log(info.name, info.subscribers)

await sock.newsletterMultipleFollow('id1@newsletter id2@newsletter')

const channels = await sock.newsletterFetchAllSubscribe()

await sock.newsletterAction('id@newsletter', 'follow')

const nl = await sock.newsletterCreate('My Channel', 'Description')

await sock.newsletterUpdate('id@newsletter', {
  name: 'New Name'
})

const { subscribers } = await sock.newsletterSubscribers('id@newsletter')

const meta = await sock.newsletterMetadata('jid', 'id@newsletter')

await sock.newsletterFollow('id@newsletter')
await sock.newsletterUnfollow('id@newsletter')
await sock.newsletterMute('id@newsletter')
await sock.newsletterUnmute('id@newsletter')

await sock.newsletterUpdateName('id@newsletter', 'New Name')
await sock.newsletterUpdateDescription('id@newsletter', 'New Desc')
await sock.newsletterUpdatePicture('id@newsletter', mediaUpload)
await sock.newsletterRemovePicture('id@newsletter')

await sock.newsletterReactMessage('id@newsletter', serverId, '👍')

const msgs = await sock.newsletterFetchMessages('id@newsletter', 50, 0, 0)

const count = await sock.newsletterAdminCount('id@newsletter')
await sock.newsletterChangeOwner('id@newsletter', newOwnerJid)
await sock.newsletterDemote('id@newsletter', userJid)
await sock.newsletterDelete('id@newsletter')
```

---

# Extended Group Methods

```ts
const meta = await sock.groupMetadata('id@g.us')

const group = await sock.groupCreate(
  'My Group',
  ['628xxx@s.whatsapp.net']
)

await sock.groupLeave('id@g.us')

await sock.groupUpdateSubject('id@g.us', 'New Subject')
await sock.groupUpdateDescription('id@g.us', 'New Description')

await sock.groupParticipantsUpdate(
  'id@g.us',
  ['628xxx@s.whatsapp.net'],
  'add'
)

const requests = await sock.groupRequestParticipantsList('id@g.us')

await sock.groupRequestParticipantsUpdate(
  'id@g.us',
  ['628xxx@s.whatsapp.net'],
  'approve'
)

const code = await sock.groupInviteCode('id@g.us')
await sock.groupRevokeInvite('id@g.us')
await sock.groupAcceptInvite('ABCDE12345')
const inviteInfo = await sock.groupGetInviteInfo('ABCDE12345')

await sock.groupSettingUpdate('id@g.us', 'announcement')
await sock.groupSettingUpdate('id@g.us', 'locked')

await sock.groupMemberAddMode('id@g.us', 'admin_add')
await sock.groupJoinApprovalMode('id@g.us', 'on')

await sock.groupToggleEphemeral('id@g.us', 86400)

const groups = await sock.groupFetchAllParticipating()

await sock.updateMemberLabel('id@g.us', 'VIP')
```

---

# Community Methods

```ts
const meta = await sock.communityMetadata('communityid@g.us')

const community = await sock.communityCreate(
  'ZeroneXCode Community',
  'Community description'
)

const subgroup = await sock.communityCreateGroup(
  'Announcements',
  ['628xxx@s.whatsapp.net'],
  'communityid@g.us'
)

await sock.communityLinkGroup('groupid@g.us', 'communityid@g.us')
await sock.communityUnlinkGroup('groupid@g.us', 'communityid@g.us')

const linked = await sock.communityFetchLinkedGroups('communityid@g.us')

const code = await sock.communityInviteCode('communityid@g.us')
await sock.communityRevokeInvite('communityid@g.us')
await sock.communityAcceptInvite(code)
const inviteInfo = await sock.communityGetInviteInfo(code)

const requests = await sock.communityRequestParticipantsList('communityid@g.us')

await sock.communityRequestParticipantsUpdate(
  'communityid@g.us',
  ['628xxx@s.whatsapp.net'],
  'approve'
)

await sock.communityParticipantsUpdate(
  'communityid@g.us',
  ['628xxx@s.whatsapp.net'],
  'add'
)

await sock.communityUpdateSubject('communityid@g.us', 'New Subject')
await sock.communityUpdateDescription('communityid@g.us', 'New Description')
await sock.communityToggleEphemeral('communityid@g.us', 86400)
await sock.communitySettingUpdate('communityid@g.us', 'announcement')
await sock.communityMemberAddMode('communityid@g.us', 'admin_add')
await sock.communityJoinApprovalMode('communityid@g.us', 'on')

await sock.communityLeave('communityid@g.us')
const communities = await sock.communityFetchAllParticipating()
```

---

# Business Methods

```ts
const { products, nextPageCursor } = await sock.getCatalog({
  jid: '628xxx@s.whatsapp.net',
  limit: 10
})

const { collections } = await sock.getCollections(
  '628xxx@s.whatsapp.net',
  10
)

const order = await sock.getOrderDetails(orderId, tokenBase64)

const product = await sock.productCreate({
  name: 'Premium Package',
  description: 'Official premium plan',
  price: 150000,
  currency: 'IDR',
  originCountryCode: 'ID',
  images: [mediaUpload]
})

await sock.productUpdate(product.id, {
  name: 'Premium Package Plus',
  description: 'Official premium plan plus',
  price: 175000,
  currency: 'IDR',
  images: [mediaUpload]
})

await sock.productDelete([product.id])

await sock.updateBusinessProfile({
  address: 'Jakarta, Indonesia',
  description: 'Official store',
  websites: ['https://example.com'],
  email: 'hello@example.com',
  hours: {
    timezone: 'Asia/Jakarta',
    days: [
      {
        day: 'mon',
        mode: 'open_24h'
      }
    ]
  }
})

await sock.updateBussinesProfile({
  description: 'Legacy alias still works'
})

await sock.updateCoverPhoto(mediaUpload)
await sock.removeCoverPhoto(coverId)

await sock.addOrEditQuickReply({
  shortcut: 'hello',
  message: 'Hello from business account'
})

await sock.removeQuickReply(timestamp)
```

---

# Chat & Profile Methods

```ts
const url = await sock.profilePictureUrl(jid, 'image')
await sock.updateProfilePicture(jid, mediaUpload)
await sock.removeProfilePicture(jid)

await sock.updateProfileName('My Name')
await sock.updateProfileStatus('Available')

await sock.sendPresenceUpdate('available', jid)
await sock.presenceSubscribe(jid)

await sock.readMessages([msg.key])
await sock.sendReceipt(jid, participant, [msgId], 'read')

await sock.updateBlockStatus(jid, 'block')
await sock.updateBlockStatus(jid, 'unblock')

const list = await sock.fetchBlocklist()

await sock.chatModify(
  {
    archive: true,
    lastMessageOrig: msg,
    lastMessage: msg
  },
  jid
)

await sock.star(
  jid,
  [{ id: msgId, fromMe: true }],
  true
)

await sock.addOrEditContact(jid, {
  displayName: 'Name'
})

await sock.removeContact(jid)

await sock.addChatLabel(jid, labelId)
await sock.removeChatLabel(jid, labelId)
await sock.addMessageLabel(jid, messageId, labelId)

await sock.resyncAppState(
  ['regular', 'critical_block'],
  true
)

const biz = await sock.getBusinessProfile(jid)
```

---

# Privacy Settings

```ts
await sock.updateLastSeenPrivacy('all')
await sock.updateOnlinePrivacy('all')
await sock.updateProfilePicturePrivacy('contacts')
await sock.updateStatusPrivacy('contacts')
await sock.updateReadReceiptsPrivacy('all')
await sock.updateGroupsAddPrivacy('all')
await sock.updateMessagesPrivacy('all')
await sock.updateCallPrivacy('everyone')
await sock.updateDefaultDisappearingMode(86400)
await sock.updateDisableLinkPreviewsPrivacy(true)
```

---

# Event Reference

```ts
sock.ev.on('connection.update', ({ connection, lastDisconnect, qr, isNewLogin, receivedPendingNotifications, isOnline }) => {})
sock.ev.on('creds.update', update => {})
sock.ev.on('messaging-history.set', ({ chats, contacts, messages, isLatest }) => {})
sock.ev.on('chats.upsert', chats => {})
sock.ev.on('chats.update', updates => {})
sock.ev.on('chats.delete', jids => {})
sock.ev.on('contacts.upsert', contacts => {})
sock.ev.on('contacts.update', updates => {})
sock.ev.on('messages.upsert', ({ messages, type }) => {})
sock.ev.on('messages.update', updates => {})
sock.ev.on('messages.delete', keys => {})
sock.ev.on('messages.reaction', reactions => {})
sock.ev.on('message-receipt.update', updates => {})
sock.ev.on('groups.update', updates => {})
sock.ev.on('group-participants.update', update => {})
sock.ev.on('group.join-request', update => {})
sock.ev.on('call', calls => {})
sock.ev.on('labels.edit', label => {})
sock.ev.on('labels.associations', ({ associated, label, type }) => {})
sock.ev.on('newsletter.update', updates => {})
sock.ev.on('newsletter.follow', jid => {})
sock.ev.on('newsletter.unfollow', jid => {})
sock.ev.on('settings.update', settings => {})
```

---

# Utility Exports

```ts
import {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  initAuthCreds,
  BufferJSON,
  fetchLatestBaileysVersion,

  tokenizeCode,
  tokenizeCodeV2,
  CodeHighlightType,
  RichSubMessageType,

  generateTableContent,
  generateTableContentV2,
  toTableMetadataV2,
  generateListContent,
  generateCodeBlockContent,
  generateCodeBlockContentV2,
  generateLinkContent,
  generateLinkContentV2,
  generateRichMessageContent,
  generateLatexContent,
  generateLatexImageContent,
  generateLatexInlineImageContent,
  generateUnifiedResponseContent,
  captureUnifiedResponse,

  buildRichContextInfo,
  buildBotForwardedMessage,

  makeStickerPack,

  JS_KEYWORDS,
  PYTHON_KEYWORDS,
  GO_KEYWORDS,
  LUA_KEYWORDS,
  BASH_KEYWORDS,
  LANGUAGE_KEYWORDS,

  Curve,
  signedKeyPair,
  aesEncryptGCM,
  aesDecryptGCM,

  jidEncode,
  jidDecode,
  jidNormalizedUser,
  areJidsSameUser,
  isJidGroup,
  isJidNewsletter,
  isLidUser,
  isPnUser,
  isJidBot,
  isJidMetaAI,
  isJidBroadcast,
  isJidStatusBroadcast,

  DisconnectReason,
  Browsers,

  Dugong,

  WASocket
} from '@zeronexcode/baileys'
```

> [!NOTE]
> Advanced helper declarations can live in dedicated socket or rich-message declaration files before being reflected everywhere in aggregated declarations.

---

# Building This Package

```bash
npm install
npm run build
```

The build process:

- runs TypeScript with `tsconfig.build.json`
- emits JavaScript and declaration files into `lib/`
- runs `tsc-esm-fix` so generated ESM imports resolve cleanly

Important notes:

- `tsconfig.json` is authoring-oriented and can use `noEmit: true`
- `tsconfig.build.json` enables emit
- published package files are limited by `package.json` `files`

---

# ZeroneXCode Extensions

| Area | Upstream Baileys v7 | ZeroneXCode Baileys |
|---|---|---|
| Interactive messages | Low-level proto support | High-level `single_select` helper |
| View-once interactive | Manual wrapping | Supported through `viewOnce` |
| Album messages | Base proto support | Extended helper surface |
| AI Rich Response | Not part of standard high-level API | Table, code block, list, rich text helpers |
| Table V1 | Not standard helper | Supported extension |
| Table V2 | Not standard helper | Unified-response extension |
| Code Block V1 | Not standard helper | Syntax-highlighted helper |
| Code Block V2 | Not standard helper | Unified-response extension |
| Link Message | Not standard helper | Inline embed/citation extension |
| Newsletter extras | Base newsletter APIs | Extended helper methods |
| Status mentions | Not standard high-level helper | Extended helper |
| Rich message builders | Not standard high-level helper | ZeroneXCode extensions |

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
