import ReactNativeBiometrics from 'react-native-biometrics';
import { BIOMETRICS_AUTH_SECRET } from '@env';
import { sendErrorLog, sendInfoLog, sendWarningLog } from 'api/LoggerRequests';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const isSensorAvailable = async () => {
  const { biometryType } = await rnBiometrics.isSensorAvailable();
  await sendInfoLog({
    event: 'isSensorAvailable - biometrics',
    detail: `BiometricType: ${biometryType}`,
  });
  return biometryType;
};

export const checkUserBiometrics = async () => {
  try {
    const isValidUser = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' });
    await sendInfoLog({
      event: 'checkUserBiometrics - biometrics',
      detail: 'Auth user with biometrics',
    });
    return isValidUser.success;
  } catch (error: any) {
    await sendErrorLog({
      event: 'checkUserBiometrics - biometrics',
      detail: 'at trying to auth the user with biometrics: ' + error.toString(),
    });
    console.log('biometrics failed', error);
  }
};

export const checkBiometricsKeyExists = async () => {
  try {
    const resultObject = await rnBiometrics.biometricKeysExist(); //{ keysExist }
    await sendInfoLog({ event: 'checkBiometricsKeyExists - biometrics', detail: 'keyexists' });
    return resultObject;
  } catch (error: any) {
    await sendErrorLog({
      event: 'checkBiometricsKeyExists - biometrics',
      detail: 'at checking: ' + error.toString(),
    });
    console.log(error);
  }
};

export const createKeys = async () => {
  const resultObject = await rnBiometrics.createKeys(); // To-do: after this line, the resultObject.publicKey should be sent to the backend and be saved, for being used afterwards to validate a received signature.
  return resultObject;
};

export const createSignature = async (callback?: () => void) => {
  const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  const payload = `${epochTimeSeconds}${BIOMETRICS_AUTH_SECRET}`;
  try {
    const resultObject = await rnBiometrics.createSignature({
      promptMessage: 'Enable Biometrics',
      payload: payload,
    });
    const { success } = resultObject;
    if (success) {
      await sendInfoLog({
        event: 'Creating signature for biometrics auth - biometrics',
        detail: 'successfully',
      });
      callback && callback(); // To-do: after this line, the signature and payload should be sent to the backend, this should be true or false.
      return true;
    }
    await sendWarningLog({
      event: 'Creating signature for biometrics auth - biometrics',
      detail: resultObject.toString(),
    });
    return false;
  } catch (error: any) {
    await sendErrorLog({
      event: 'Creating signature for biometrics auth - biometrics',
      detail: error.toString(),
    });
  }
};
