import { loginRequest } from 'api/AuthRequests';

const expectedToken = 'k1bd9118x7a6f92lahfsa;5343h32adf=';
jest.mock('api/AuthRequests', () => ({
  loginRequest: jest.fn(() => ({ data: { Succeeded: true, Data: { JWToken: expectedToken } } })),
}));

describe('All related tests with loginRequest function', () => {
  test('should the function loginRequest return an authToken', async () => {
    const result = await loginRequest({ a: 1, n: 2 });
    expect(result.data.Data.JWToken).toBe(expectedToken);
    expect(result).not.toBe('acb');
  });
});
