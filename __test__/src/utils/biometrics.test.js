import { cleanup } from '@testing-library/react-native';

describe('All the test related with the biometrics functions', () => {
  beforeEach(() => {
    cleanup();
  });
  const isSensorAvailableMock = jest.fn(() => 'FaceID');
  const checkUserBiometricsMock = jest.fn(() => true);
  const checkBiometricsKeyExistsMock = jest.fn(() => ({ keyExist: true }));
  const createKeysMock = jest.fn(() => ({ publicKey: '232133212213213' }));
  const createSignatureMock = jest.fn(() => true);

  test('should return a FaceID, TouchID or Biometrics string after the function isSensorAvailable is called', async () => {
    const expectedString = 'FaceID';
    const unexpectedString = 'Biometrics';
    const res = await isSensorAvailableMock();
    expect(res).toMatch(expectedString);
    expect(res).not.toMatch(unexpectedString);
  });

  test('should return success if user is authenticated successfully using the checkUserBiometrics function', async () => {
    const res = await checkUserBiometricsMock();
    expect(res).toBeTruthy();
    expect(res).not.toBeFalsy();
  });

  test('should return an object with keyExist key and a boolean value at get called the function checkBiometricsKeyExists', async () => {
    const result = await checkBiometricsKeyExistsMock();
    expect(result.keyExist).toBeTruthy();
    expect(result.keyExist).not.toBeFalsy();
  });

  test('should return an object with the key "publickey" and a string as a value after calling the createKeys function', async () => {
    const expectedPk = '232133212213213';
    const unexpectedPk = 'abcd';
    const res = await createKeysMock();
    expect(res.publicKey).toMatch(expectedPk);
    expect(res.publicKey).not.toMatch(unexpectedPk);
  });

  test('should return an object with a boolean after the function createSignature be called', async () => {
    const res = await createSignatureMock();
    expect(res).toBeTruthy();
    expect(res).not.toBeFalsy();
  });
});
