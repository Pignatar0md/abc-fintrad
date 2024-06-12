import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = () => {
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const osVersion = Platform.Version;
  const osName = Platform.OS;

  return {
    brand,
    model,
    osVersion,
    osName,
  };
};

export const getAppInfo = () => {
  const buildNumber = DeviceInfo.getBuildNumber();
  return { buildNumber };
};
