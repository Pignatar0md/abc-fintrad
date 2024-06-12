import {
  DSECURE_URL,
  DSECURE_USER,
  DSECURE_PASSWORD,
  DSECURE_CHALLENGE_REQUEST_INTERVAL,
  DSECURE_CHALLENGE_TIMEOUT,
} from '@env';
import { convertStr } from 'utils/strings';
import { Card3DS } from 'types/api';
import axios from 'axios';
import moment from 'moment';
import { genericFn } from 'types/components';

const base64Str = convertStr(`${DSECURE_USER}:${DSECURE_PASSWORD}`, 'utf8', 'base64');

export const getCardList3DS = async (cardID: string) => {
  console.log(cardID);
  return await 3;
};

export const request3DSWindow = async (Card3DS: Card3DS) => {
  const response = await axios.post(`${DSECURE_URL}RequestWindow`, Card3DS, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Basic ${base64Str}`,
    },
  });
  return response;
};

export const validate3DSChallenge = async (
  ID: string,
  startDate: moment.Moment,
  callbackSuccess: genericFn,
  callbackError: (q: string) => void,
  callbackStatusTwo: (q: string) => void,
) => {
  const timeInit = moment();
  const timeLimit = startDate.clone().add(DSECURE_CHALLENGE_TIMEOUT, 'minutes');
  if (timeInit > timeLimit) {
    callbackError('Timed Out! Please try again.');
  } else {
    const response = await axios.post(
      `${DSECURE_URL}ValidateChalenge`,
      { TransactionIdentifier: ID },
      {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          Authorization: `Basic ${base64Str}`,
        },
      },
    );
    if (response.data.Data.ChalengeStatus === 1) {
      if (!response.data.Data.Rejected) {
        callbackSuccess();
      } else {
        const errorMsg = response.data.Data.StatusReason
          ? response.data.Data.StatusReason.toString()
          : 'We are unable to validate your card. Please contact Customer Support.';
        callbackError(errorMsg);
      }
    } else if (response.data.Data.ChalengeStatus === 0) {
      setTimeout(
        () =>
          validate3DSChallenge(ID, startDate, callbackSuccess, callbackError, callbackStatusTwo),
        Number(DSECURE_CHALLENGE_REQUEST_INTERVAL),
      );
    } else if (response.data.Data.ChalengeStatus === 2) {
      callbackStatusTwo(response.data.Data.iFrame);
      setTimeout(
        () =>
          validate3DSChallenge(ID, startDate, callbackSuccess, callbackError, callbackStatusTwo),
        Number(DSECURE_CHALLENGE_REQUEST_INTERVAL),
      );
    }
  }
};
