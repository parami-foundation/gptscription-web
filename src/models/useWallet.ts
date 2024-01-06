import { useEffect, useState } from "react";

export default () => {
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [walletModalVisible, setWalletModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!!address) {
      localStorage.setItem("gptminer:address", address);
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      const address =
        localStorage.getItem("gptminer:address");
      if (!!address) {
        setAddress(address as `0x${string}`);
      }
    })();
  }, []);

  return {
    address,
    setAddress,
    walletModalVisible,
    setWalletModalVisible,
  };
};
