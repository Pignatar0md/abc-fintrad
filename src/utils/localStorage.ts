import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '../../languages';
import { sendErrorLog } from 'api/LoggerRequests';

export const secureStore = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error: any) {
    await sendErrorLog({
      event: 'SecureStore - LocalStorage - Utils folder',
      detail: `Could not save ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.storing} String ${en.dataFrom} ${en.secureStorage}: ${error.message}`;
  }
};

export const secureRetrieve = async (key: string) => {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error: any) {
    await sendErrorLog({
      event: 'SecureRetrieve - LocalStorage - Utils folder',
      detail: `Could not retrieve ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.getting} ${en.string} ${en.dataFrom} ${en.secureStorage}: ${error.message}`;
  }
};

export const secureRemove = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error: any) {
    await sendErrorLog({
      event: 'SecureRemove - LocalStorage - Utils folder',
      detail: `Could not remove ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.deleting} ${en.dataFrom} ${en.secureStorage}: ${error.message}`;
  }
};

export const storePlaneStringData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    await sendErrorLog({
      event: 'StorePlaneStringData - LocalStorage - Utils folder',
      detail: `Could not store ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.storing} ${en.string} ${en.dataFrom} ${en.asyncstorage}: ${error.message}`;
  }
};

export const storePlaneObjectData = async (key: string, value: object) => {
  try {
    const objectAsString = JSON.stringify(value);
    await AsyncStorage.setItem(key, objectAsString);
    return true;
  } catch (error: any) {
    await sendErrorLog({
      event: 'StorePlaneObjectData - LocalStorage - Utils folder',
      detail: `Could not store ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.storing} ${en.object} ${en.dataFrom} ${en.asyncstorage}: ${error.message}`;
  }
};

export const getPlaneStringData = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem(key);
    return result;
  } catch (error: any) {
    await sendErrorLog({
      event: 'GetPlaneStringData - LocalStorage - Utils folder',
      detail: `Could not retrieve ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.getting} ${en.string} ${en.dataFrom} ${en.asyncstorage}: ${error.message}`;
  }
};

export const getPlaneObjectData = async (key: string) => {
  try {
    const objectAsString = await AsyncStorage.getItem(key);
    return objectAsString ? JSON.parse(objectAsString) : null;
  } catch (error: any) {
    return `${en.errorAt} ${en.getting} ${en.object} ${en.dataFrom} ${en.asyncstorage}: ${error.message}`;
  }
};

export const deletePlaneData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error: any) {
    await sendErrorLog({
      event: 'DeletePlaneData - LocalStorage - Utils folder',
      detail: `Could not delete ${key} => ${error.toString()}`,
    });
    return `${en.errorAt} ${en.deleting} ${en.dataFrom} ${en.asyncstorage}: ${error.message}`;
  }
};
