import {
  sendSMS,
  validateReceivedCode,
  validatePinLetter,
  checkAppVersion,
} from 'api/ValidationRequests';

const expectedCode = '561239';
const unexpectedCode = '313131';
const expectedMessage = 'invalid code';
const expectedPinLetter = '2921';

jest.mock('api/ValidationRequests', () => ({
  sendSMS: jest.fn(() => true),
  validateReceivedCode: jest.fn(({ code }) =>
    code === expectedCode ? { data: true } : { data: expectedMessage },
  ),
  validatePinLetter: jest.fn(({ pinLetter }) => (pinLetter === expectedPinLetter ? true : false)),
  checkAppVersion: jest.fn(({ version }) => (version > 4 ? true : false)),
}));

describe('All related tests with DeviceValidationRequests functions', () => {
  test('should the function sendSMS return true', async () => {
    const result = await sendSMS();
    expect(result).toBeTruthy();
    expect(result).not.toBeFalsy();
  });

  test('should the function validateReceivedCode return true', async () => {
    const result = await validateReceivedCode({ code: expectedCode });
    expect(result.data).toBeTruthy();
    expect(result.data).not.toBe(unexpectedCode);
  });

  test('should the function validateReceivedCode return error', async () => {
    const result = await validateReceivedCode({ code: unexpectedCode });
    expect(result.data).toMatch(expectedMessage);
    expect(result.data).not.toBe('abckd');
  });

  test('should the function validatePinLetter return true', async () => {
    const result = await validatePinLetter({ pinLetter: expectedPinLetter });
    expect(result).toBeTruthy();
  });

  test('should the function validatePinLetter return false', async () => {
    const result = await validatePinLetter({ pinLetter: '1111' });
    expect(result).toBeFalsy();
  });

  test('should the function checkAppVersion return true', async () => {
    const result = await checkAppVersion({ version: 5 });
    expect(result).toBeTruthy;
  });

  test('should the function checkAppVersion return false', async () => {
    const result = await checkAppVersion({ version: 1 });
    expect(result).toBeFalsy();
  });
});
