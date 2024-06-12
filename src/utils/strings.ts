import { Buffer } from 'buffer';

export const convertStr = (stringToFormat: string, formatFrom: 'utf8', formatTo: 'base64') =>
  Buffer.from(stringToFormat, formatFrom).toString(formatTo);

export const trimStr = (str: string): string => str.trim();

export const divideStringAtMiddle = (str: string) => {
  const length = str.length;
  const middle = Math.floor(length / 2);
  const firstHalf = str.substring(0, middle);
  const secondHalf = str.substring(middle);
  return `${firstHalf} ${secondHalf}`;
};
