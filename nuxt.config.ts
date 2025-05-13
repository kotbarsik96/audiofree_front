import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

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
