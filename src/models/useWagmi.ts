import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
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
} from 'wagmi/chains';
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { useEffect, useState } from "react";
import { Config, configureChains, createConfig, PublicClient, WebSocketPublicClient } from 'wagmi';
import { FallbackTransport, createPublicClient, http } from "viem";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from 'wagmi/providers/public';
import { coinbaseWallet, imTokenWallet, injectedWallet, metaMaskWallet, okxWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>,
        WebSocketPublicClient<FallbackTransport>
      > | null
    >(null);
  const [wagmiChains, setWagmiChains] = useState<any | null>(null);
  const [wagmiInitialized, setWagmiInitialized] = useState<boolean>(false);

  useEffect(() => setWagmiInitialized(true), []);

  useEffect(() => {
    indexedDB?.deleteDatabase('WALLET_CONNECT_V2_INDEXED_DB');
    console.log("Initializing Wagmi");

    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [...NETWORK_CONFIG.chains, mainnet, polygon, optimism, arbitrum, base, zora],
      [
        alchemyProvider({
          apiKey: ALCHEMY_CONFIG.Sepolia,
        }),
        infuraProvider({
          apiKey: INFURA_CONFIG.apiKey,
        }),
        publicProvider(),
      ]
    );
    setWagmiChains(chains);

    const connectors = connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet({
            chains
          }),
          metaMaskWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains
          }),
          okxWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains
          }),
          rainbowWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          imTokenWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          coinbaseWallet({
            appName: PROJECT_CONFIG.name,
            chains,
          }),
          walletConnectWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains
          }),
        ],
      },
    ]);

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
      webSocketPublicClient,
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
