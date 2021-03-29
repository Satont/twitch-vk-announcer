import { ApiClient } from 'twitch'
import { ClientCredentialsAuthProvider } from 'twitch-auth'
import NgRok from 'ngrok'
import { isProduction, PORT } from './variables'
import * as eventSub from 'twitch-eventsub'
import { expressApp } from './express'
import { postMessage } from './poster'
import { sample } from 'lodash'

const clientId = process.env.TWITCH_CLIENTID
const clientSecret = process.env.TWITCH_CLIENTSECRET

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret)
const apiClient = new ApiClient({ authProvider })

const unsubscribeFromAllSubscriptions = async () => {
  const subscriptions = await apiClient.helix.eventSub.getSubscriptions()
  for (const subscription of subscriptions.data) {
    await subscription.unsubscribe()
  }
}

const getHostName = async () => {
  if (isProduction) return process.env.HOSTNAME

  const ngrok = await NgRok.connect(PORT)
  return ngrok
}

const slugs = [
  'Эй, бегом на стримчанский.',
  'Приветики пистолетики.',
  'Коротенький стримчик',
  'Сначала z, потом x, затем c.',
  'Тычка пауза',
  'Девочки, садимся, не стесняемся',
] as const
const gameSlugs = ['Играем в', 'Игра', 'Ебу в', 'Залипаю', '', 'ПаТоЧиМ', 'Хпфу в тебя,'] as const

const bootstrap = async () => {
  try {
    const callbackUrl = await getHostName()
    await unsubscribeFromAllSubscriptions()
    const adapter = new eventSub.MiddlewareAdapter({
      hostName: callbackUrl.replace('http://', '').replace('https://', ''),
      pathPrefix: 'twitch/eventsub',
    })
    const listener = new eventSub.EventSubListener(apiClient, adapter, process.env.TWITCH_EVENTSUB_SECRET || '0123456789')
    await listener.applyMiddleware(expressApp)
    await listener.subscribeToStreamOnlineEvents(process.env.TWITCH_USERID, async (data) => {
      const stream = await apiClient.helix.streams.getStreamByUserId(data.broadcasterId)
      await postMessage(`
				${sample(slugs)}
				${stream.title}
				${sample(gameSlugs)}: ${stream.gameName}

				https://twitch.tv/${data.broadcasterName}
			`)
    })
  } catch (error) {
    console.error(error)
  }
}
bootstrap()
