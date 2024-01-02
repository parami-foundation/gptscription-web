import React, { useEffect } from 'react';
import styles from './style.less';
import { Button, ConfigProvider, InputNumber, Modal, theme } from 'antd';
import { useAccount, useContractRead, useDisconnect } from 'wagmi';
import { CONTRACT } from '@/constants/global';
import classNames from 'classnames';
import { formatEther } from 'viem';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { THEME_CONFIG } from '@/constants/theme';

const Select: React.FC<{
  powerValue: number;
  setPowerValue: (powerValue: number) => void;
}> = ({ powerValue, setPowerValue }) => {
  const [manualInput, setManualInput] = React.useState<number>(0);

  const getEthValue = (powerValue: number) => {
    const { data: ethValue }: {
      data?: bigint;
      isError: boolean;
      isLoading: boolean;
    } = useContractRead({
      address: `0x${CONTRACT.Optimism.MP}`,
      abi: require("@/abis/MP.json"),
      functionName: "getBuyPriceAfterFee",
      args: [powerValue],
    });

    return ethValue;
  };

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
          className={classNames(styles.selectModalContentItem, manualInput === 1 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(1);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(1) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            1 MP
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, manualInput === 10 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(10);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(10) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            10 MP
          </div>
        </div>
        <div
          className={classNames(styles.selectModalContentItem, manualInput === 100 && styles.selectModalContentItemSelected)}
          onClick={() => {
            setManualInput(100);
          }}
        >
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(100) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            100 MP
          </div>
        </div>
      </div>
      <div className={styles.selectModalContentItemFull}>
        <div className={styles.selectModalContentItemFullLeft}>
          <div className={styles.selectModalContentItemPrice}>
            {formatEther(getEthValue(manualInput) ?? 0n)} ETH
          </div>
          <div className={styles.selectModalContentItemPower}>
            {manualInput} Power
          </div>
        </div>
        <div className={styles.selectModalContentItemFullRight}>
          <div className={styles.selectModalContentItemFullControl}>
            <div
              className={styles.selectModalContentItemFullControlMinus}
              onClick={() => {
                if (manualInput > 0) {
                  setManualInput(manualInput - 1);
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
                value={manualInput}
                type="number"
                onChange={(e) => {
                  setManualInput(e!);
                }}
              />
            </div>
            <div
              className={styles.selectModalContentItemFullControlPlus}
              onClick={() => {
                if (manualInput < 100) {
                  setManualInput(manualInput + 1);
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
        <Button
          block
          type="primary"
          size="large"
          className={styles.selectModalContentItemButton}
          disabled={manualInput === 0}
          onClick={() => {
            setPowerValue(manualInput);
          }}
        >
          <span>Confirm Purchase</span>
        </Button>
      </ConfigProvider>
    </div>
  )
};

const Boost: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
  const [powerValue, setPowerValue] = React.useState<number>(0);
  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>(new Error(""));

  const { connector, address: connectAddress } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!visible) {
      setPowerValue(0);
      setPurchaseSuccessVisible(false);
      setPurchaseFailedVisible(false);
      setError(new Error(""));
    }
  }, [visible]);

  return (
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
          <w3m-account-button />
        </div>
      )}
      <Select
        powerValue={powerValue}
        setPowerValue={setPowerValue}
      />
    </Modal>
  )
};

export default Boost;
