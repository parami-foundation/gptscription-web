import React from 'react';
import styles from './style.less';
import { Button, ConfigProvider, Modal, theme } from 'antd';
import { THEME_CONFIG } from '@/constants/theme';

const Secret: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  closeable?: boolean;
}> = ({ visible, setVisible, closeable }) => {
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
                className={styles.claimModalFooterButton}
                onClick={() => {
                }}
              >
                <span></span>
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </Modal>
    </>
  )
};

export default Secret;
