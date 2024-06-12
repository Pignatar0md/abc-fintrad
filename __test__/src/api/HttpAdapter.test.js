jest.mock('api/HttpAdapter', () => {
  return jest.fn().mockImplementation(() => {
    return {
      makeRequest: jest.fn(() => ({ data: { Succeeded: true, Data: { JWToken: 'abc' } } })),
    };
  });
});
const HttpMock = jest.fn((a, b) => ({ data: { Data: { JWToken: 'abc' } } }));
const loginRequestMock = jest.fn(HttpMock);

describe('All related tests with Http function', () => {
  test('should the function Http be called', async () => {
    await loginRequestMock({ a: 1, n: 2 });
    expect(HttpMock).toHaveBeenCalledTimes(1);
    expect(HttpMock).not.toHaveBeenCalledTimes(2);
  });

  test('should the function makeRequest be called', async () => {
    const result = await loginRequestMock({ a: 1, n: 2 });
    expect(result.data.Data.JWToken).toBe('abc');
    expect(result.data.Data.JWToken).not.toBe('lkjdaslkdjsal');
  });
});
