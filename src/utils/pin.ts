import { hasUserSetPinCode, deleteUserPinCode } from '@haskkor/react-native-pincode';
import { sendInfoLog } from 'api/LoggerRequests';

export const hasConfiguredPinCode = async (serviceName: string) => {
  const result = await hasUserSetPinCode(serviceName);
  await sendInfoLog({
    event: 'PIN code set - hasCOnfiguredPinCode',
    detail: `User has PIN code: ${result}`,
  });
  return result;
};

export const removeConfiguredPinCode = async (serviceName: string) => {
  const result = await deleteUserPinCode(serviceName);
  await sendInfoLog({ event: 'removeConfiguredPinCode', detail: 'PIN code was removed' });
  return result;
};
