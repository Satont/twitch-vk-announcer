import 'source-map-support/register'
import dotenv from 'dotenv'
dotenv.config()

import { expressBootstrap } from './express'
import { posterBootstrap } from './poster'

if (
  !process.env.TWITCH_USERID ||
  !process.env.TWITCH_CLIENTID ||
  !process.env.TWITCH_CLIENTSECRET ||
  !process.env.VK_GROUP_TOKEN ||
  !process.env.HOSTNAME
) {
  console.error('Not enough ENV variables for start application')
  process.exit(0)
}

const bootstrap = async () => {
  await expressBootstrap()
  await import('./eventsub')
  await posterBootstrap()
}

bootstrap().then(() => console.info('App started'))
