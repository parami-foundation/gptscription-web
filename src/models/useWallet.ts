import { NETWORK_CONFIG } from "@/constants/global";
import { BindWallet, BindWalletNonce, GetSign, GetWallet } from "@/services/api";
import { useEffect, useState } from "react";
import { useModel } from "@umijs/max";
import { notification } from "antd";

export default () => {
  const { accessToken } = useModel("useAccess");

  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [walletModalVisible, setWalletModalVisible] = useState<boolean>(false);
  const [walletBinded, setWalletBinded] = useState<boolean>(false);
  const [bindedAddress, setBindedAddress] = useState<`0x${string}` | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const getBindWalletNonce = async ({
    address,
    accessToken,
  }: {
    address: `0x${string}` | null;
    accessToken: string;
  }) => {
    if (!address || !accessToken) {
      return {
        nonce: null,
        message: null,
        error: "Get nonce failed",
      };
    }

    const { response, data } = await BindWalletNonce(
      {
        chain_id: NETWORK_CONFIG.chains[0].id.toString(),
        address: address,
      },
      accessToken
    );

    if (response?.status === 200) {
      setNonce(data?.nonce);
      setMessage(data?.message);

      return {
        nonce: data?.nonce,
        message: data?.message,
      };
    };

    return {
      nonce: undefined,
      message: undefined,
      error: data,
    };
  };

  const bindWallet = async ({
    nonce,
    address,
    signature,
    accessToken,
  }: {
    nonce: string;
    address: `0x${string}` | undefined;
    signature: string;
    accessToken: string;
  }) => {
    if (!nonce || !address || !signature || !accessToken) {
      return {
        error: "Bind wallet failed",
        error_description: "Missing parameters",
      };
    }
    const { response, data } = await BindWallet(
      {
        chain_id: NETWORK_CONFIG?.chains[0]?.id?.toString(),
        address: address,
        signature: signature,
      },
      nonce,
      accessToken
    );

    if (response?.status === 200 || response?.status === 204) {
      return null;
    } else {
      return data;
    }
  };

  useEffect(() => {
    if (!!address) {
      localStorage.setItem("gptscription:address", address);
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      const address =
        localStorage.getItem("gptscription:address");
      if (!!address) {
        setAddress(address as `0x${string}`);
      }
    })();
  }, []);

  useEffect(() => {
    ; (async () => {
      if (!accessToken) return;
      const { response, data } = await GetWallet(accessToken);
      if (response?.status === 200 && !!data?.length) {
        data?.forEach((item) => {
          if (item.chain_id?.toString() === NETWORK_CONFIG?.chains[0]?.id?.toString()) {
            setWalletBinded(true);
            setAddress(item.address as `0x${string}`);
            setBindedAddress(item.address as `0x${string}`);
            localStorage.setItem("gptscription:address", item.address as `0x${string}`);
          }
        });
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    ; (async () => {
      if (!accessToken || !address || !walletBinded) return;
      const { response, data } = await GetSign(accessToken);
      if (response?.status === 200 && !!data?.data) {
        setTxSignature(data?.data);
      }
    })();
  }, [walletBinded]);

  return {
    message,
    nonce,
    address,
    setAddress,
    signature,
    setSignature,
    walletModalVisible,
    setWalletModalVisible,
    getBindWalletNonce,
    walletBinded,
    bindedAddress,
    setWalletBinded,
    bindWallet,
    txSignature,
  };
};
