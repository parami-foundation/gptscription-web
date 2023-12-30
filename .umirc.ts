import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  model: {},
  routes: [
    {
      name: "",
      path: "/",
      component: "home",
    },
  ],
  manifest: {
    basePath: "/",
  },
  fastRefresh: true,
  npmClient: 'yarn',
  jsMinifierOptions: {
    target: ["chrome80", "es2020"],
  },
  hash: true,
  cssMinifier: "cssnano",
  links: [
    {
      rel: "icon",
      href: "/logo.svg",
      type: "image/x-icon",
    },
  ],
  metas: [
    {
      name: "keywords",
      content: "meta,web3,blockchain,ethereum,social,ai",
    },
    {
      name: "description",
      content: "GPTMiner",
    },
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Expires',
      content: '0',
    },
    {
      name: 'title',
      content: 'GPTMiner - AI-Powered ME for my Web3 Social Network',
    },
    {
      name: 'og:title',
      content: 'GPTMiner - AI-Powered ME for my Web3 Social Network',
    },
    {
      name: 'description',
      content: 'Join GPTMiner now and start earning today!'
    },
    {
      name: 'og:description',
      content: 'Join GPTMiner now and start earning today!'
    },
    {
      name: 'og:image',
      content: 'https://ibb.co/XSXKn3R'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:image',
      content: 'https://ibb.co/XSXKn3R'
    },
    {
      name: 'twitter:site:domain',
      content: 'parami.io'
    },
    {
      name: 'twitter:url',
      content: 'https://t.me/aime_beta_bot/aimeapp'
    }
  ]
});
