import React, { useEffect } from "react";
import styles from '../style.less';
import { FaAngleRight } from "react-icons/fa";
import { useModel } from "@umijs/max";
import { useAccount, useBalance, useConnect } from "wagmi";
import { Button, ConfigProvider, notification, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoWalletOutline } from "react-icons/io5";

const ConnectWallet: React.FC = () => {
  const { address, setAddress } = useModel("useWallet");

  const { isConnected } = useAccount();
  const { isLoading, error, pendingConnector } =
    useConnect({
      onSuccess: (account) => {
        setAddress(account?.account);
      },
    });
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });

  useEffect(() => {
    if (error) {
      notification.error({
        key: 'connectWallet',
        message: 'Connect wallet failed',
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    ; (async () => {
      if (isConnected && !!address && (!balance || balance?.formatted == '0')) {
        notification.warning({
          key: 'connectWallet',
          message: 'Insufficient balance',
          description: 'Please make sure you have enough GPT in your wallet.',
        });
      }
    })();
  }, [balance, address, isConnected]);

  return (
    <>
      <div className={styles.loginModalHeader}>
        <div className={styles.loginModalHeaderIcon}>
          <img
            className={styles.loginModalHeaderIconImg}
            src={require("@/assets/icon/wallet.png")}
            alt="icon"
          />
        </div>
        <div className={styles.loginModalHeaderTitle}>
          Log in with wallet
        </div>
      </div>
      <div className={styles.loginModalContent}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              wireframe: false,
              colorPrimary: THEME_CONFIG.colorSecondary,
              borderRadius: THEME_CONFIG.borderRadius,
              boxShadow: THEME_CONFIG.boxShadow,
            },
          }}
        >
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <Button
                  block
                  type="primary"
                  size="large"
                  className={styles.loginModalContentItem}
                  onClick={() => openConnectModal()}
                >
                  <div className={styles.loginModalContentItemLeft}>
                    <IoWalletOutline
                      className={styles.loginModalContentItemIcon}
                    />
                    <div className={styles.loginModalContentItemText}>
                      Connect Wallet
                    </div>
                  </div>
                  <div className={styles.loginModalContentItemRight}>
                    <FaAngleRight
                      className={styles.loginModalContentItemRightIcon}
                    />
                  </div>
                </Button>
              );
            }}
          </ConnectButton.Custom>
        </ConfigProvider>
      </div>
    </>
  );
};

export default ConnectWallet;
