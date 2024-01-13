import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
  ALCHEMY_CONFIG,
  INFURA_CONFIG,
  NETWORK_CONFIG,
  PROJECT_CONFIG,
} from "@/constants/global";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from 'wagmi/chains';
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { useEffect, useState } from "react";
import { Config, configureChains, createConfig, PublicClient, WebSocketPublicClient } from 'wagmi';
import { FallbackTransport, createPublicClient, http } from "viem";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from 'wagmi/providers/public';

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>
      > | null
    >(null);
  const [wagmiChains, setWagmiChains] = useState<any | null>(null);
  const [wagmiInitialized, setWagmiInitialized] = useState<boolean>(false);

  useEffect(() => setWagmiInitialized(true), []);

  useEffect(() => {
    console.log("Initializing Wagmi");

    const { chains, publicClient } = configureChains(
      [mainnet, polygon, optimism, arbitrum, base, zora, goerli],
      [
        alchemyProvider({
          apiKey: ALCHEMY_CONFIG.Goerli,
        }),
        infuraProvider({
          apiKey: INFURA_CONFIG.apiKey,
        }),
        publicProvider(),
      ]
    );
    setWagmiChains(chains);

    const { connectors } = getDefaultWallets({
      appName: PROJECT_CONFIG.name,
      projectId: WALLETCONNECT_CONFIG.projectId,
      chains
    });

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });

    setWagmiConfig(config);
  }, []);

  const publicClient = createPublicClient({
    chain: NETWORK_CONFIG.chains[0],
    transport: http(),
  });

  return {
    wagmiChains,
    wagmiConfig,
    publicClient,
    wagmiInitialized,
  };
}
