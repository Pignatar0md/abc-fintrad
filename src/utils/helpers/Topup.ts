import { getCardList3DS, request3DSWindow } from 'api/3DsRequests';
import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { genericFn } from 'types/components';
import { getPlaneObjectData } from 'utils/localStorage';

export const handle3DsecureProcess = async ({
  cardID,
  cardCVV,
  baseCCY,
  orderNumber,
  amount,
  callback,
}: {
  cardID: number;
  cardCVV: string;
  baseCCY: string;
  orderNumber: number;
  amount: string;
  callback: genericFn;
}) => {
  const userInfo = await getPlaneObjectData('userDetails');

  await sendInfoLog({
    event: 'handle3DsecureProcess helper',
    detail: '3Dsecure Process start',
  });
  await sendInfoLog({
    event: 'handle3DsecureProcess helper',
    detail: 'getCardList3DS call start',
  });

  const response = await getCardList3DS(cardID);
  if (response?.data?.Succeeded) {
    await sendInfoLog({
      event: 'handle3DsecureProcess helper - getCardList3DS',
      detail: 'dataResponse. isSuccess: true',
    });
    const cardExpires =
      response?.data?.Data?.card.ExpiryDate.slice(2, 4) +
      response?.data?.Data?.card.ExpiryDate.ExpiryDate.slice(0, 2);
    let card3DS = {
      TotalAmount: amount,
      CCY: baseCCY,
      CardCVV: cardCVV,
      CardExpiration: cardExpires,
      AcceptHeader: '*/*',
      JavaEnabled: false,
      JavascriptEnabled: true,
      TimeZone: new Date().getTimezoneOffset(),
      CardholderName: response?.data?.Data?.card.Name,
      CardPan: response?.data?.Data?.card.CardNumber,
      ClientID: `${userInfo.ClientID} | ${userInfo.UserID}`,
      // Language: navigator.language, //====
      // ScreenHeight: screen.availHeight,
      // ScreenWidth: screen.availWidth,
      // UserAgent: navigator.userAgent,
      // ColorDepth: screen.colorDepth,
      // SystemName: Config.app.LIVE ? Config.d3DSecure.APP : 'EasyFX', //====
    };
    await sendInfoLog({
      event: 'Topup 3DS',
      detail: 'requestWindow call start',
    });
    const requestWindowResponse = await request3DSWindow();
    if (requestWindowResponse?.Success && !requestWindowResponse?.Data?.Rejected) {
      // let ctnConfCard = view.down('#step3-content');
      // let lblTopupStep3Title = view.down('#topup__step3__card_title');
      // let confirmCardButtonNext = that.getConfirmCardButtonNext();
      // let contIframe3dsBankForm = view.down('#contIframe3dsBankForm');
      // let iframeHeight = Ext.getBody().getSize().height - 310;
      // let contIframe = contIframe3dsBankForm.getAt(1);
      await sendInfoLog({
        event: 'Topup - request3DSWindow',
        detail:
          'requestWindow ISOResponseCode: ' + requestWindowResponse?.data?.Data?.ISOResponseCode,
      });
      if (requestWindowResponse?.data?.Data?.ISOResponseCode == '3D0') {
        //continue HERE
      }
    }
  } else {
    sendErrorLog({
      event: 'handle3DsecureProcess helper - getCardList3DS',
      detail: response?.toString(),
    });
  }
};
