import { optimism } from "wagmi/chains";

export const DEBUG = true;

export const PROJECT_CONFIG = {
  name: 'GPTMiner',
  version: '1.0.0',
  description: 'GPT Miner',
  url: 'https://gptminer.io',
};

export const NETWORK_CONFIG = {
  chains: [optimism],
};

export const CONTRACT = {
  Optimism: {
    MP: '0x0000000'
  },
};

export const WEBSOCKET = {
  scheme: "wss",
  host: "api.gptminer.io",
};

export const API = {
  scheme: "https",
  host: "api.gptminer.io",
  grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
};

export const ALCHEMY_CONFIG = {
  Optimism: "Co3hROG5cgCbbMsaIKiGjplscQUvJGhb",
};

export const INFURA_CONFIG = {
  apiKey: "912a4876d6f449dea2143b0c6cf07e13",
};

export const EXPLORER_CONFIG = {
  Optimism: "https://optimistic.etherscan.io",
};
