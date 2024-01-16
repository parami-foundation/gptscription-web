import React from 'react';
import styles from "./style.less";
import { ReactComponent as Background } from '@/assets/home/background.svg';
import { ReactComponent as BackgroundMobile } from '@/assets/home/background_mobile.svg';
import { MdArrowOutward } from "react-icons/md";
import { GPT_CONFIG } from '@/constants/global';

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeBackground}>
        <Background
          className={styles.homeBackgroundSvg}
        />
        <BackgroundMobile
          className={styles.homeBackgroundMobileSvg}
        />
      </div>
      <div className={styles.homeWrapper}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerWrapper}>
            <div className={styles.bannerLeftLine} />
            <div className={styles.bannerContent}>
              <div className={styles.bannerTitle}>
                GPTScription
              </div>
              <div className={styles.bannerSubTitle}>
                World's first<br />
                token inscribed<br />
                by GPT
              </div>
              <div className={styles.bannerSubTitleMobile}>
                World's<br />
                first token<br />
                inscribed by<br />
                GPT
              </div>
              <div
                className={styles.bannerButton}
                onClick={() => {
                  window.open(GPT_CONFIG.url, "_blank");
                }}
              >
                <span>Start Now</span>
                <MdArrowOutward
                  className={styles.bannerButtonIcon}
                />
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
};

export default Home;
