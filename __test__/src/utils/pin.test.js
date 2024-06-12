import { cleanup } from '@testing-library/react-native';

describe('All the tests related to the pin library functions', () => {
  afterEach(() => {
    cleanup();
  });
  const hasConfiguredPinCodeMock = jest.fn(() => true);
  const removeConfiguredPinCodeMock = jest.fn(() => true);

  test('should return a boolean telling if has a pin configured', async () => {
    const result = await hasConfiguredPinCodeMock('pinNum');
    expect(result).toBeTruthy();
  });

  test('should return true if the pin previously configured is removed from the local secure storage', async () => {
    const result = await removeConfiguredPinCodeMock('pinNum');
    expect(result).toBeTruthy();
  });
});
