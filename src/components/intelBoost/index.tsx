import React, { useEffect } from "react";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, notification, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";
import { useModel } from "@umijs/max";
import { useAccount, useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import { CONTRACT, NETWORK_CONFIG } from "@/constants/global";
import { CreateTransaction, GetIntelBoostSign } from "@/services/api";
import PurchaseSuccess from "../purchase/success";
import PurchaseFailed from "../purchase/failed";

const IntelBoost: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | null;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  closeable?: boolean;
}> = ({ visible, setVisible, transactionHash, setTransactionHash, closeable }) => {
  const { accessToken } = useModel('useAccess');

  const [signature, setSignature] = React.useState<string>();
  const [nonce, setNonce] = React.useState<string>();

  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);

  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { chains, error: switchNetworkError, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: CONTRACT.Sepolia.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: 'intelBoost',
  });

  useEffect(() => {
    ; (async () => {
      if (!accessToken) return;
      const { response, data } = await GetIntelBoostSign(accessToken);
      if (response?.status === 200) {
        setSignature(data?.data?.sig);
        setNonce(data?.data?.nonce);
      } else {
        notification.error({
          key: "intelBoostSignError",
          message: "Intel Boost Sign Error",
          description: data?.error_description || data?.error || 'Unknown Error',
        });
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    ; (async () => {
      if (isSuccess && !!data?.hash && !!accessToken) {
        setPurchaseSuccessVisible(true);
        setTransactionHash(data?.hash);

        await CreateTransaction({
          chain_id: NETWORK_CONFIG?.chains[0]?.id?.toString(),
          address: address,
          hash: data?.hash,
        }, accessToken);
      }

      if (!!error) {
        setPurchaseFailedVisible(true);
      }
    })();
  }, [accessToken, data, isSuccess, error]);

  useEffect(() => {
    if (!!switchNetworkError) {
      notification.error({
        key: "switchNetworkError",
        message: "Switch Network Error",
        description: switchNetworkError?.message,
      });
    }
  }, [switchNetworkError]);

  return (
    <>
      <Modal
        centered
        title={null}
        footer={null}
        className={styles.boostModal}
        open={visible}
        onCancel={() => setVisible(false)}
        closable={closeable ?? true}
        maskClosable={closeable ?? true}
      >
        <div className={styles.boostModalContainer}>
          <div className={styles.boostModalHeader}>
            <div className={styles.boostModalHeaderIcon}>
              <img
                className={styles.boostModalHeaderIconImg}
                src={require("@/assets/icon/rocket.png")}
                alt="rocket"
              />
            </div>
            <div className={styles.boostModalHeaderTitle}>
              Intel Boost
            </div>
            <div className={styles.boostModalHeaderDescription}>
              All ethers received will be used to provide liquidity for $GPT after the minting process ends.
            </div>
          </div>
          <div className={styles.boostModalFooter}>
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
              {currentChain?.id !== chains[0]?.id ? (
                <Button
                  block
                  type="primary"
                  size="large"
                  className={styles.boostModalFooterButton}
                  loading={switchNetworkLoading && pendingChainId === chains[0]?.id}
                  onClick={() => {
                    switchNetwork?.(chains[0]?.id);
                  }}
                >
                  <span>Change Network</span>
                </Button>
              ) : (
                <Button
                  block
                  type="primary"
                  className={styles.boostModalFooterBtn}
                  loading={isLoading}
                  disabled={!signature || !nonce}
                  size="large"
                  onClick={async () => {
                    await write({
                      args: [
                        signature,
                        nonce,
                      ],
                    })
                  }}
                >
                  Intel Boost
                </Button>
              )}
            </ConfigProvider>
          </div>
        </div>
      </Modal>
      <PurchaseSuccess
        visible={purchaseSuccessVisible}
        setVisible={setPurchaseSuccessVisible}
        transactionHash={transactionHash}
      />
      <PurchaseFailed
        visible={purchaseFailedVisible}
        setVisible={setPurchaseFailedVisible}
        error={error as Error}
      />
    </>
  )
};

export default IntelBoost;
