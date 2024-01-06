export declare namespace Req {
  interface BindWalletNonce {
    chain_id?: string;
    address?: string;
  }

  interface BindWallet {
    chain_id?: string;
    address?: string;
    signature?: string;
  }

  interface CreateTransaction {
    chain_id?: string;
    address?: string;
    hash?: string;
  }

  interface GetTokenPrice {
    token: string;
    currency: string;
  }
}

export declare namespace Resp {
  interface Body {
    response?: any;
    data?: any;
  }

  interface Error extends Body {
    error?: string;
    error_description?: string;
  }

  interface BindWalletNonce extends Body {
    error?: string;
    error_description?: string;
    chain_id?: string;
    nonce?: string;
    message?: string;
  }

  interface GetTokenPrice extends Body {
    [key: string]: any;
  }

  interface Profile extends Body {
    id?: string;
    name?: string;
    avatar_uri?: string;
    bio?: string;
    credit?: string;
    created_at?: string;
  }

  interface Wallet extends Body {
    chain_id?: string;
    address?: string;
  }

  interface Asset extends Body {
    chain_id?: string;
    asset_id?: string;
    name?: string;
    symbol?: string;
    type?: string;
    amount?: number;
    identifier?: string;
  }

  interface Extrinsic extends Body {
    chain_id?: string;
    tx?: string;
    asset_id?: string;
    name?: string;
    symbol?: string;
    from_address?: string;
    to_address?: string;
    type?: string;
    amount?: number;
    state?: string;
    finalized?: boolean;
    finalized_at?: string;
  }

  interface GetAddressByRef extends Body {
    status?: string;
    data?: string;
  }
}
