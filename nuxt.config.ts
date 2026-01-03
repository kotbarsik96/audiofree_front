import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', 'nuxt-auth-sanctum', 'nuxt-laravel-echo'],

  sanctum: {
    baseUrl: import.meta.env.VITE_API_URL,
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/profile/user',
    },
  },

  devServer: {
    port: 3002,
  },

  vite: {
    plugins: [
      svgLoader({
        svgo: false,
      }),
    ],
    optimizeDeps: {
      include: ['nuxt-laravel-echo > pusher-js']
    }
  },

  echo: {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    authentication: {
      baseUrl: import.meta.env.VITE_API_URL,
      mode: 'cookie',
    },
    host: import.meta.env.VITE_REVERB_HOST,
    port: import.meta.env.VITE_REVERB_PORT,
    scheme: import.meta.env.VITE_REVERB_SCHEME,
    broadcaster: 'reverb'
  },
})
