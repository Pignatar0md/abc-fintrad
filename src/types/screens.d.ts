import { DropDown } from './components';
import { Beneficiary } from './state';

export type LoginAuthType = 'password' | 'pinNumber' | 'biometrics';

export type InputUserToAuth = {
  userId: string;
  clientId: string;
  password: string;
  authType?: LoginAuthType;
};

export type InputUserToContactUs = {
  userName: string;
  userPhone: string;
  userEmail: string;
  message: string;
};

export type InputUserOrderToAdd = {
  ccyAmount: string;
  targetRate: string;
  expiryDate: string;
  notes: string;
};

export type InputUserToSendPayment = {
  amount: string;
  firstReference: string;
  secondReference: string;
  paymentPurpose: string;
  CCY: string;
  payeeId: string;
};

export type InputUserToGetRate = {
  reverted: boolean;
  currency1: string;
  currency2: string;
  value: string;
  source: string;
  valueDate: string;
  callback: () => void;
};

export type InputUserToAddDebitCard = {
  nameOnTheCard: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
};

export type InputUserToRequestCcyCard = {
  title: { label: string; value: string };
  firstName: string;
  address1?: string;
  address2?: string;
  city?: string;
  postCode?: string;
  acceptsCardFee?: boolean;
  acceptsTermsAndConds?: boolean;
  acceptsPrivacyPolicy?: boolean;
  lastName: string;
  nameOnTheCard: string;
  mobileCode: string;
  mobileNumber: string;
};

export type AccountBalance = { AccountBalance: number };

export type BeneficiaryDetailsInfo = {
  firstName: string;
  middleName: string;
  lastName: string;
  alias: string;
  email: string;
  ref1: string;
  ref2: string;
  type: string;
};

export type InputUserToAddBeneficiary = {
  type: DropDown;
  firstName: string;
  middleName: string;
  lastName: string;
  alias: string;
  email: string;
  ref1: string;
  ref2: string;
  paymentPurpose: string;
  payCountry: DropDown;
  addressCountry: string;
  currency: DropDown;
  bankCountry: string;
  bankName: string;
  transitNumber: string;
  sortCode: string;
  accountNumber: string;
  swiftCode: string;
  iban: string;
  routingBank: string;
};

export type SliderScreenItem = {
  text: string;
  title: string;
};

export type FaqOption = 'generalInfo' | 'tradingInfo' | 'payandSettlementsInfo';

export type paymentStatusType = '1' | '2' | '3' | '5' | '6' | '7' | '8';

export type CurrencyBalance = {
  CCY: string;
  AccountBalance: number;
  SpotBalance: number;
  MarginAC: number;
};

export type StatementRow = {
  TransID: number;
  Action: string;
  Amount: string;
  Balance: string;
  CCY: string;
  Description: string;
  displayTransTime: string;
  isPositive: boolean;
  TransDate: string;
  TransTime: string;
  TransType: number;
  ValueDate: string;
};

export type StatusElement = {
  element: 'btn' | 'tag';
  color: string;
  text: string;
  onPress?: () => void;
};

export type ScreenSettings = 'SecuritySettings' | 'HomePage' | 'Communication';

export type HomePageOption =
  | 'Rates'
  | 'StatementsTopTabbar'
  | 'Balances'
  | 'Trades'
  | 'Orders'
  | 'BeneficiaryList'
  | 'Payments';

export type CurrencyCode = { CurrencyCode: string };

export type CardInfo = {
  ID: number;
  Status: number;
  Type: number;
  CardNumber: string;
};

export type AddBeneficiaryTab = {
  jumpTo: (a: string) => void;
  beneficiary: Beneficiary;
};

export type Currency = {
  CurrencyCode: string;
  Name: string;
};

export type Rate = {
  Ask: number;
  Bid: number;
  Currency1: Currency;
  Currency2: Currency;
  Decimals: number;
  LastAsk: number;
  LastBid: number;
  LastPrice: number;
  MaxForward: number;
  NextYearHols: [];
  NoBuyTarget: boolean;
  NoLimitOrders: boolean;
  NoSellTarget: boolean;
  NoStopOrders: boolean;
  OpenPrice: number;
  Pair: string;
  Price: number;
  RateGroup: number;
  SpotDate: string;
  Success: boolean;
  Suspended: boolean;
  ThisYearHols: [];
  WeekendDays: number[];
  minValidDayTrade: string;
};

export type TradeItem = {
  DDCollected: boolean;
  BuyAmount: number;
  BuySellFlag: number;
  CurrentProfitOnSpread: number;
  FeeAmount: number;
  Rate: number;
  SellAmount: number;
  Spread: number;
  TTID: number;
  TradeID: number;
  CCYPair: string;
  ClientID: string;
  BuyCCY: string;
  FeeCCY: string;
  SellCCY: string;
  TradeDate: string;
  UserID: string;
  ValueDate: string;
};
