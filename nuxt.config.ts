import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@import "~/scss/settings.scss";',
        },
      },
    },
    plugins: [
      svgLoader({
        svgo: false,
      }),
    ],
  },
})
