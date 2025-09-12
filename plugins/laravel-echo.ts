import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Echo: Echo<'reverb'>
    Pusher: typeof Pusher
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') window.Pusher = Pusher

  const config = useRuntimeConfig()

  const echo = new Echo({
    broadcaster: 'reverb',
    client: Pusher,
    key: config.public.REVERB_APP_KEY,
    wsHost: config.public.REVERB_HOST,
    wsPort: Number(config.public.REVERB_PORT ?? 80),
    // wssPort: Number(config.public.REVERB_PORT ?? 443),
    // forceTLS: (config.public.REVERB_SCHEME ?? 'https') === 'https',
    forceTLS: false,
    enabledTransports: ['ws'],
  })

  return {
    provide: {
      echo,
    },
  }
})
