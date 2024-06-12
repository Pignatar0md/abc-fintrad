export const poundsInitState = {
  100: false,
  200: false,
  500: false,
  1000: false,
  custom: false,
};

export const beneficiaryInitState = {
  ID: 0,
  BeneficiaryName: '',
  Alias: '',
  CurrencyCode: '',
  PayCountryCode: '',
  AddressCountryCode: '',
  Address1: '',
  Address2: '',
  Address3: '',
  BankCode: '',
  BankName: '',
  AccountNumber: '',
  SWIFTBIC: '',
  IBAN: '',
  Reference1: '',
  Reference2: '',
  Reference3: '',
  RoutingCode: '',
  EMail: '',
  Priority: 0,
  IsCompany: false,
  SanctionsHit: false,
  AddressValidated: false,
};

export const currencyCardItemInitialState = {
  ActivationCode: '',
  Address1: '',
  Address2: '',
  CCY: '',
  CardNumber: '',
  City: '',
  ClientID: '',
  CountryCode: '',
  EmbossedName: '',
  ExpiryDate: '',
  FirstName: '',
  LastName: '',
  MobileNumber: '',
  OrderDate: '',
  PostCode: '',
  Title: '',
  CardProgram: 0,
  ID: 0,
  Status: 0,
  Type: 0,
};

export const dropdownInitState = {
  label: '',
  value: '',
};

export const countryInitState = {
  CurrencyCode: '',
  ID: '',
  IDDCode: '',
  Name: '',
  Nationality: '',
  PayCurrency: '',
  PayType: 1,
  PrepaidCards: 0,
  Status: 0,
  ...dropdownInitState,
};

export const countryDropDownInitState = {
  ...dropdownInitState,
  ...countryInitState,
};

export const homePageInitState = {
  Rates: false,
  StatementsTopTabbar: false,
  Balances: false,
  Trades: false,
  Orders: false,
  BeneficiaryList: false,
  Payments: false,
};

export const beneficiaryDetailsInitState = {
  firstName: '',
  middleName: '',
  lastName: '',
  alias: '',
  email: '',
  ref1: '',
  ref2: '',
  type: '',
};

export const beneficiaryBankDetailsInitState = {
  paymentPurpose: '',
  sortCode: '',
  accountNumber: '',
  swiftCode: '',
  bankName: '',
  transitNumber: '',
  iban: '',
  routingBank: '',
};

export const debitCardItemInitialState = {
  ID: 0,
  Type: 0,
  Address1: '',
  Address2: '',
  Address3: '',
  CCY: '',
  CVV: '',
  CardNumber: '',
  PostCode: '',
  CountryCode: '',
  ExpiryDate: '',
  IssueNumber: '',
  Name: '',
  StartDate: '',
};

export const ccyCardInitState = {
  ActivationCode: '',
  Address1: '',
  Address2: '',
  CCY: '',
  CardNumber: '',
  CardProgram: 0,
  ID: 0,
  City: '',
  ClientID: '',
  CountryCode: '',
  EmbossedName: '',
  ExpiryDate: '',
  FirstName: '',
  LastName: '',
  MobileNumber: '',
  OrderDate: '',
  PostCode: '',
  Status: 0,
  Title: '',
  Type: 0,
};

export const initialAuthState = {
  userId: '',
  clientId: '',
  password: '',
  authToken: '',
  errorMessage: '',
  isBiometricsActive: false,
};

const initialBalanceItem = { CCY: '', AccountBalance: 0, SpotBalance: 0, MarginAC: 0 };
export const initialBalanceState = {
  all: [initialBalanceItem],
  positives: [initialBalanceItem],
  negatives: [initialBalanceItem],
  errorMessage: '',
};

export const initialOrdersState = {
  ordersList: [
    {
      id: 0,
      price: 0,
      amount: 0,
      description: '',
      date: '',
      target: '',
      ccyPair: '',
      level: '',
      expiryDate: '',
    },
  ],
  errorMessage: '',
};

export const initialPaymentsState = {
  paymentsList: [
    {
      Amount: 0,
      ID: 0,
      PayeeID: 0,
      Status: 0,
      CountryCode: '',
      Creator: '',
      Currency: '',
      Date: '',
      EntryDate: '',
      Name: '',
      Reference1: '',
      Reference2: '',
      Reference3: '',
    },
  ],
  errorMessage: '',
};

export const initialRatesState = {
  ratesList: [
    {
      Currency1: {
        CurrencyCode: '',
        Name: '',
      },
      Currency2: {
        CurrencyCode: '',
        Name: '',
      },
      NextYearHols: [],
      ThisYearHols: [],
      WeekendDays: [],
      Ask: 0,
      Bid: 0,
      Decimals: 0,
      LastAsk: 0,
      LastBid: 0,
      LastPrice: 0,
      MaxForward: 0,
      RateGroup: 0,
      OpenPrice: 0,
      Price: 0,
      NoBuyTarget: false,
      NoLimitOrders: false,
      NoSellTarget: false,
      NoStopOrders: false,
      Success: false,
      Suspended: false,
      SpotDate: '',
      Pair: '',
      minValidDayTrade: '',
    },
  ],
  errorMessage: '',
};

export const initialScreenRate = {
  Pair: '',
  Bid: 0,
  BidIncrement: false,
  Ask: 0,
  AskIncrement: false,
  Fav: false,
  RateGroup: 0,
  Decimals: 0,
  Price: 0,
  OpenPrice: 0,
};
