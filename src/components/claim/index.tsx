import React, { useEffect } from 'react';
import styles from './style.less';
import { Button, ConfigProvider, Modal, notification, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { CONTRACT, NETWORK_CONFIG } from '@/constants/global';
import { CreateTransaction } from '@/services/api';
import { useModel } from '@umijs/max';
import PurchaseSuccess from '../purchase/success';
import PurchaseFailed from '../purchase/failed';

const Claim: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | null;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  closeable?: boolean;
}> = ({ visible, setVisible, transactionHash, setTransactionHash, closeable }) => {
  const { accessToken } = useModel('useAccess');

  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);

  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { chains, error: switchNetworkError, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: CONTRACT.Goerli.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: 'getReward',
  });

  const getEarned: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: CONTRACT.Goerli.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: "earned",
    args: [address],
  });

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
        className={styles.claimModal}
        open={visible}
        onCancel={() => setVisible(false)}
        closable={closeable ?? true}
        maskClosable={closeable ?? true}
      >
        <div className={styles.claimModalContainer}>
          <div className={styles.claimModalHeader}>
            <div className={styles.claimModalHeaderIcon}>
              <img
                className={styles.claimModalHeaderIconImg}
                src={require("@/assets/icon/mine.png")}
                alt="mine"
              />
            </div>
            <div className={styles.claimModalHeaderTitle}>
              Claim Your GPTs
            </div>
            <div className={styles.claimModalHeaderDescription}>
              1 GPTs
            </div>
          </div>
          <div className={styles.claimModalFooter}>
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
                  className={styles.claimModalFooterButton}
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
                  className={styles.claimModalFooterBtn}
                  loading={isLoading}
                  size="large"
                  onClick={async () => {
                    await write()
                  }}
                >
                  Claim
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

export default Claim;
