import { MktOptions } from './screens';

export interface LogDebug {
  Device: string;
  SystemVersion: string;
  LogMsg: string;
}

export interface LogInfo {
  ClientID: string;
  UserID: string;
  Device: string;
  SystemVersion: string;
  LogMsg: string;
}

export interface LogWarning {
  Request: string;
  ShortLog: string;
  ClientID: string;
  UserID: string;
  Device: string;
  SystemVersion: string;
  LogMsg: string;
}

export interface LogHack {
  Request: string;
  ShortLog: string;
  ClientID: string;
  UserID: string;
  Device: string;
  SystemVersion: string;
  LogMsg: string;
}

export interface LogError {
  DeviceType: string;
  DevicePlatform: string;
  DeviceModel: string;
  DeviceVersion: string;
  DeviceUuid: string;
  NavigatorUserAgent: string;
  Request: string;
  ShortLog: string;
  ClientID: string;
  UserID: string;
  Device: string;
  SystemVersion: string;
  LogMsg: string;
}

export interface CommunicationOptions extends MktOptions {
  mailMarketReports: boolean;
}
