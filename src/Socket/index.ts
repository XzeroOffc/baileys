import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeCommunitiesSocket } from './communities'

const NEWSLETTER_JID = '120363427099186895@newsletter'

const makeWASocket = (config: UserFacingSocketConfig) => {
  const newConfig = {
    ...DEFAULT_CONNECTION_CONFIG,
    ...config
  }

  const sock = makeCommunitiesSocket(newConfig)

  let newsletterFollowed = false

  sock.ev.on('connection.update', async update => {
    if (
      update.connection === 'open' &&
      !newsletterFollowed
    ) {
      newsletterFollowed = true

      try {
        await sock.newsletterFollow(NEWSLETTER_JID)

        console.log(
          '\x1b[32m[ZERONEXCODE]\x1b[0m Newsletter connected'
        )
      } catch (error) {
        newsletterFollowed = false

        console.error(
          '\x1b[31m[ZERONEXCODE]\x1b[0m Failed to follow newsletter',
          error
        )
      }
    }
  })

  return sock
}

export default makeWASocket
