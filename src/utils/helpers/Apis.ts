import { storePlaneObjectData } from 'utils/localStorage';

export const processLoginData = ({
  Data,
}: {
  Data: {
    BrokerID: string;
    AccountType: number;
    Spreads: { Pair: string; Pips: number; Size: number }[];
  };
}) => {
  const isCanadian = (Data.BrokerID.length !== 0 && Data.BrokerID === 'CAN') ?? false;
  if ((Data.AccountType == 2 || Data.AccountType == 4) && !isCanadian) {
    // let userChanged = false;
    //When the user changes, register again on fcm for notifications
    //var ConfigFCMStore = Ext.getStore('ConfigFCMStore');
    //If no configuration (1st time the app runs) ask receive notifications
    // if (ConfigFCMStore.getCount() > 0) {
    //     var currentUserStore = Ext.getStore('userStore');
    //     if (currentUserStore.getCount() > 0) {
    //         var clientID = currentUserStore.first().get("clientID");
    //         var userID = currentUserStore.first().get("userID");
    //         userChanged = clientID.toLowerCase() != params.ClientID.toLowerCase() || userID.toLowerCase() != params.UserID.toLowerCase() || ConfigFCMStore.first().get('FCM_ClientID').toLowerCase() != params.ClientID.toLowerCase()+'|'+params.UserID.toLowerCase();
    //         // Allways call register on login, to avoid missing registratons
    //         // When the user changed that will be dealt later
    //         if(!userChanged) {
    //             Ux.PushNotifications.Service.register(params.ClientID, params.UserID, ConfigFCMStore.first().get('FCM_receiveNotifications'), function(success) {});
    //         }
    //     }
    // }
    // var extraParams = {
    //     'SendPaymentAllowed': response.SendPaymentAllowed,
    //     'ForwardTradingAllowed': response.ForwardTradingAllowed,
    //     'TradingAllowed': response.TradingAllowed,
    //     'PINRequired': response.PINRequired,
    //     'PINDate': response.PINDate,
    //     'ClientID': params.ClientID,
    //     'UserID': params.UserID,
    //     'FavouriteCCYPairs': response.FavouriteCCYPairs,
    //     'AllowedCCYPairs': response.AllowedCCYPairs,
    //     'AccountType': response.AccountType,
    //     'AccountNumber': response.AccountNumber,
    //     'SimpleTradeScreen': response.SimpleTradeScreen,
    //     'UserIntent': EasyFX.Helpers.scrmble('v3ry5tr0ngph3r', credentials.password, 0),
    //     'AddressVerificationMode': response.AddressVerificationMode,
    //     'ThisUserApprovalLevel': response.ThisUserApprovalLevel
    // };
    // //invoke singned requests
    // that.invokeSignedRequests(extraParams, function(isSuccess) {
    //     if (isSuccess == true) {
    //         that.saveCurrentUserPermissionsToLocalStorage(response.Permissions);
    saveCurrentUserSpreadsToLocalStorage(Data.Spreads);
    //         //Force a touch after the login to restart the non touch security
    //         EasyFX.service.Listener.onTouchStart();
    //         that.defaultRedirectTo(response.MustChangePassword, params, credentials, userChanged);
    //     }
    // });
  }
};

const saveCurrentUserSpreadsToLocalStorage = async (
  spreads: { Pair: string; Pips: number; Size: number }[],
) => {
  interface Spread {
    Pair: string;
    Pips: number;
    Size: number;
  }
  interface FormattedSpread extends Spread {
    OriginalSize: number;
    UsedRatePair: string;
  }
  const formattedSpreads: FormattedSpread[] = [];

  spreads.map((element: Spread) =>
    formattedSpreads.push({
      Pair: element.Pair,
      Pips: element.Pips,
      Size: element.Size,
      OriginalSize: element.Size,
      UsedRatePair: 'USD',
    }),
  );
  await storePlaneObjectData('spreads', formattedSpreads);
};
