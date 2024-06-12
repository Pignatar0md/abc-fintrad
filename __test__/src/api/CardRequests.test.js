import {
  makeCcyCardRequest,
  cancelCcyCardRequest,
  blockCcyCardRequest,
  unblockCcyCardRequest,
  getCcyCardPINRequest,
  activateCcyCardRequest,
  updateCcyCardMobileNumber,
} from 'api/CardRequests';

jest.mock('api/CardRequests', () => ({
  makeCcyCardRequest: jest.fn(() => ({ data: { Succeeded: true } })),
  cancelCcyCardRequest: jest.fn(() => ({ data: { Succeeded: true } })),
  blockCcyCardRequest: jest.fn(() => ({ data: { Succeeded: true } })),
  unblockCcyCardRequest: jest.fn(() => ({ data: { Succeeded: true } })),
  getCcyCardPINRequest: jest.fn(() => ({ data: { Data: { pin: '1636' } } })),
  activateCcyCardRequest: jest.fn(() => ({ data: { Succeeded: true } })),
  updateCcyCardMobileNumber: jest.fn(() => ({ data: { Succeeded: true } })),
}));

describe('All related tests with CardRequests functions', () => {
  test('should the function makeCcyCardRequest be called', async () => {
    const response = await makeCcyCardRequest({ event: 'fakeEvt' });
    expect(makeCcyCardRequest).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });

  test('should the function cancelCcyCardRequest be called', async () => {
    const response = await cancelCcyCardRequest({ event: 'fakeEvt' });
    expect(cancelCcyCardRequest).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });

  test('should the function blockCcyCardRequest be called', async () => {
    const response = await blockCcyCardRequest({ event: 'fakeEvt' });
    expect(blockCcyCardRequest).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });

  test('should the function unblockCcyCardRequest be called', async () => {
    const response = await unblockCcyCardRequest({ event: 'fakeEvt' });
    expect(unblockCcyCardRequest).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });

  test('should the function getCcyCardPINRequest be called', async () => {
    const response = await getCcyCardPINRequest({ event: 'fakeEvt' });
    expect(getCcyCardPINRequest).toHaveBeenCalled();
    expect(response.data.Data.pin).toEqual('1636');
  });

  test('should the function activateCcyCardRequest be called', async () => {
    const response = await activateCcyCardRequest({ event: 'fakeEvt' });
    expect(activateCcyCardRequest).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });

  test('should the function updateCcyCardMobileNumber be called', async () => {
    const response = await updateCcyCardMobileNumber({ event: 'fakeEvt' });
    expect(updateCcyCardMobileNumber).toHaveBeenCalled();
    expect(response.data.Succeeded).toBeTruthy();
  });
});
