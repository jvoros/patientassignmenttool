// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  ssr: false,

  alias: {
    "#core": "./server/core",
    "#core/*": "./server/core/*",
  },

  runtimeConfig: {
    tursoUrl: process.env.TURSO_URL, // overridden by NUXT_TURSO_URL
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN, // overridden by NUXT_TURSO_AUTH_TOKEN
    adminCode: process.env.ADMIN_CODE, //overridden by NUXT_ADMIN_CODE
    public: {
      isProdDb: "" //overridden by NUXT_IS_PROD_DB
    }
  },

  nitro: {
    preset: "node-server",
    experimental: {
      websocket: true,
    },
  },

  modules: ["nuxt-auth-utils", "@nuxt/ui"],

  css: ["~/assets/css/main.css"],
});
