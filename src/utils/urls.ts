import {
  BACKEND_URL,
  CODE_URL,
  MESSAGE_URL,
  LOGGER_URL,
  BACKEND_URL_VERSION,
  WS_MARKETDATA_ENDPOINT,
  WS_NOTIFICATIONS_ENDPOINT,
  DSECURE_URL,
} from '@env';

export const URLS = {
  message: MESSAGE_URL,
  backend: BACKEND_URL,
  code: CODE_URL,
  logger: LOGGER_URL,
  '3dsecure': DSECURE_URL,
  wsMarketData: WS_MARKETDATA_ENDPOINT,
  wsNotifications: WS_NOTIFICATIONS_ENDPOINT,
  version: BACKEND_URL_VERSION,
};

export const VFX_API_URLS = {
  getAuthToken: '/Account/authenticate',
  sendMessage: '/SendEmailToDepartment',
  requestAuthCode: '/RequestAuth',
  validateAuthCode: '/ValidateAuth',
  setCommunicationPreferences: '/SubscribeNotifications',
  getCommunicationPreferences: '/GetClientNotifications',
  getRates: '/Client/currencies',
  getUserDetails: '/Client/details',
  getClientAccounts: '/Client/accounts',
  ccyCards: '/CurrencyCards',
  payments: '/Payments',
  paymentsLimits: '/Payments/limits',
  paymentsApprove: '/Payments/approve',
  getStatementsByCcy: '/Client/statement',
  validatePinLetter: '/Client/pinletter',
  getStatementsByCcyCardId: '/CurrencyCards/statement',
  getAppVersionValid: '/appversion',
  sendToLogServer: 'Logger',
  beneficiaries: '/Beneficiaries',
  countries: '/Client/countries',
  getRate: 'Trades/spotquote',
  trades: '/Trades',
  debitCards: '/DebitCards',
  sendCcyStatementsByEmailByMonth: '/SendStatementsByMonth',
  sendCcyStatementsByEmailByRageDates: '/SendStatementsByRangeDates',
  sendCardStatementsByEmailByMonth: '/SendStatementsCardByMonth',
  wsNotificationsRegister: '/Register',
  wsMarketDataAuthenticate: '/Authenticate',
  topupLimits: '/client/limits',
  orders: '/Orders',
};

export const VFX_WEBS_RESOURCES = {
  webPage: 'https://www.abcfintrad.com',
  webApp: 'https://app.abcfintrad.com',
};

export const VFX_WEBLINKS_SITES = {
  signUp: '/home/signup',
  termsAndConditions: '/files/VFXFinancial_PrepaidCards_Terms.pdf',
  privacyPolicy: '/privacy',
};

export const VFX_WEBAPP_SERVICES = {
  forgotPassword: '/ForgotPassword',
};
