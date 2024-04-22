// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Baydle',
    },
  },
  css: ['@/assets/styles/main.scss'],
  typescript: {
    strict: true,
  },
  modules: ['@nuxtjs/eslint-module', '@nuxt/ui', '@vueuse/nuxt', 'nuxt-gtag'],
  colorMode: {
    classSuffix: '',
  },
  gtag: {
    id: 'G-QNLZ5NY7HH',
  },
});
