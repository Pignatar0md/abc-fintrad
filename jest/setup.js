import 'react-native-gesture-handler/jestSetup';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native-signalr', () => new Promise((resolve) => resolve(true)));

jest.mock('react-native-signalr', () => new Promise((resolve) => resolve(true)));

jest.mock('react-native-biometrics', () => {
  class ReactNativeBiometrics {
    constructor() {
      this.key = '';
    }
    isSensorAvailable() {
      return { biometryType: 'FaceID' };
    }
    simplePrompt() {
      return { success: true };
    }
    biometricKeysExist() {
      return { keyExist: true };
    }
    createKeys() {
      this.key = '232133212213213';
      return { publicKey: this.key };
    }
    createSignature() {
      return { success: true, signature: '123432' };
    }
  }
  return {
    __esModule: true,
    default: ReactNativeBiometrics,
    BiometryTypes: { TouchID: 'mock1', FaceID: 'mock2' }, // static values
  };
});

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => ({});

  return Reanimated;
});

jest.mock('@haskkor/react-native-pincode', () => ({
  hasUserSetPinCode: () => new Promise((resolve) => resolve(true)),
  deleteUserPinCode: () => new Promise((resolve) => resolve(true)),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: jest.fn(),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => ({})),
      },
    };
  },
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('images/VFXF-R_Logo-WHITE.svg', () => () => null);

jest.mock('expo-secure-store', () => {
  const realConstants = jest.requireActual('expo-constants').default;
  const mockConstants = Object.create(realConstants);
  const realExpoSecureStore = jest.requireActual('expo-secure-store/src/SecureStore');
  const realExpoModulesCore = jest.requireActual('expo-modules-core/src/NativeModulesProxy');

  return {
    __esModule: true,
    ...realConstants,
    ...realExpoSecureStore,
    ...realExpoModulesCore,
    mockConstants,
    NativeModulesProxy: {
      ExpoSecureStore: {
        setValueWithKeyAsync: jest.fn(),
        getValueWithKeyAsync: jest.fn(),
      },
    },
    SecureStore: {
      setItemAsync: jest.fn(),
      getItemAsync: jest.fn(() => 2),
      deleteItemAsync: jest.fn(),
    },
  };
});
