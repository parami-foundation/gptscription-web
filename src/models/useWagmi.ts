import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  ALCHEMY_CONFIG,
  INFURA_CONFIG,
  NETWORK_CONFIG,
} from "@/constants/global";
import { WALLETCONNECT_CONFIG } from "@/constants/walletconnect";
import { useEffect, useState } from "react";
import { Config, configureChains, createConfig, PublicClient, WebSocketPublicClient } from 'wagmi';
import { FallbackTransport, createPublicClient, http } from "viem";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from 'wagmi/providers/public';
import { injectedWallet, metaMaskWallet, okxWallet, rainbowWallet, tokenPocketWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

export default () => {
  const [wagmiConfig, setWagmiConfig] =
    useState<
      Config<
        PublicClient<FallbackTransport>
      > | null
    >(null);
  const [wagmiChains, setWagmiChains] = useState<any>(null);
  const [wagmiInitialized, setWagmiInitialized] = useState<boolean>(false);

  useEffect(() => setWagmiInitialized(true), []);

  useEffect(() => {
    console.log("Initializing Wagmi");

    const { chains, publicClient } = configureChains(
      [...NETWORK_CONFIG.chains],
      [
        alchemyProvider({
          apiKey: ALCHEMY_CONFIG.Goerli,
        }),
        infuraProvider({
          apiKey: INFURA_CONFIG.apiKey,
        }),
        publicProvider()
      ]
    );
    setWagmiChains(chains);

    const connectors = connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet({ chains }),
          metaMaskWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          okxWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          rainbowWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          tokenPocketWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
          walletConnectWallet({
            projectId: WALLETCONNECT_CONFIG.projectId,
            chains,
          }),
        ],
      },
    ]);

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
