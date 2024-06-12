import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Beneficiary, CCyCard, DebitCard, OrderItem } from './state';

import { CardInfo } from './screens';
import { CardScannerResponse } from 'rn-card-scanner';

export type RootStackParamList = {
  AccountValidation: undefined;
  ContactUs: undefined;
  IntroSlider: undefined;
  Login: { expired: boolean };
  WebViewScreen: { url: string };
  Sidebar: undefined;
  ValidateDevice: undefined;
  BalancesBottomTabBar: undefined;
  ContactInfo: undefined;
  FAQs: undefined;
  CurrencyCardDetails: { item: CardInfo };
  DebitCardDetails: { item: DebitCard };
  AddOrder: { item: OrderItem };
  SecuritySettings: undefined;
  Settings: undefined;
  SetPin: undefined;
  RequestPin: { callback: () => void | Promise<void>; screen?: string; from: string };
  Major: undefined;
  All: undefined;
  Negative: undefined;
  Positive: undefined;
  TopUp: undefined;
  Rates: undefined;
  AddDebitCardInfoManually: undefined;
  Balances: undefined;
  ContactUsTopTabbar: undefined;
  StatementsTopTabbarForMain: { CCY: string };
  StatementsTopTabbar: { CCY: string };
  AddBeneficiaryTopTabbar: { beneficiaryId?: number };
  BeneficiaryDetailsTopTabbar: { beneficiary: Beneficiary };
  BeneficiaryListBottomTabbar: undefined;
  AddDebitCardBottomTabbar: undefined;
  ScanDebitCard: undefined;
  FillManually: {
    item: CardScannerResponse;
  };
  BeneficiaryList: undefined;
  Statements: undefined;
  HomePage: undefined;
  Communication: undefined;
  Trades: undefined;
  CurrencyCards: undefined;
  BeneficiariesTabbar: undefined;
  DebitCards: undefined;
  Orders: undefined;
  EditCcyCardMobilePhone: { CardID: number };
  RequestCcyCard: undefined;
  Payments: undefined;
  SendPayment: { CCY?: string; limit?: string; beneficiaryId?: number; beneficiary?: Beneficiary };
  AccountDetails: undefined;
  SendPaymentDetails: {
    amount: string;
    firstReference: string;
    secondReference: string;
    paymentPurpose: string;
    limit: string;
    selectedBeneficiary: {
      label: string;
      value: string;
      accountNumber?: string;
    };
    selectedCcy: {
      label: string;
      value: string;
      sortCode: string;
      country: string;
    };
  };
  Trade: { op: string; CCY: string; balance: number };
};

export type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type OrdersScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Orders'>;
export type TopUpNavigationProp = NativeStackScreenProps<RootStackParamList, 'TopUp'>;
export type MajorNavigationProp = NativeStackScreenProps<RootStackParamList, 'Major'>;
export type RatesNavigationProp = NativeStackScreenProps<RootStackParamList, 'Rates'>;
export type ContactUsTopTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'ContactUsTopTabbar'
>;
export type SetPinNavigationProp = NativeStackScreenProps<RootStackParamList, 'SetPin'>;
export type ValidateDeviceNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'ValidateDevice'
>;
export type SettingsNavigationProp = NativeStackScreenProps<RootStackParamList, 'Settings'>;
export type ScanDebitCardNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'ScanDebitCard'
>;
export type CurrencyCardDetailsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'CurrencyCardDetails'
>;
export type DebitCardDetailsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'DebitCardDetails'
>;
export type AddOrderNavigationProp = NativeStackScreenProps<RootStackParamList, 'AddOrder'>;
export type SecuritySettingsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'SecuritySettings'
>;
export type AddDebitCardInfoManuallyNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AddDebitCardInfoManually'
>;
export type StatementsTopTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'StatementsTopTabbar'
>;
export type StatementsTopTabbarForMainNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'StatementsTopTabbarForMain'
>;
export type RequestPinNavigationProp = NativeStackScreenProps<RootStackParamList, 'RequestPin'>;
export type BeneficiaryDetailsTopTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'BeneficiaryDetailsTopTabbar'
>;
export type SidebarNavigationProp = NativeStackScreenProps<RootStackParamList, 'Sidebar'>;
export type AddBeneficiaryTopTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AddBeneficiaryTopTabbar'
>;
export type RequestCcyCardScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'RequestCcyCard'
>;
export type AcccountValidationScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AcccountValidation'
>;
export type BeneficiaryListScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'BeneficiaryList'
>;
export type AddDebitCardBottomTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AddDebitCardBottomTabbar'
>;
export type BeneficiaryListBottomTabbarNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'BeneficiaryListBottomTabbar'
>;
export type EditCcyCardMobilePhoneNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'EditCcyCardMobilePhone'
>;
export type IntroSliderScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'IntroSlider'
>;
export type WebViewScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'WebViewScreen'
>;
export type AccountValidationNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AccountValidation'
>;
export type AccountDetailsScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'AccountDetails'
>;
export type AllScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'All'>;
export type BalancesBottomTabBar = NativeStackScreenProps<
  RootStackParamList,
  'BalancesBottomTabBar'
>;
export type TradeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Trade'>;
export type HomePageScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'HomePage'>;
export type CommunicationScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Communication'
>;
export type SendPaymentDetailsScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'SendPaymentDetails'
>;
export type SendPaymentScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'SendPayment'
>;
export type PaymentsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Payments'>;
export type CurrencyCardsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'CurrencyCards'
>;
export type FillManuallyCardNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'FillManually'
>;
export type DebitCardsNavigationProp = NativeStackScreenProps<RootStackParamList, 'DebitCards'>;
export type TradesNavigationProp = NativeStackScreenProps<RootStackParamList, 'Trades'>;
export type AllScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'All'>;
export type NegativeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Negative'>;
export type PositiveScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Positive'>;

export type Navigation = {
  navigate: (key: string, params?: object) => void;
  setOptions: (a: object) => void;
  goBack: () => void;
};

export type navigateType =
  | TopUpNavigationProp
  | BalancesBottomTabbar
  | TradesNavigationProp
  | AcccountValidationScreenNavigationProp
  | AddOrderNavigationProp
  | AllScreenNavigationProp
  | DebitCardsNavigationProp
  | LoginScreenNavigationProp
  | OrdersScreenNavigationProp
  | TradeScreenNavigationProp
  | ScanDebitCardNavigationProp
  | WebViewScreenNavigationProp
  | HomePageScreenNavigationProp
  | NegativeScreenNavigationProp
  | PositiveScreenNavigationProp
  | FillManuallyCardNavigationProp
  | IntroSliderScreenNavigationProp
  | CommunicationScreenNavigationProp
  | BeneficiariesScreenNavigationProp
  | AccountDetailsScreenNavigationProp
  | RequestCcyCardScreenNavigationProp
  | EditCcyCardMobilePhoneNavigationProp
  | AcccountValidationScreenNavigationProp
  | SendPaymentDetailsScreenNavigationProp;

export type ScreenProps = {
  navigation: navigateType;
  route?: {
    params: {
      paymentPurpose: string;
      beneficiaryId: number;
      CardID: number;
      selectedCcy: { country: string; sortCode: string; label: string; value: string };
      amount: string;
      selectedBeneficiary: { accountNumber: string; label: string; value: string };
      url?: string;
      pair: string[];
      op?: 'buy' | 'sell' | '';
      item: CCyCard;
      from?: string;
      screen?: 'SendPaymentDetails' | 'CurrencyCardDetails' | 'DebitCardDetails';
      callback: () => void;
      CCY: string;
      limit: string;
      firstReference: string;
      secondReference: string;
      paymentPurpose: string;
      item: CardScannerResponse;
      balance: number;
    };
  };
};
