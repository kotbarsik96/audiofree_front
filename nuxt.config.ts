import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', 'nuxt-auth-sanctum'],

  sanctum: {
    baseUrl: import.meta.env.VITE_API_URL,
    origin: import.meta.env.VITE_REQUEST_URL,
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/profile/user'
    }
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
