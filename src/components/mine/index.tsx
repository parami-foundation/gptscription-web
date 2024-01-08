import React, { useEffect } from "react";
import styles from "./style.less";
import { useModel } from "@umijs/max";
import { useAccount, useBalance, useContractRead, useContractWrite, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { CONTRACT, DEBUG, DEFAULT_REFERRER, NETWORK_CONFIG } from "@/constants/global";
import { Button, ConfigProvider, Modal, notification, theme } from "antd";
import { CreateTransaction } from "@/services/api";
import { THEME_CONFIG } from "@/constants/theme";
import PurchaseSuccess from "../purchase/success";
import PurchaseFailed from "../purchase/failed";
import { formatEther } from "viem";

const Detail: React.FC<{
  setPurchaseSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPurchaseFailedVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  referrer?: string | null;
}> = ({ setPurchaseSuccessVisible, setPurchaseFailedVisible, setError, setTransactionHash, referrer }) => {
  const { accessToken } = useModel("useAccess");
  const { publicClient } = useModel("useWagmi");
  const { txSignature } = useModel("useWallet");

  const [gas, setGas] = React.useState<bigint>(0n);

  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { chain: currentChain } = useNetwork();
  const { chains, error: switchNetworkError, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: CONTRACT.Goerli.GPTMiner as `0x${string}`,
    abi: require("@/abis/GPTMiner.json"),
    functionName: 'mine',
  });

  useEffect(() => {
    (async () => {
      const gas = await publicClient?.estimateContractGas({
        address: CONTRACT.Goerli.GPTMiner as `0x${string}`,
        abi: require("@/abis/GPTMiner.json"),
        functionName: 'mine',
        args: [
          referrer ? referrer : DEFAULT_REFERRER,
          txSignature,
        ],
        account: address as `0x${string}`,
      });
      setGas(gas ?? 0n);
    })();
  }, [publicClient]);

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
        setError(error);
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
    <div className={styles.detailModalContainer}>
      <div className={styles.detailModalHeader}>
        <div className={styles.detailModalHeaderIcon}>
          <img
            className={styles.detailModalHeaderIconImg}
            src={require("@/assets/icon/mine.png")}
            alt="mine"
          />
        </div>
        <div className={styles.detailModalHeaderTitle}>
          Mine The Future Wealth!
        </div>
        <div className={styles.detailModalHeaderDescription}>
          Unleash your computing power.
        </div>
      </div>
      <div className={styles.detailModalFooter}>
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
              className={styles.detailModalFooterButton}
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
              className={styles.detailModalFooterBtn}
              loading={isLoading}
              size="large"
              disabled={parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther(gas))}
              onClick={async () => {
                await write({
                  args: [
                    referrer ? referrer : DEFAULT_REFERRER,
                    txSignature,
                  ],
                })
              }}
            >
              {(parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther(gas))) ? (
                <span>Insufficient Balance</span>
              ) : (
                <span>Start Mining Now</span>
              )}
            </Button>
          )}
        </ConfigProvider>
      </div>
    </div>
  )
};

const Mine: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | null;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  closeable?: boolean;
  referrer?: string | null;
}> = ({ visible, setVisible, transactionHash, setTransactionHash, closeable, referrer }) => {
  const { bindedAddress } = useModel("useWallet");

  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>(new Error(""));

  const { connector, address: connectAddress } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!visible) {
      setPurchaseSuccessVisible(false);
      setPurchaseFailedVisible(false);
      setError(new Error(""));
      setTransactionHash(null);
    }
  }, [visible]);

  useEffect(() => {
    DEBUG && console.log("bindedAddress", bindedAddress);
    DEBUG && console.log("connectAddress", connectAddress);
    if (!!bindedAddress && !!connectAddress && bindedAddress !== connectAddress) {
      notification.error({
        key: 'walletError',
        message: 'Wallet Error',
        description: `Please use the wallet you binded. And please make sure you are on the right network. ${NETWORK_CONFIG?.chains[0]?.name} is required.`
      });
      disconnect();
      setVisible(false);
    }
  }, [bindedAddress, connectAddress]);

  return (
    <>
      <Modal
        centered
        title={null}
        footer={null}
        className={styles.mineModal}
        open={visible}
        onCancel={() => setVisible(false)}
        closable={closeable ?? true}
        maskClosable={closeable ?? true}
      >
        {connector?.id === 'walletConnect' && (
          <div className={styles.walletConnectAccount}>
            <w3m-account-button />
          </div>
        )}
        <Detail
          setPurchaseSuccessVisible={setPurchaseSuccessVisible}
          setPurchaseFailedVisible={setPurchaseFailedVisible}
          setError={setError}
          setTransactionHash={setTransactionHash}
          referrer={referrer}
        />
      </Modal>
      <PurchaseSuccess
        visible={purchaseSuccessVisible}
        setVisible={setPurchaseSuccessVisible}
        transactionHash={transactionHash}
      />
      <PurchaseFailed
        visible={purchaseFailedVisible}
        setVisible={setPurchaseFailedVisible}
        error={error}
      />
    </>
  )
};

export default Mine;
