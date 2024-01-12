import { Outlet, useModel } from "@umijs/max";
import styles from "./style.less";
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from "@/constants/theme";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import Header from "@/components/header";

const Layout: React.FC = () => {
  const { wagmiConfig, wagmiChains } = useModel('useWagmi');

  return (
    <>
      {!!wagmiConfig && (
        <WagmiConfig
          config={wagmiConfig}
        >
          <RainbowKitProvider
            chains={wagmiChains}
            theme={darkTheme()}
          >
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  wireframe: false,
                  colorPrimary: THEME_CONFIG.colorPrimary,
                  borderRadius: THEME_CONFIG.borderRadius,
                  boxShadow: THEME_CONFIG.boxShadow,
                },
              }}
            >
              <div className={styles.layoutContainer}>
                <div className={styles.wrapperContainer}>
                  <Header />
                  <Outlet />
                </div>
              </div>
            </ConfigProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
  )
};

export default Layout;
