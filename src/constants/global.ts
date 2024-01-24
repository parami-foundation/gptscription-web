import { goerli } from "wagmi/chains";

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
  chains: [goerli],
};

export const CONTRACT = {
  Goerli: {
    GPTscription: '0x50CEd13e892917Bed9155055aa2A3d11Ac4cB8Ee',
    GPTscriptionInscription: '0xd573152b7852fc324a0FE245D7EE616989900f9D',
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
};

export const INFURA_CONFIG = {
  apiKey: "901a77920dae4685978ae537ebb4a069",
};

export const EXPLORER_CONFIG = {
  Optimism: "https://optimistic.etherscan.io",
};

export const DEFAULT_REFERRER = "0x971dF9552669c3890AFE88Cb0a068C98a9A60B7C";
