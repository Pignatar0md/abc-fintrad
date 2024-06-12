export type ResponseAuthRequest = {
  Succeeded: boolean;
  Message: string;
  Data: {
    JWToken: string;
    Data: {
      ErrorID: number;
      AccountType: number;
    };
  };
};

export type RequestParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: string | object;
  params?: string | object;
  headers: object;
};

export type Service =
  | 'backend'
  | 'message'
  | 'code'
  | '3dsecure'
  | 'logger'
  | 'wsMarketData'
  | 'wsNotifications';

export type Card3DS = {
  TotalAmount: number;
  CCY: string;
  CardholderName: string;
  CardExpiration: string;
  CardPan: string;
  CardCVV: string;
  AcceptHeader: string;
  Language: string;
  ScreenHeight: number;
  ScreenWidth: number;
  TimeZone: number;
  UserAgent: string;
  JavaEnabled: boolean;
  JavascriptEnabled: boolean;
  ColorDepth: number;
  SystemName: string;
  ClientID: string;
};

export type DebitCardAdding = {
  CardNumber: string;
  CVV: string;
  Name: string;
  ExpiryDate: string;
  StartDate: string;
  IssueNumber: string;
  Address1: string;
  Address2: string;
  Address3: string;
  PostCode: string;
  CountryCode: string;
};

export type UpdateAddOrder = {
  order: InputUserOrderToAdd;
};
