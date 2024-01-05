import React from "react";
import styles from "./style.less";
import { Button, ConfigProvider, Modal, theme } from "antd";
import { THEME_CONFIG } from "@/constants/theme";

const PurchaseSuccess: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  transactionHash: `0x${string}` | null;
  onSuccess?: () => void;
}> = ({ visible, setVisible, transactionHash, onSuccess }) => {
  return (
    <Modal
      centered
      title={null}
      footer={null}
      className={styles.purchaseModal}
      open={visible}
      onCancel={() => setVisible(false)}
      closeIcon={null}
    >
      <div className={styles.purchaseContainer}>
        <div className={styles.purchaseHeader}>
          <div className={styles.purchaseHeaderIconSuccess}>
            <img
              className={styles.purchaseHeaderIconImg}
              src={require("@/assets/icon/success.png")}
              alt="icon"
            />
          </div>
          <div className={styles.purchaseHeaderTitle}>
            Purchase Success
          </div>
        </div>
        <div className={styles.purchaseContent}>
          Transaction: {transactionHash}
        </div>
        <div className={styles.purchaseFooter}>
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
              type="primary"
              className={styles.purchaseFooterBtn}
              size="large"
              onClick={() => {
                setVisible(false);
                onSuccess && onSuccess();
              }}
            >
              OK
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </Modal>
  )
};

export default PurchaseSuccess;
