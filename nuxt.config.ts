import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', 'nuxt-auth-sanctum'],

  runtimeConfig: {
    public: {
      REVERB_APP_ID: process.env.VITE_REVERB_APP_ID,
      REVERB_APP_SECRET: process.env.VITE_REVERB_APP_SECRET,
      REVERB_APP_KEY: process.env.VITE_REVERB_APP_KEY,
      REVERB_HOST: process.env.VITE_REVERB_HOST,
      REVERB_PORT: process.env.VITE_REVERB_PORT,
      REVERB_SCHEME: process.env.VITE_REVERB_SCHEME,
    },
  },

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
  },
})
