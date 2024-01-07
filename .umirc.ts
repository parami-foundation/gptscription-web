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
    {
      name: "MyToken",
      path: "/mytoken",
      component: "mytoken",
    },
    {
      name: "Hub",
      path: "/bridge",
      component: "hub",
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
  scripts: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-ZSX5DE8JFR",
      async: true,
    },
    {
      src: "https://static.geetest.com/static/tools/gt.js",
      async: true,
    },
    {
      content: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZSX5DE8JFR');
      `
    }
  ],
  links: [
    {
      rel: "icon",
      href: "/icon.svg",
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
