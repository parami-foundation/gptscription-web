import { extend } from "umi-request";
import { Resp, Req } from "@/types";
import { API_CONFIG } from "@/constants/global";

const errorHandler = (error: any) => {
  const { response = {}, data = {} } = error;
  return {
    response,
    data,
  } as Resp.Body;
};

export const request = extend({
  errorHandler,
  credentials: "same-origin",
});

export async function BindWalletNonce(
  data: Req.BindWalletNonce,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.BindWalletNonce>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function BindWallet(
  data: Req.BindWallet,
  nonce: string,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Error>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet/${nonce}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetProfile(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Profile>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetWallet(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.Wallet[]>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/api/v1/wallet`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function CreateTransaction(
  data: Req.CreateTransaction,
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/gptminer/mine/tx`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetAddressByRef(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.GetAddressByRef>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/gptminer/referrer/addr`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}

export async function GetSign(
  accessToken: string,
  options?: { [key: string]: any }
) {
  return request<Resp.GetSign>(
    `${API_CONFIG.scheme}://${API_CONFIG.host}/gptminer/mine/sig`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...(options || {}),
      getResponse: true,
    }
  );
}
