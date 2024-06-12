import { getPlaneStringData } from 'utils/localStorage';
import { hasConfiguredPinCode } from 'utils/pin';

export const useAuthType = () => {
  const getAuthType = async () => {
    let authSystem = '';
    const biometricsResult = await getPlaneStringData('isUsingBiometrics');
    const areTherePin = await hasConfiguredPinCode('pinNumber');
    if (biometricsResult && !!parseInt(biometricsResult)) {
      authSystem = 'biometrics';
    } else if (areTherePin) {
      authSystem = 'pinNumber';
    } else {
      authSystem = 'password';
    }
    return authSystem;
  };

  return { getAuthType };
};
