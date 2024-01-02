import { Outlet, useModel } from "@umijs/max";
import styles from "./style.less";
import { ConfigProvider, theme } from 'antd';
import { THEME_CONFIG } from "@/constants/theme";
import { WagmiConfig } from "wagmi";
import Header from "@/components/header";

const Layout: React.FC = () => {
  const { wagmiConfig } = useModel('useWagmi');

  return (
    <>
      {!!wagmiConfig && (
        <WagmiConfig
          config={wagmiConfig}
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
        </WagmiConfig>
      )}
    </>
  )
};

export default Layout;
