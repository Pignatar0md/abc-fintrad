export const LOGIN_INVALID_PASSWORD = 'Invalid Password';
export const LOGIN_UNKNOWN_CLIENT_ID = 'Unknown Client ID';
export const LOGIN_UNKNOWN_USER_ID = 'Attempt to logon with incorrect UserID.';
export const LOGIN_ACCOUNT_LOCKED_OUT = '3 failed logon attempts, account is locked out.';

export const errorMessages3DS: { [key: string]: string } = {
  CardAuthenticationFailed: 'cardAuthFailed',
  '0': 'cardAuthFailed',
  '04': 'exceededAuthLimit',
  '05': 'expiredCard',
  '06': 'invalidCardNumber',
};
