import React, { useEffect } from 'react';
import styles from './style.less';
import { useModel, history } from '@umijs/max';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import queryString from 'query-string';
import LoginModal from "@/components/login";
import { notification } from "antd";
import { GPT_CONFIG } from '@/constants/global';
import Mine from '@/components/mine';
import Boost from '@/components/boost';
import { GetAddressByRef } from '@/services/api';

const Hub: React.FC = () => {
  const { signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { accessToken, setAccessToken, setAccessTokenExpire } = useModel('useAccess');

  const [mineModalVisible, setMineModalVisible] = React.useState<boolean>(false);
  const [boostModalVisible, setBoostModalVisible] = React.useState<boolean>(false);

  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | null>(null);
  const [referrer, setReferrer] = React.useState<string | null>(null);

  const [boostValue, setBoostValue] = React.useState<number>(0);

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const search = queryString.parse(window.location.search);

  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess } = useDisconnect();
  const { address: connectAddress, isConnected } = useAccount({
    onConnect: (data) => {
      setAddress(data.address as `0x${string}`);
      localStorage.setItem('gptminer:address', data.address as string);
    },
    onDisconnect: () => {
      setAddress(null);
      localStorage.removeItem('gptminer:address');
    }
  });

  useEffect(() => {
    disconnect();

    if (disconnectSuccess) {
      setAddress(null);
      localStorage.removeItem('gptminer:address');
    }

    if (disconnectError) {
      notification.error({
        key: 'disconnectError',
        message: 'Disconnect Wallet Error',
        description: disconnectError.message,
      });
    }
  }, [disconnectError, disconnectSuccess]);

  useEffect(() => {
    ; (async () => {
      const now = new Date().getTime();

      if (!!search?.access_token_expire && parseInt(search?.access_token_expire as string) * 1000 > now) {
        setAccessTokenExpire(parseInt(search?.access_token_expire as string) * 1000);
        localStorage.setItem('gptminer:accesstoken:expire', (parseInt(search?.access_token_expire as string) * 1000).toString());

        if (!!search?.access_token) {
          setAccessToken(search?.access_token as string);
          localStorage.setItem('gptminer:accesstoken', search?.access_token as string);
        }

        if (!!search?.referrer) {
          const { response, data } = await GetAddressByRef(search?.referrer as string, search?.access_token as string);
          if (response?.status === 200 && !!data?.data) {
            setReferrer(data?.data);
          }
        }
      } else {
        notification.error({
          key: 'accessTokenError',
          message: 'Access Token Error',
          description: 'Please check the access token expire in the URL.',
          duration: 0,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!!search?.action) {
      setWalletModalVisible(true);
      switch (search?.action) {
        case "bind":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            window.location.href = `${GPT_CONFIG.url}`;
          }
          break;

        case "mine":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setMineModalVisible(true);
            if (!!transactionHash) {
              window.location.href = `${GPT_CONFIG.url}`;
            }
          } else {
            setWalletModalVisible(true);
            setMineModalVisible(false);
          }
          break;

        case "boost":
          !!search?.value && setBoostValue(parseInt(search?.value as string));
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setBoostModalVisible(true);
            if (!!transactionHash) {
              window.location.href = `${GPT_CONFIG.url}`;
            }
          } else {
            setWalletModalVisible(true);
            setBoostModalVisible(false);
          }
          break;

        default:
          notification.error({
            key: 'actionError',
            message: 'Action Error',
            description: 'Please check the action in the URL.',
            duration: 0,
          });
      }
    } else {
      notification.error({
        key: 'actionError',
        message: 'Action Error',
        description: 'Please check the action in the URL.',
        duration: 0,
      });
    }
  }, [connectAddress, currentChain, transactionHash, signature, walletBinded, isConnected]);

  return (
    <div className={styles.hubContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Logo />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer}>
          <img
            className={styles.icon}
            src={require('@/assets/icon/clock.png')}
            alt="clock"
          />
        </div>
        <div className={styles.textContainer}>
          Minting Will Start Soon...
        </div>
      </div>
      {!!accessToken && (
        <>
          <LoginModal
            visible={true}
            setVisible={setWalletModalVisible}
            closeable={false}
          />
          <Mine
            visible={mineModalVisible}
            setVisible={setMineModalVisible}
            transactionHash={transactionHash}
            setTransactionHash={setTransactionHash}
            closeable={false}
            referrer={referrer}
          />
          <Boost
            visible={boostModalVisible}
            setVisible={setBoostModalVisible}
            transactionHash={transactionHash}
            setTransactionHash={setTransactionHash}
            closeable={false}
            value={boostValue}
          />
        </>
      )}
    </div>
  )
};

export default Hub;
