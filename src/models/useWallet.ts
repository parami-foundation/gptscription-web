import { useState } from "react";

export default () => {
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [walletModalVisible, setWalletModalVisible] = useState<boolean>(false);

  return {
    address,
    setAddress,
    walletModalVisible,
    setWalletModalVisible,
  };
};
