import { NETWORK_CONFIG, PROJECT_CONFIG } from "./global";

export const WALLETCONNECT_CONFIG = {
  chains: NETWORK_CONFIG.chains,
  defaultChain: NETWORK_CONFIG.chains[0],
  projectId: "3a1b0317d8c817d115a10e9458ce1961",
  metadata: {
    name: PROJECT_CONFIG.name,
    description: PROJECT_CONFIG.description,
    url: PROJECT_CONFIG.url,
    icons: [`${PROJECT_CONFIG.url}/logo.svg`],
  },
};
