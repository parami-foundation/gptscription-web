import React, { useEffect } from "react";
import styles from "../style.less";
import { Button, ConfigProvider, notification, theme } from "antd";
import { ReactComponent as StampIcon } from '@/assets/icon/stamp.svg';
import { FaAngleRight } from "react-icons/fa";
import { THEME_CONFIG } from "@/constants/theme";
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';
import { useModel } from "@umijs/max";

const SignMessage: React.FC = () => {
  const { accessToken } = useModel('useAccess');
  const { nonce, message, setSignature, setWalletBinded, getBindWalletNonce, bindWallet } = useModel('useWallet');

  const [recoveredAddress, setRecoveredAddress] = React.useState<string>();

  const { address: connectAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    data,
    variables,
    error,
    isLoading,
    signMessage,
  } = useSignMessage({
    message,
  });

  useEffect(() => {
    ; (async () => {
      if (!!data && !!nonce && !!connectAddress && !!accessToken) {
        const bindResult = await bindWallet({
          nonce,
          address: connectAddress,
          signature: data,
          accessToken,
        });
        if (!bindResult) {
          setWalletBinded(true);
        } else {
          notification.error({
            key: 'bindWalletError',
            message: 'Bind wallet failed',
            description: bindResult?.error_description,
          });
        }
      }
    })();
  }, [data, nonce, connectAddress, accessToken]);

  useEffect(() => {
    ; (async () => {
      if (variables?.message && data) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: data,
        })
        setRecoveredAddress(recoveredAddress);
        setSignature(data);
      }
    })();
  }, [data, variables?.message]);

  useEffect(() => {
    ; (async () => {
      if (!accessToken || !connectAddress) return;
      const { error } = await getBindWalletNonce({
        address: connectAddress,
        accessToken,
      });
      if (!!error) {
        disconnect();
      }
    })()
  }, [connectAddress, accessToken]);

  useEffect(() => {
    if (!!error) {
      notification.error({
        key: 'signMessageError',
        message: 'Sign message failed',
        description: error.message,
      });
    }
  }, [error]);

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
          Need to verify your wallet
        </div>
        <div className={styles.loginModalHeaderDescription}>
          Please sign the message with your wallet
        </div>
      </div>
      <div className={styles.loginModalContent}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              wireframe: false,
              colorPrimary: THEME_CONFIG.colorGray,
              borderRadius: THEME_CONFIG.borderRadius,
              boxShadow: THEME_CONFIG.boxShadow,
            },
          }}
        >
          <Button
            block
            type="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading || !message}
            className={styles.loginModalContentItem}
            onClick={async () => {
              await signMessage();
            }}
          >
            <div className={styles.loginModalContentItemLeft}>
              <StampIcon
                className={styles.loginModalContentItemIcon}
              />
              <div className={styles.loginModalContentItemText}>
                {(isLoading || !message) ? 'Check Wallet' : 'Sign Message'}
              </div>
            </div>
            <div className={styles.loginModalContentItemRight}>
              <FaAngleRight
                className={styles.loginModalContentItemRightIcon}
              />
            </div>
          </Button>
        </ConfigProvider>
      </div>
    </>
  )
};

export default SignMessage;
