import { GetProfile } from "@/services/api";
import { useEffect, useState } from "react";
import type { Resp } from "@/types";

export default () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenExpire, setAccessTokenExpire] = useState<number | null>(null);
  const [profile, setProfile] = useState<Resp.Profile>({});
  const [refer, setRefer] = useState<string>();

  const cleanAccessToken = async () => {
    localStorage.removeItem("gptminer:accessToken");
    localStorage.removeItem("gptminer:accessToken:expire");
    setAccessToken(null);
    setAccessTokenExpire(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!!accessTokenExpire && accessTokenExpire < new Date().getTime()) {
        cleanAccessToken();
        clearInterval(timer);
      }
    }, 1000);
  }, [accessTokenExpire]);

  useEffect(() => {
    (async () => {
      const accessToken =
        localStorage.getItem("gptminer:accessToken");
      const accessTokenExpire =
        localStorage.getItem("gptminer:accessToken:expire");

      const now = new Date().getTime();

      if (!!accessTokenExpire && parseInt(accessTokenExpire) < now) {
        cleanAccessToken();
      } else {
        if (!!accessToken) {
          setAccessToken(accessToken);
        }
        if (!!accessTokenExpire) {
          setAccessTokenExpire(parseInt(accessTokenExpire));
        }
      }
    })();
  }, [accessToken, accessTokenExpire]);

  useEffect(() => {
    ; (async () => {
      if (!accessToken) {
        return;
      }
      const { response, data } = await GetProfile(accessToken);
      if (response?.status === 200) {
        setProfile(data);
      }
    })()
  }, [accessToken]);

  return {
    accessToken,
    accessTokenExpire,
    profile,
    refer,
    setRefer,
    setAccessToken,
    setAccessTokenExpire,
    cleanAccessToken,
  };
};
