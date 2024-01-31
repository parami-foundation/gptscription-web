import React, { useEffect } from 'react';
import styles from './style.less';
import { useModel } from '@umijs/max';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import queryString from 'query-string';
import LoginModal from "@/components/login";
import { notification } from "antd";
import Mine from '@/components/mine';
import Boost from '@/components/boost';
import { GetAddressByRef } from '@/services/api';
import { Resp } from '@/types';
import Claim from '@/components/claim';
import Secret from '@/components/secret';
import IntelBoost from '@/components/intelBoost';

const Hub: React.FC = () => {
  const { signature, walletBinded, setWalletModalVisible, setAddress } = useModel('useWallet');
  const { accessToken, setAccessToken, setAccessTokenExpire } = useModel('useAccess');

  const [mineModalVisible, setMineModalVisible] = React.useState<boolean>(false);
  const [boostModalVisible, setBoostModalVisible] = React.useState<boolean>(false);
  const [claimModalVisible, setClaimModalVisible] = React.useState<boolean>(false);
  const [secretModalVisible, setSecretModalVisible] = React.useState<boolean>(false);
  const [intelBoostModalVisible, setIntelBoostModalVisible] = React.useState<boolean>(false);

  const [secretMode, setSecretMode] = React.useState<"bind" | "mine" | "boost" | "claim" | "intelBoost">();

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
      localStorage.setItem('gptscription:address', data.address as string);
    },
    onDisconnect: () => {
      setAddress(null);
      localStorage.removeItem('gptscription:address');
    }
  });

  useEffect(() => {
    disconnect();

    if (disconnectSuccess) {
      setAddress(null);
      localStorage.removeItem('gptscription:address');
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
        localStorage.setItem('gptscription:accesstoken:expire', (parseInt(search?.access_token_expire as string) * 1000).toString());

        if (!!search?.access_token) {
          setAccessToken(search?.access_token as string);
          localStorage.setItem('gptscription:accesstoken', search?.access_token as string);
        }

        const { response, data } = await GetAddressByRef(search?.access_token as string);
        if (response?.status === 200 && !!data?.data) {
          setReferrer(data?.data);
        } else {
          notification.error({
            key: 'referrerError',
            message: 'Referrer Error',
            description: (data as Resp.Error)?.msg || 'Please check the referrer in the URL.',
            duration: 0,
          });
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
            setSecretMode("bind");
            setSecretModalVisible(true);
          }
          break;

        case "mine":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setMineModalVisible(true);
            if (!!transactionHash) {
              setSecretMode("mine");
              setSecretModalVisible(true);
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
              setSecretMode("boost");
              setSecretModalVisible(true);
            }
          } else {
            setWalletModalVisible(true);
            setBoostModalVisible(false);
          }
          break;

        case "claim":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setClaimModalVisible(true);
            if (!!transactionHash) {
              setSecretMode("claim");
              setSecretModalVisible(true);
            }
          } else {
            setWalletModalVisible(true);
            setClaimModalVisible(false);
          }
          break;

        case "intelBoost":
          if (!!connectAddress && isConnected && currentChain?.id === chains[0]?.id && (!!signature || walletBinded)) {
            setIntelBoostModalVisible(true);
            if (!!transactionHash) {
              setSecretMode("intelBoost");
              setSecretModalVisible(true);
            }
          } else {
            setWalletModalVisible(true);
            setIntelBoostModalVisible(false);
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
          <Claim
            visible={claimModalVisible}
            setVisible={setClaimModalVisible}
            transactionHash={transactionHash}
            setTransactionHash={setTransactionHash}
            closeable={false}
          />
          <Secret
            visible={secretModalVisible}
            setVisible={setSecretModalVisible}
            mode={secretMode}
            closeable={false}
          />
          <IntelBoost
            visible={intelBoostModalVisible}
            setVisible={setIntelBoostModalVisible}
            transactionHash={transactionHash}
            setTransactionHash={setTransactionHash}
            closeable={false}
          />
        </>
      )}
    </div>
  )
};

export default Hub;
