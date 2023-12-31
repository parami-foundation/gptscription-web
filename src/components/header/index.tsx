import React, { useEffect } from "react";
import styles from "./style.less";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { IoWalletOutline } from 'react-icons/io5';
import { useLocation } from "@umijs/max";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const [menu, setMenu] = React.useState<string>('');

  const location = useLocation();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const key = location.pathname.split('/')[1];
    setMenu(key);
  }, [location]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerLogo}>
          <Logo
            className={styles.headerLogoSvg}
          />
        </div>
        <div className={styles.navContainer}>
          {/* <div className={styles.navWrapper}>
            <div
              className={styles.navItem}
            >
              My Token
            </div>
          </div> */}
          <div className={styles.connectWallet}>
            <div
              className={styles.connectWalletBtn}
              onClick={() => open()}
            >
              <IoWalletOutline
                className={styles.connectWalletBtnIcon}
              />
              <span>
                {isConnected && address ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Header;
