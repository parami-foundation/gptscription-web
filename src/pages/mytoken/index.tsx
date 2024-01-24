import React, { useEffect } from 'react';
import styles from './style.less';
import { Progress, Tooltip, notification } from 'antd';
import { FaRocket } from 'react-icons/fa';
import Boost from '@/components/boost';
import Share from '@/components/share';
import { useAccount, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { CONTRACT, NETWORK_CONFIG } from '@/constants/global';
import { formatEther } from 'viem';
import { useModel } from '@umijs/max';
import LoginModal from '@/components/login';
import { GiCoinsPile } from "react-icons/gi";
import { CreateTransaction } from '@/services/api';
import PurchaseSuccess from '@/components/purchase/success';
import PurchaseFailed from '@/components/purchase/failed';

const MyToken: React.FC = () => {
  const { address, setAddress } = useModel('useWallet');
  const { accessToken } = useModel('useAccess');

  const [boostVisible, setBoostVisible] = React.useState<boolean>(false);
  const [shareVisible, setShareVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | null>(null);
  const [changeNetworkVisible, setChangeNetworkVisible] = React.useState<boolean>(false);
  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = React.useState<boolean>(false);
  const [purchaseFailedVisible, setPurchaseFailedVisible] = React.useState<boolean>(false);

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const { address: connectedAddress, isConnected } = useAccount({
    onConnect: (data) => {
      setAddress(data.address as `0x${string}`);
      localStorage.setItem('gptscription:address', data.address as string);
    },
    onDisconnect: () => {
      setAddress(null);
      localStorage.removeItem('gptscription:address');
    }
  });

  const getBalances: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: CONTRACT.Goerli.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: "balances",
    args: [address || connectedAddress],
  });

  const getEarned: {
    data?: bigint;
    isError: boolean;
    isLoading: boolean;
  } = useContractRead({
    address: CONTRACT.Goerli.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: "earned",
    args: [address || connectedAddress],
  });

  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: CONTRACT.Goerli.GPTscription as `0x${string}`,
    abi: require("@/abis/GPTscription.json"),
    functionName: 'getReward',
  });

  useEffect(() => {
    if (!!address && isConnected && currentChain?.id !== chains[0]?.id) {
      setChangeNetworkVisible(true);
    } else {
      setChangeNetworkVisible(false);
    }
  }, [connectedAddress, isConnected, currentChain, chains]);

  useEffect(() => {
    ; (async () => {
      if (isSuccess && !!data?.hash && !!accessToken) {
        setPurchaseSuccessVisible(true);
        setTransactionHash(data?.hash);

        await CreateTransaction({
          chain_id: NETWORK_CONFIG?.chains[0]?.id?.toString(),
          address: address || connectedAddress,
          hash: data?.hash,
        }, accessToken);
      }

      if (!!error) {
        setPurchaseFailedVisible(true);
      }
    })();
  }, [accessToken, data, isSuccess, error]);

  return (
    <div className={styles.myTokenContainer}>
      <div className={styles.myTokenWrapper}>
        <div className={styles.boostContainer}>
          <div className={styles.boostWrapper}>
            <div className={styles.progressContainer}>
              <Progress
                className={styles.progressBar}
                size={[300, 300]}
                strokeWidth={12}
                strokeColor={{
                  '0%': '#22D955',
                  '100%': '#000000',
                }}
                type="circle"
                gapPosition="top"
                percent={73.87}
                format={() => (
                  <div className={styles.progressContent}>
                    <div className={styles.progressValue}>
                      {Number(formatEther(getEarned?.data ?? 0n))?.toFixed(2) ?? 0}
                    </div>
                    <div className={styles.progressDescription}>
                      Currently mining
                    </div>
                    <div className={styles.progressToken}>
                      {Number(getBalances?.data ?? 0n)} MP
                    </div>
                  </div>
                )}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <div
                className={styles.boostButton}
                onClick={() => setBoostVisible(true)}
              >
                <FaRocket
                  className={styles.boostIcon}
                />
                <span>Boost Minting Speed</span>
              </div>
              <Tooltip
                placement="top"
                title="Coming Soon"
              >
                <div
                  className={styles.boostButton}
                // onClick={async () => {
                //   if (!isLoading) {
                //     write();
                //   }
                // }}
                >
                  <GiCoinsPile
                    className={styles.boostIcon}
                  />
                  <span>Claim GPTs</span>
                </div>
              </Tooltip>
              <div
                className={styles.shareButton}
                onClick={() => setShareVisible(true)}
              >
                <span>Share To Increase Minting Speed</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.myTokenContent}>
          <div className={styles.myTokenWrapper}>
            <div className={styles.myTokenTitle}>
              My Tokens
            </div>
            <div className={styles.myTokenList}>
              <div className={styles.myTokenListHeader}>
                <div className={styles.myTokenListHeaderItem}>
                  <span>Tokens</span>
                </div>
                <div className={styles.myTokenListHeaderItem}>
                  <span>Holders</span>
                </div>
                <div className={styles.myTokenListHeaderItem}>
                  <span>Pregress</span>
                </div>
                <div className={styles.myTokenListHeaderItem}>
                  <span>Operation</span>
                </div>
              </div>
              <div className={styles.myTokenListContent}>
                <div className={styles.myTokenListContentRow}>
                  <div className={styles.myTokenListContentItem}>
                    <span>Erc20</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <span>341</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <span>73.87%</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <div className={styles.myTokenListContentItemButton}>
                      <span>Claim</span>
                    </div>
                  </div>
                </div>
                <div className={styles.myTokenListContentRow}>
                  <div className={styles.myTokenListContentItem}>
                    <span>Erc20</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <span>341</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <span>73.87%</span>
                  </div>
                  <div className={styles.myTokenListContentItem}>
                    <div className={styles.myTokenListContentItemButton}>
                      <span>Claim</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <Boost
        visible={boostVisible}
        setVisible={setBoostVisible}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
      />
      <Share
        visible={shareVisible}
        setVisible={setShareVisible}
      />
      <LoginModal
        visible={changeNetworkVisible}
        setVisible={setChangeNetworkVisible}
        closeable={false}
      />
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
    </div>
  )
};

export default MyToken;
