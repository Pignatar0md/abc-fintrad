import { sendEmail } from 'api/ContactUsRequests';

const expectedResponse = { data: { Success: true } };
jest.mock('api/ContactUsRequests', () => ({ sendEmail: jest.fn(() => expectedResponse) }));

describe('All related tests with loginRequest function', () => {
  test('should the function loginRequest return an authToken', async () => {
    const response = await sendEmail({ a: 1, n: 2 });
    expect(response.data.Success).toBeTruthy();
    expect(response.data.Success).not.toBeFalsy();
  });
});
