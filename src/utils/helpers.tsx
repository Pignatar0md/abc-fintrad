import { Alert, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { createSignature } from './biometrics';
import { DropDown, genericFn } from 'types/components';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { getRates } from 'api/RatesRequests';
import { getPlaneObjectData, getPlaneStringData, storePlaneObjectData } from './localStorage';
import { CurrencyCode, Rate } from 'types/screens';
import { divideStringAtMiddle } from './strings';
import { DEVICE_VALIDATED } from './static';
import { sendSMS } from 'api/ValidationRequests';
import { RateForScreen } from 'interfaces/screens';
import { navigateType } from 'types/types';

export const createButtonAlert = (
  title: string,
  message: string,
  callback?: genericFn,
  cancel?: boolean,
) => {
  const customContent = [
    {
      text: 'Ok',
      onPress: callback ? () => callback() : () => ({}),
    },
  ];
  cancel && customContent.unshift({ text: 'Cancel', onPress: () => undefined });
  return Alert.alert(title, message, customContent, { cancelable: true });
};

export const onBiometricAuthPress = async (callback: () => void) => {
  const result = await createSignature();
  if (result) {
    await sendInfoLog({
      event: 'Creating Biometrics Signature',
      detail: 'onBiometricAuthPress: Success',
    });
    callback();
  } else {
    await sendErrorLog({
      event: 'Creating Biometrics Signature',
      detail: `onBiometricAuthPress result: ${result}`,
    });
  }
};

export const getCcies = async (navigation: navigateType) => {
  const response = await getRates();
  if (response?.data?.Succeeded) {
    await sendInfoLog({ event: 'getCcies - Helpers', detail: 'Success' });
    createRatesByCategory(response?.data?.Data);
    const storedUser = await getPlaneObjectData('userDetails');
    const localUserAllowedPairs = storedUser?.userDetails?.AllowedCCYPairs;
    const pair1: string[] = response?.data?.Data?.map(
      ({ Currency1 }: { Currency1: CurrencyCode }) => Currency1.CurrencyCode,
    );
    const pair2: string[] = response?.data?.Data?.map(
      ({ Currency2 }: { Currency2: CurrencyCode }) => Currency2.CurrencyCode,
    );
    const ccyPairs = response?.data?.Data?.map(({ Pair }: { Pair: string }) => ({
      value: Pair,
      label: Pair,
    }));
    const filteredPairs: string[] = [...new Set(pair1), ...new Set(pair2)];
    const filteredCcies: string[] = [...new Set(filteredPairs)];
    const cciesToList: DropDown[] = [];

    if (localUserAllowedPairs && localUserAllowedPairs[0] === '*') {
      await storePlaneObjectData('currencyPairs', { ccyPairs });
      filteredCcies.forEach((elem: string) => cciesToList.push({ label: elem, value: elem }));
    } else {
      const allowedCciesPairs = localUserAllowedPairs
        ?.map((ccy: string) => divideStringAtMiddle(ccy))
        .join(' ')
        .split(' ');
      const allowedCcys = [...new Set(allowedCciesPairs)];
      const mappedCcies = filteredCcies.filter((element: string) => {
        return allowedCcys.includes(element);
      });
      mappedCcies.forEach((elem: string) => cciesToList.push({ label: elem, value: elem }));
    }
    return cciesToList;
  } else {
    if (response?.data === 'Request failed with status code 401') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login', expired: true }],
      });
      await sendErrorLog({
        event: 'GetCcies - AllStatements',
        detail: 'user session expired: ' + response?.data,
      });
    } else {
      await sendErrorLog({ event: 'getCcies - Helpers', detail: 'at trying to get ccies: ' + response?.toString() });
    }
  }
};
const createRatesByCategory = async (rates: Rate[]) => {
  const favCcyPairs = await getPlaneObjectData('userDetails');
  const favRates: RateForScreen[] = [];
  const allRates: RateForScreen[] = [];
  const majorRates: RateForScreen[] = [];
  const minorRates: RateForScreen[] = [];
  const exoticRates: RateForScreen[] = [];
  for (const rate of rates) {
    const appliedSpreadBid = await applySpread('bid', rate.Bid, rate.Decimals, 0, 1);
    const appliedSpreadAsk = await applySpread('ask', rate.Ask, rate.Decimals, 0, 1);
    if (rate.Pair !== 'EURGBP' && rate.Pair !== 'XAUUSD') {
      const data: RateForScreen = {
        Pair: rate.Pair.slice(0, 3) + '/' + rate.Pair.slice(3, 6),
        Bid: Number(appliedSpreadBid),
        BidIncrement: rate.LastBid < rate.Bid,
        Ask: Number(appliedSpreadAsk),
        AskIncrement: rate.LastAsk < rate.Ask,
        Fav: favCcyPairs.userDetails.FavouriteCCYPairs.indexOf(rate.Pair) !== -1,
        RateGroup: rate.RateGroup,
        Decimals: rate.Decimals,
        Price: rate.Price,
        OpenPrice: rate.OpenPrice,
      };
      if (data.Fav === true) {
        favRates.push(data);
      }
      allRates.push(data);
      switch (rate.RateGroup) {
        case 1:
          majorRates.push(data);
          break;
        case 2:
          minorRates.push(data);
          break;
        case 3:
          exoticRates.push(data);
          break;
      }
    }
  }
  await storePlaneObjectData('allRates', allRates);
  await storePlaneObjectData('exoticRates', exoticRates);
  await storePlaneObjectData('minorRates', minorRates);
  await storePlaneObjectData('favRates', favRates);
  await storePlaneObjectData('majorRates', majorRates);
};

export const applySpread = async (
  type: string,
  originalValue: number,
  decimals: number,
  spreadAd: number,
  amount: number,
) => {
  let finalV = 0;
  let spreadR;
  let record;

  const spreads = await getPlaneObjectData('spreads');
  for (let i = 0; i < spreads.length; i++) {
    if (spreads[i].Size * 1000 - amount > 0) {
      record = spreads[i].data;
      break;
    }
  }
  if (typeof record !== 'undefined') {
    if (type.toLowerCase() == 'bid') {
      if (parseInt(record['Pips']) >= 0) {
        finalV = originalValue - parseInt(record['Pips']) / Math.pow(10, decimals);
      } else {
        spreadR = Math.abs(parseInt(record['Pips'])) / 100;
        finalV = originalValue - (originalValue * spreadR) / 100;
      }
      if (spreadAd > 0) {
        finalV = finalV - (originalValue * spreadAd) / 100;
      }
    } else {
      if (parseInt(record['Pips']) >= 0) {
        finalV = originalValue + parseInt(record['Pips']) / Math.pow(10, decimals);
      } else {
        spreadR = Math.abs(parseInt(record['Pips'])) / 100;
        finalV = originalValue + (originalValue * spreadR) / 100;
      }
      if (spreadAd > 0) {
        finalV = finalV + (originalValue * spreadAd) / 100;
      }
    }
  }
  return finalV.toFixed(decimals);
};

export const getLatestAppVersion = async () => {
  const latestVersion = await VersionCheck.getLatestVersion({
    provider: Platform.OS === 'android' ? 'playStore' : 'appStore',
  });
  await sendInfoLog({ event: 'Getting the latest app version', detail: Platform.OS });
  return latestVersion;
};

export const getAppMetadata = async () => {
  const packageName = VersionCheck.getPackageName();
  const currentVersion = VersionCheck.getCurrentVersion();
  const urlToUpdate = await VersionCheck.getStoreUrl({ appID: packageName });
  await sendInfoLog({ event: 'Getting app metadata', detail: packageName });
  return {
    currentVersion,
    urlToUpdate,
  };
};

export const checkIfValidated = async (callBackValid: genericFn, callBackInValid: genericFn) => {
  const deviceAlreadyValidated = await getPlaneStringData(DEVICE_VALIDATED);
  deviceAlreadyValidated === '1' ? callBackValid() : callBackInValid();
};

export const sendCodeAndRedirectToValidate = async (
  callBackSuccess: genericFn,
  callBack: genericFn,
  callBackError: genericFn,
) => {
  const response = await sendSMS();
  if (typeof response?.data !== 'boolean') {
    await sendErrorLog({ event: 'SendSMS', detail: response?.toString() });
    callBackError();
  } else {
    callBackSuccess();
    await sendInfoLog({ event: 'SendSMS', detail: 'Success' });
  }
  callBack();
};

export const formatThousand = (number: string, separator: string, numGroup: number) => {
  const nGroup = isNaN(numGroup) ? '3' : numGroup;
  const strRegExp = '\\B(?=(\\d{' + nGroup + '})+(?!\\d))';
  const regExp = new RegExp(strRegExp, 'g');
  number = number.replace(/\s+/g, '');

  return number.toString().replace(regExp, separator);
};
