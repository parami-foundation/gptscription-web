import React, { useEffect } from 'react';
import styles from './style.less';
import { useModel } from '@umijs/max';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import queryString from 'query-string';
import LoginModal from "@/components/login";
import { notification } from "antd";
import { GPT_CONFIG } from '@/constants/global';
import Mine from '@/components/mine';

const Bridge: React.FC = () => {
  const { signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { accessToken, setAccessToken, setAccessTokenExpire } = useModel('useAccess');

  const [mineModalVisible, setMineModalVisible] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<`0x${string}` | undefined>();
  const [referrer, setReferrer] = React.useState<string | undefined>();

  const { chain: currentChain } = useNetwork();
  const { chains } = useSwitchNetwork();

  const search = queryString.parse(window.location.search);

  const { disconnect, error: disconnectError, isSuccess: disconnectSuccess } = useDisconnect();
  const { address: connectAddress, isConnected } = useAccount({
    onConnect: (data) => {
      setAddress(data.address);
      localStorage.setItem('aime:address', data.address as string);
    },
    onDisconnect: () => {
      setAddress(undefined);
      localStorage.removeItem('aime:address');
    }
  });

  useEffect(() => {
    disconnect();

    if (disconnectSuccess) {
      setAddress(undefined);
      localStorage.removeItem('aime:address');
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
    const now = new Date().getTime();

    if (!!search?.access_token_expire && parseInt(search?.access_token_expire as string) > now) {
      setAccessTokenExpire(parseInt(search?.access_token_expire as string));
      localStorage.setItem('gptminer:accessToken:expire', search?.access_token_expire as string);

      if (!!search?.access_token) {
        setAccessToken(search?.access_token as string);
        localStorage.setItem('gptminer:accessToken', search?.access_token as string);
      }

      if (!!search?.referrer) {
        setReferrer(search?.referrer as string);
      }
    } else {
      notification.error({
        key: 'accessTokenError',
        message: 'Access Token Error',
        description: 'Please check the access token in the URL.',
        duration: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (!!search?.action) {
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
  }, [connectAddress, currentChain, signature, walletBinded, transactionHash]);

  return (
    <div className={styles.bridgeContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Logo />
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
          />
        </>
      )}
      <Mine
        visible={mineModalVisible}
        setVisible={setMineModalVisible}
        transactionHash={transactionHash}
        setTransactionHash={setTransactionHash}
        closeable={false}
        referrer={referrer}
      />
    </div>
  )
};

export default Bridge;
