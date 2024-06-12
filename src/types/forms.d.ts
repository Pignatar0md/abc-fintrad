export type LoginInput = 'userId' | 'clientId' | 'password';
export type ContactUsInput = 'userName' | 'userEmail' | 'userPhone' | 'message';
export type AddDebitCardInput = 'nameOnTheCard' | 'cvv' | 'cardNumber';
export type SendPaymentInput = 'amount' | 'firstReference' | 'secondReference' | 'paymentPurpose';
export type RequestCcyCardInput =
  | 'title'
  | 'firstName'
  | 'lastName'
  | 'address1'
  | 'address2'
  | 'city'
  | 'postCode'
  | 'nameOnTheCard'
  | 'mobileCode'
  | 'mobileNumber'
  | 'acceptsCardFee'
  | 'acceptsTermsAndConds'
  | 'acceptsPrivacyPolicy';

export type AddOrderInput =
  | 'ccyPair'
  | 'orderType'
  | 'ccySelect'
  | 'ccyAmount'
  | 'targetRate'
  | 'expiryDate'
  | 'notes';

export type AddBeneficiaryInput =
  | 'type'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'alias'
  | 'email'
  | 'ref1'
  | 'ref2'
  | 'paymentPurpose'
  | 'payCountry'
  | 'addressCountry'
  | 'currency'
  | 'bankCountry'
  | 'bankName'
  | 'transitNumber'
  | 'sortCode'
  | 'accountNumber'
  | 'swiftCode'
  | 'iban'
  | 'routingBank';

export type Country = {
  CurrencyCode: string;
  ID: string;
  IDDCode: string;
  Name: string;
  Nationality: string;
  PayCurrency: string;
  PayType: number;
  PrepaidCards: number;
  Status: number;
};
