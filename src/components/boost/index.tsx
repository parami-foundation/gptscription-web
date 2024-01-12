import React, { useEffect } from 'react';
import styles from './style.less';
import { Button, ConfigProvider, InputNumber, Modal, notification, theme } from 'antd';
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { CONTRACT, NETWORK_CONFIG } from '@/constants/global';
import classNames from 'classnames';
import { formatEther } from 'viem';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { THEME_CONFIG } from '@/constants/theme';
import PurchaseSuccess from '../purchase/success';
import PurchaseFailed from '../purchase/failed';
import { useModel } from '@umijs/max';
import { CreateTransaction } from '@/services/api';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Select: React.FC<{
  powerValue: number;
  setPowerValue: (powerValue: number) => void;
  setPurchaseSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPurchaseFailedVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  setBoostModalVisible: (visible: boolean) => void;
}> = ({ powerValue, setPowerValue, setPurchaseSuccessVisible, setPurchaseFailedVisible, setError, setTransactionHash, setBoostModalVisible }) => {
  const { accessToken } = useModel("useAccess");
  const { publicClient } = useModel("useWagmi");

  const [gas, setGas] = React.useState<bigint>(0n);

  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { chain: currentChain } = useNetwork();
  const { chains, error: switchNetworkError, isLoading: switchNetworkLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const getBoostUnit: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: CONTRACT.Goerli.GPTMiner as `0x${string}`,
    abi: require("@/abis/GPTMiner.json"),
    functionName: "boostUnit",
  });

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: CONTRACT.Goerli.GPTMiner as `0x${string}`,
    abi: require("@/abis/GPTMiner.json"),
    functionName: 'boost',
  });

  useEffect(() => {
    if (!powerValue) return;
    (async () => {
      const gas = await publicClient?.estimateContractGas({
        address: CONTRACT.Goerli.GPTMiner as `0x${string}`,
        abi: require("@/abis/GPTMiner.json"),
        functionName: 'boost',
        args: [],
        account: address as `0x${string}`,
        value: (getBoostUnit?.data ?? 0n) * BigInt(powerValue),
      });
      setGas(gas ?? 0n);
    })();
  }, [publicClient, powerValue]);

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

      if (!!switchNetworkError) {
        notification.error({
          key: 'switchNetworkError',
          message: 'Switch Network Error',
          description: `Please make sure you are on the right network. ${NETWORK_CONFIG?.chains[0]?.name} is required.`
        });
      }
    })();
  }, [accessToken, data, isSuccess, error, switchNetworkError]);

  return (
    <div className={styles.selectModalContainer}>
      <div className={styles.selectModalHeader}>
        <div className={styles.selectModalHeaderIcon}>
          <img
            className={styles.selectModalHeaderIconImg}
            src={require("@/assets/icon/rocket.png")}
            alt="rocket"
          />
        </div>
        <div className={styles.selectModalHeaderTitle}>
          Boost Minting Speed
        </div>
        <div className={styles.selectModalHeaderDescription}>
          All ethers received will be used to provide liquidity for $GPT after the minting process ends.
        </div>
      </div>
      <div className={styles.selectModalContent}>
        <div
          className={classNames(styles.selectModalContentItem, powerValue === 1 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setPowerValue(1);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther((getBoostUnit?.data ?? 0n) * BigInt(1))} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            1 MP
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, powerValue === 10 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setPowerValue(10);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther((getBoostUnit?.data ?? 0n) * BigInt(10))} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            10 MP
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, powerValue === 100 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setPowerValue(100);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther((getBoostUnit?.data ?? 0n) * BigInt(100))} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            100 MP
          </div>
        </div>
      </div>
      <div className={styles.selectModalContentItemFull}>
        <div className={styles.selectModalContentItemFullLeft}>
          <div className={styles.selectModalContentItemPrice}>
            {formatEther((getBoostUnit?.data ?? 0n) * BigInt(powerValue))} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            {powerValue} Power
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullControl}>
            <div
              className={styles.selectModalContentItemFullControlMinus}
              onClick={() => {
                if (powerValue > 0) {
                  setPowerValue(powerValue - 1);
                }
              }}
            >
              <AiOutlineMinus />
            </div>
            <div className={styles.selectModalContentItemFullControlNumber}>
              <InputNumber
                className={styles.selectModalContentItemFullControlNumberInput}
                bordered={false}
                controls={false}
                min={0}
                max={100}
                defaultValue={0}
                value={powerValue}
                type="number"
                onChange={(e) => {
                  setPowerValue(e!);
                }}
              />
            </div>
            <div
              className={styles.selectModalContentItemFullControlPlus}
              onClick={() => {
                if (powerValue < 100) {
                  setPowerValue(powerValue + 1);
                }
              }}
            >
              <AiOutlinePlus />
            </div>
          </div>
        </div>
      </div>
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
            className={styles.selectModalContentItemButton}
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
            size="large"
            className={styles.selectModalContentItemButton}
            loading={isLoading}
            disabled={!powerValue || parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther((getBoostUnit?.data ?? 0n) * BigInt(powerValue) + gas))}
            onClick={() => {
              write({
                value: (getBoostUnit?.data ?? 0n) * BigInt(powerValue) + gas,
              })
            }}
          >
            {(parseFloat(balance?.formatted ?? "0") === 0 || parseFloat(balance?.formatted ?? "0") < parseFloat(formatEther((getBoostUnit?.data ?? 0n) * BigInt(powerValue) ?? 0n + gas))) ? (
              <span>Insufficient Balance</span>
            ) : (
              <span>Confirm Purchase</span>
            )}
          </Button>
        )}
      </ConfigProvider>
    </div>
  )
};

const Boost: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | null;
  setTransactionHash: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
  closeable?: boolean;
}> = ({ visible, setVisible, transactionHash, setTransactionHash, closeable }) => {
  const [powerValue, setPowerValue] = React.useState<number>(0);
  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>(new Error(""));

  const { connector } = useAccount();

  useEffect(() => {
    if (!visible) {
      setPowerValue(0);
      setPurchaseSuccessVisible(false);
      setPurchaseFailedVisible(false);
      setError(new Error(""));
      setTransactionHash(null);
    }
  }, [visible]);

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
        {connector?.id === 'walletConnect' && (
          <div className={styles.walletConnectAccount}>
            <ConnectButton
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        )}
        <Select
          powerValue={powerValue}
          setPowerValue={setPowerValue}
          setPurchaseSuccessVisible={setPurchaseSuccessVisible}
          setPurchaseFailedVisible={setPurchaseFailedVisible}
          setError={setError}
          setTransactionHash={setTransactionHash}
          setBoostModalVisible={setVisible}
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

export default Boost;
