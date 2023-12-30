import React from 'react';
import styles from "./style.less";
import { ReactComponent as Background } from '@/assets/home/background.svg';
import { MdArrowOutward } from "react-icons/md";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeBackground}>
        <Background
          className={styles.homeBackgroundSvg}
        />
      </div>
      <div className={styles.homeWrapper}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerWrapper}>
            <div className={styles.bannerLeftLine} />
            <div className={styles.bannerContent}>
              <div className={styles.bannerTitle}>
                GPTMiner
              </div>
              <div className={styles.bannerSubTitle}>
                World's first<br />
                token inscribed<br />
                by GPT
              </div>
              <div className={styles.bannerButton}>
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
