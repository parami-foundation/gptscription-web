import React from 'react';
import styles from './style.less';
import { Button, ConfigProvider, Modal, message, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';
import { DEFAULT_BIND_SECRET, DEFAULT_BOOST_SECRET, DEFAULT_CLAIM_SECRET, DEFAULT_INTELBOOST_SECRET, DEFAULT_MINE_SECRET } from '@/constants/global';

const Secret: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode?: 'bind' | 'mine' | 'boost' | 'claim' | 'intelBoost';
  closeable?: boolean;
}> = ({ visible, setVisible, mode, closeable }) => {
  return (
    <>
      <Modal
        centered
        title={null}
        footer={null}
        className={styles.secretModal}
        open={visible}
        onCancel={() => setVisible(false)}
        closable={closeable ?? true}
        maskClosable={closeable ?? true}
      >
        <div className={styles.secretModalContainer}>
          <div className={styles.secretModalHeader}>
            <div className={styles.secretModalHeaderIcon}>
              <img
                className={styles.secretModalHeaderIconImg}
                src={require('@/assets/icon/success.png')}
                alt="success"
              />
            </div>
            <div className={styles.secretModalHeaderTitle}>
              This is your secret
            </div>
            <div className={styles.secretModalHeaderDescription}>
              Copy it and go back to ChatGPT, paste it in the input box and click "Submit".
            </div>
          </div>
          <div className={styles.secretModalFooter}>
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
                type="dashed"
                size="large"
                className={styles.secretModalFooterBtn}
                onClick={() => {
                  navigator.clipboard.writeText(DEFAULT_MINE_SECRET);
                  message.success('Copied to clipboard');
                }}
              >
                {mode === 'bind' && (<span>{DEFAULT_BIND_SECRET}</span>)}
                {mode === 'mine' && (<span>{DEFAULT_MINE_SECRET}</span>)}
                {mode === 'boost' && (<span>{DEFAULT_BOOST_SECRET}</span>)}
                {mode === 'claim' && (<span>{DEFAULT_CLAIM_SECRET}</span>)}
                {mode === 'intelBoost' && (<span>{DEFAULT_INTELBOOST_SECRET}</span>)}
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </Modal>
    </>
  )
};

export default Secret;
