import React, { useEffect } from "react";
import styles from '../style.less';
import { FaAngleRight } from "react-icons/fa";
import { useModel } from "@umijs/max";
import { useAccount, useBalance, useConnect } from "wagmi";
import { Button, ConfigProvider, notification, theme } from "antd";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { ReactComponent as WalletConnectIcon } from "@/assets/brand/walletconnect.svg";
import { THEME_CONFIG } from "@/constants/theme";

const ConnectWallet: React.FC = () => {
  const { wagmiInitialized } = useModel("useWagmi");
  const { address, setAddress } = useModel("useWallet");

  const { connector, isReconnecting } = useAccount();
  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect({
      onSuccess: (account) => {
        setAddress(account?.account);
      },
    });
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });
  const { open } = useWeb3Modal();

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
      if (!!address && (!balance || balance?.formatted == '0')) {
        notification.warning({
          key: 'connectWallet',
          message: 'Insufficient balance',
          description: 'Please make sure you have enough GPT in your wallet.',
        });
      }
    })();
  }, [balance, address]);

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
        {connectors.map((x) => {
          if (wagmiInitialized && !x.ready || x?.id !== 'walletConnect') {
            return null;
          };
          return (
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
              key={x.name}
            >
              <Button
                block
                type="primary"
                size="large"
                className={styles.loginModalContentItem}
                disabled={!x.ready || isReconnecting || connector?.id === x.id}
                onClick={() => {
                  if (x.id === 'walletConnect') {
                    open();
                  } else {
                    connect({ connector: x })
                  }
                }}
                key={x.name}
              >
                <div className={styles.loginModalContentItemLeft}>
                  {x?.id === 'walletConnect' && (
                    <WalletConnectIcon
                      className={styles.loginModalContentItemIcon}
                    />
                  )}
                  <div className={styles.loginModalContentItemText}>
                    {x.name}
                    {isLoading && x.id === pendingConnector?.id && '…'}
                  </div>
                </div>
                <div className={styles.loginModalContentItemRight}>
                  <FaAngleRight
                    className={styles.loginModalContentItemRightIcon}
                  />
                </div>
              </Button>
            </ConfigProvider>
          )
        })}
      </div>
    </>
  );
};

export default ConnectWallet;
