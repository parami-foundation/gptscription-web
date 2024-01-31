import { sepolia } from "wagmi/chains";

export const DEBUG = false;

export const PROJECT_CONFIG = {
  name: 'GPTscription',
  version: '1.0.0',
  description: 'GPT Scription',
  url: 'https://gptscription.com',
};

export const GPT_CONFIG = {
  url: 'https://chat.openai.com/g/g-WRoKydgki-gpt-inscription',
};

export const NETWORK_CONFIG = {
  chains: [sepolia],
};

export const CONTRACT = {
  Sepolia: {
    GPTscription: '0x22370388e31b50432EFaBC761cc3153695d6a82D',
  },
};

export const API_CONFIG = {
  scheme: "https",
  host: "api.aime.bot",
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
};

export const ALCHEMY_CONFIG = {
  Goerli: "tG3loAdZyfqAvKB1uMf88_Z95cXhbWOc",
  Optimism: "Co3hROG5cgCbbMsaIKiGjplscQUvJGhb",
  Sepolia: "ZjlF77wYtPWb87h53LgMjgcf2cXzvJgB",
};

export const INFURA_CONFIG = {
  apiKey: "901a77920dae4685978ae537ebb4a069",
};

export const EXPLORER_CONFIG = {
  Optimism: "https://optimistic.etherscan.io",
};

export const DEFAULT_REFERRER = "0x971dF9552669c3890AFE88Cb0a068C98a9A60B7C";

export const DEFAULT_BIND_SECRET = "I've been binding for $GPTs";
export const DEFAULT_MINE_SECRET = "I've been mining for $GPTs";
export const DEFAULT_BOOST_SECRET = "I've been boosting for $GPTs";
export const DEFAULT_CLAIM_SECRET = "I've been claiming for $GPTs";
export const DEFAULT_INTELBOOST_SECRET = "I've been intel boosting for $GPTs";
