import React from 'react';
import styles from './style.less';
import { Progress } from 'antd';
import { FaRocket } from 'react-icons/fa';
import Boost from '@/components/boost';

const MyToken: React.FC = () => {
  const [visible, setVisible] = React.useState<boolean>(false);

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
                      73.87%
                    </div>
                    <div className={styles.progressDescription}>
                      Currently mining
                    </div>
                    <div className={styles.progressToken}>
                      1MP
                    </div>
                  </div>
                )}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <div
                className={styles.boostButton}
                onClick={() => setVisible(true)}
              >
                <FaRocket
                  className={styles.boostIcon}
                />
                <span>Boost Minting Speed</span>
              </div>
              <div className={styles.shareButton}>
                <span>Share To Increase Minting Speed</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.myTokenContent}>
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
        </div>
      </div>
      <Boost
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  )
};

export default MyToken;
