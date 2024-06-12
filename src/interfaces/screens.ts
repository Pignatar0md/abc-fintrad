export interface MktOptions {
  email: boolean;
  push: boolean;
  sms: boolean;
  post: boolean;
}

export interface HomePageOptions {
  Rates: boolean;
  StatementsTopTabbar: boolean;
  Balances: boolean;
  Trades: boolean;
  Orders: boolean;
  BeneficiaryList: boolean;
  Payments: boolean;
}

export interface Currency {
  accountNumber?: string;
  country?: string;
  sortCode: string;
};

export interface RateForScreen {
  Pair: string;
  Ask: number;
  RateGroup: number;
  Decimals: number;
  Price: number;
  OpenPrice: number;
  Bid: number;
  AskIncrement: boolean;
  BidIncrement: boolean;
  Fav: boolean;
}

export interface Response3DS {
  data: {
    Data: {
      Rejected: boolean;
      StatusReason: string;
      TransactionIdentifier: string;
      ISOResponseCode: string;
      iFrame: string;
    };
    ErrorCode: number;
    ErrorOrigin: string;
    Message: string;
    Success: boolean;
    ErrorMsg?: string;
  };
}

export interface AddDebitCardResponse {
  data: {
    Data: {
      Succeeded: boolean;
      Message: string;
    };
    ErrorCode: number;
  };
}

export interface Beneficiary {
  ID: number;
  BeneficiaryName: string;
  Alias: string;
  CurrencyCode: string;
  BankName: string;
  PayCountryCode: string;
  AddressCountryCode: string;
  Address1: string;
  Address2: string;
  Address3: string;
  BankCode: string;
  AccountNumber: string;
  SWIFTBIC: string;
  IBAN: string;
  Reference1: string;
  Reference2: string;
  Reference3: string;
  RoutingCode: string;
  EMail: string;
  Priority: number;
  IsCompany: boolean;
  SanctionsHit: boolean;
  AddressValidated: boolean;
};
