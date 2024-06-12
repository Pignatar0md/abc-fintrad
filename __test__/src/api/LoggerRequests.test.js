import { sendDebugLog, sendInfoLog, sendWarningLog, sendErrorLog } from 'api/LoggerRequests';

jest.mock('api/LoggerRequests', () => ({
  sendDebugLog: jest.fn(() => ({})),
  sendInfoLog: jest.fn(() => ({})),
  sendWarningLog: jest.fn(() => ({})),
  sendErrorLog: jest.fn(() => ({})),
}));

describe('All related tests with LoggerRequests functions', () => {
  test('should the function sendDebugLog be called', async () => {
    await sendDebugLog({ event: 'fakeEvt' });
    expect(sendDebugLog).toHaveBeenCalled();
  });

  test('should the function sendErrorLog be called', async () => {
    await sendErrorLog({ event: 'fakeEvt' });
    expect(sendErrorLog).toHaveBeenCalled();
  });

  test('should the function sendInfoLog be called', async () => {
    await sendInfoLog({ event: 'fakeEvt' });
    expect(sendInfoLog).toHaveBeenCalled();
  });

  test('should the function sendWarningLog be called', async () => {
    await sendWarningLog({ event: 'fakeEvt' });
    expect(sendWarningLog).toHaveBeenCalled();
  });
});
