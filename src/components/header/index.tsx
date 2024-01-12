import React, { useEffect } from "react";
import styles from "./style.less";
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { IoClose, IoMenu, IoWalletOutline } from 'react-icons/io5';
import { useLocation, history } from "@umijs/max";
import { useAccount } from "wagmi";
import classNames from "classnames";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header: React.FC = () => {
  const [menu, setMenu] = React.useState<string>('');
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  const location = useLocation();
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
          <div
            className={styles.navWrapper}
            style={{
              height: menuOpen ? '100%' : '0px',
            }}
          >
            <div
              className={classNames(styles.navItem, menu === '' && styles.navItemActive)}
              onClick={() => {
                history.push('/');
              }}
            >
              Home
            </div>
            <div
              className={classNames(styles.navItem, menu === 'mytoken' && styles.navItemActive)}
              onClick={() => {
                history.push('/mytoken');
              }}
            >
              My Token
            </div>
          </div>

          <div className={styles.connectWallet}>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <div
                            className={styles.connectWalletBtn}
                            onClick={() => openConnectModal()}
                          >
                            <IoWalletOutline
                              className={styles.connectWalletBtnIcon}
                            />
                            <span>
                              Connect Wallet
                            </span>
                          </div>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <div
                            className={styles.connectWalletBtn}
                            onClick={() => openChainModal()}
                          >
                            <IoWalletOutline
                              className={styles.connectWalletBtnIcon}
                            />
                            <span>
                              Wrong network
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          className={styles.connectWalletBtn}
                          onClick={() => openAccountModal()}
                        >
                          <IoWalletOutline
                            className={styles.connectWalletBtnIcon}
                          />
                          <span>
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          <div className={styles.mobileMenu}>
            {menuOpen ? (
              <IoClose
                className={styles.mobileMenuIcon}
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <IoMenu
                className={styles.mobileMenuIcon}
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Header;
