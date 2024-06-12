import { VFX_API_URLS } from 'utils/urls';
import { MESSAGE_PASSWORD, MESSAGE_USER } from '@env';
import Http from './HttpAdapter';
import { InputUserToContactUs } from 'types/screens';
import { SYSTEM_NAME } from 'utils/static';
import { convertStr, trimStr } from 'utils/strings';
import { basicHeaders } from './static';

export const sendEmail = async ({
  userName,
  userPhone,
  userEmail,
  message,
}: InputUserToContactUs) => {
  const HttpAdapter = new Http('message');
  const data = {
    DepartmentName: 'Support',
    Subject: 'Contact me - VFX Mobile',
    Body: `<b>Name:</b>${trimStr(userName)}<br><b>Email:</b>${userEmail}<br><b>Phone:</b>${trimStr(
      userPhone,
    )}<br><b>Message:</b>${trimStr(message)}`,
    SystemName: SYSTEM_NAME,
    IsBodyHTML: true,
    SenderEmail: 'Mobile',
  };
  const base64Str = convertStr(`${MESSAGE_USER}:${MESSAGE_PASSWORD}`, 'utf8', 'base64');
  const response = await HttpAdapter.makeRequest({
    data: JSON.stringify(data),
    method: 'POST',
    url: VFX_API_URLS.sendMessage,
    headers: {
      Authorization: `Basic ${base64Str}`,
      ...basicHeaders,
    },
  });
  return response;
};
