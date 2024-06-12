import { DropDown } from './components';
import { StatementRow, CurrencyBalance, Rate } from './screens';

export type PoundsSelector = {
  100: boolean;
  200: boolean;
  500: boolean;
  1000: boolean;
  custom: boolean;
};

export type UserDetailsState = {
  userInformation: {
    AccountNumber: string;
    AccountType: number | null;
    Address1: string;
    AddressVerificationMode: number;
    PINRequired: boolean;
    TradingAllowed: boolean;
    Country: string;
  };
};

export type OrderItem = {
  CCYPair: string;
  ExpiryDate: string;
  OrderID: number;
  Note: string;
  OrderDate: string;
  Status: number;
  TargetCCY: string;
  TargetAmount: number;
  TargetMargin: number;
  TargetRate: number;
  TargetRealRate: number;
  Type: number;
};

export type OrdersState = {
  ordersList: OrderItem[];
  errorMessage: string;
};

export type RatesState = {
  ratesList: Rate[];
  errorMessage: string;
};

export type AuthState = {
  userId: string;
  clientId: string;
  password: string;
  authToken: string;
  errorMessage: string;
  isBiometricsActive: boolean;
};

export type BeneficiariesState = {
  countries: [];
  beneficiaryList: Beneficiary[];
  currencies: DropDown[];
  errorMessage: string;
};

export type ContactUsState = {
  errorMessage: string;
};

export type DeviceValidationState = {
  errorMessage: string;
};

export type DebitCard = {
  Address1: string;
  Address2: string;
  Address3: string;
  CCY: string;
  CVV: string;
  CardNumber: string;
  CountryCode: string;
  ExpiryDate: string;
  ID: number;
  Type: number;
  IssueNumber: string;
  Name: string;
  PostCode: string;
  StartDate: string;
};

export type CCyCard = {
  ActivationCode: string;
  Address1: string;
  Address2: string;
  CCY: string;
  CardNumber: string;
  CardProgram: number;
  City: string;
  ClientID: string;
  CountryCode: string;
  EmbossedName: string;
  ExpiryDate: string;
  FirstName: string;
  ID: number;
  LastName: string;
  MobileNumber: string;
  OrderDate: string;
  PostCode: string;
  Status: number;
  Title: string;
  Type: number;
};

export type Beneficiary = {
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

export type PaymentItem = {
  Amount: number;
  CountryCode: string;
  Creator: string;
  Currency: string;
  Date: string;
  EntryDate: string;
  ID: number;
  Name: string;
  PayeeID: number;
  Reference1: string;
  Reference2: string;
  Reference3: string;
  Status: number;
};

export type StatementsState = {
  currencyCards: CCyCard[];
  ccies: DropDown[];
  vfxCardsTransactions: StatementRow[];
  allTransactions: StatementRow[];
};

export type BalanceState = {
  all: CurrencyBalance[];
  negatives: CurrencyBalance[];
  positives: CurrencyBalance[];
  errorMessage: string;
};

export type PaymentsState = {
  paymentsList: PaymentItem[];
  errorMessage: string;
};

export type ActionType = {
  type: string;
  payload?: string | object | boolean | [] | { label: string; value: number }[] | number;
};
