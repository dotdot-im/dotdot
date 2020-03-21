export type User = {
  uuid: string,
  email?: string,
  balance: number,
  transferwise_id: number | null,
  currency: string | null,
  created_on: Date,
};

export type Domain = {
  uuid: string,
  domain: string,
  balance: number,
  created_on: Date,
};

export type Payout = {
  uuid: string,
  tx_id: any,
  amount_nils: number,
  amount_fiat: number,
  currency: string,
  sent_on: Date | null,
  created_on: Date,
  estimated_on: Date | null,
};

export type AppState = {
  auth: {
    checked: boolean,
    loggedIn: boolean,
    user: User | null,
    csrf: string | null,
  },
  offline: boolean,
  domains: Domain[],
  payouts: Payout[],
};

export type Action = {
  type: string,
  payload?: any,
};

export type AppContext = {
  state: AppState,
  dispatch: React.Dispatch<Action>,
};