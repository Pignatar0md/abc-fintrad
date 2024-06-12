import { cleanup } from '@testing-library/react-native';
import {
  secureRemove,
  storePlaneStringData,
  storePlaneObjectData,
  getPlaneObjectData,
  getPlaneStringData,
  deletePlaneData,
} from 'utils/localStorage';

describe('All the tests related to the localStorage library functions', () => {
  const expectedkey = 'sensitivePassw';
  const unexpectedkey = 'asd';
  const expectedVal = '1aq234esdg5';
  const wrongExpectedVal = 12;
  const expectedErrorChunk = 'Error';
  const expectedObjkey = 'myObject';
  const expectedObjVal = { a: 'c', d: 'c' };
  const secureRemoveMock = jest.fn((key) => {
    return key === 'sensitivePassw' ? true : `...${expectedErrorChunk}...`;
  });
  const secureRetrieveMock = jest.fn((key) => {
    return key === 'sensitivePassw' ? expectedVal : `...${expectedErrorChunk}...`;
  });
  const secureStoreMock = jest.fn((key) => {
    return key === 'sensitivePassw' ? expectedVal : `...${expectedErrorChunk}...`;
  });
  const storePlaneStringDataMock = jest.fn((_, val) => {
    return typeof val !== 'string' ? `${expectedErrorChunk}` : true;
  });
  const storePlaneObjectDataMock = jest.fn((_, val) => {
    return typeof val !== 'object' ? `${expectedErrorChunk}` : true;
  });
  const deletePlaneStringDataMock = jest.fn((key) => {
    return key !== 'sensitivePassw' ? `${expectedErrorChunk}` : true;
  });

  afterEach(() => {
    cleanup();
  });

  test('should STORE in a secure way the passed STRING value', async () => {
    const res = await secureStoreMock(expectedkey, expectedVal);
    expect(res).toBeTruthy();
    expect(res).not.toBeFalsy();
  });

  test('should throw an ERROR MESSAGE if the passed STRING value to secure storing is not a string', async () => {
    const res = await secureStoreMock(expectedkey, wrongExpectedVal);
    expect(!!res).toBeTruthy();
    expect(res).not.toMatch(expectedErrorChunk);
  });

  test('should RETRIEVE in a secure way the previously stored STRING value', async () => {
    const retrievingRes = await secureRetrieveMock(expectedkey);
    expect(retrievingRes).toEqual(expectedVal);
    expect(!!retrievingRes).not.toBeFalsy();
  });

  test('should throw an ERROR MESSAGE if the passed KEY to RETRIEVING does not exist', async () => {
    const retrievingRes = await secureRetrieveMock(unexpectedkey);
    expect(retrievingRes).toMatch(expectedErrorChunk);
    expect(!!retrievingRes).not.toBeFalsy();
  });

  test('should REMOVE the secure stored STRING value linked to the passed key', async () => {
    const removingRes = await secureRemove(expectedkey);
    expect(removingRes).toBeTruthy();
    expect(removingRes).not.toBeFalsy();
  });

  test('should throw an ERROR MESSAGE if the passed KEY to secure REMOVING a stored value does not exists', async () => {
    const removingRes = await secureRemoveMock(unexpectedkey);
    expect(removingRes).toMatch(expectedErrorChunk);
    expect(!!removingRes).not.toBeFalsy();
  });

  test('should STORE in a plane way the passed STRING value', async () => {
    const planeStoringRes = await storePlaneStringData(expectedkey, expectedVal);
    expect(planeStoringRes).toBeTruthy();
    expect(planeStoringRes).not.toBeFalsy();
  });

  test('should throw an ERROR MESSAGE if the passed STRING value to plane STORING is not a string', async () => {
    const planeStoringRes = await storePlaneStringDataMock(expectedkey, wrongExpectedVal);
    expect(!!planeStoringRes).toBeTruthy();
    expect(planeStoringRes).toMatch(expectedErrorChunk);
  });

  test('should STORE in a plane way the passed OBJECT value', async () => {
    const planeObjStoringRes = await storePlaneObjectData(expectedObjkey, expectedObjVal);
    expect(planeObjStoringRes).toBeTruthy();
    expect(planeObjStoringRes).not.toBeFalsy();
  });

  test('should throw an ERROR MESSAGE if the passed OBJECT to plane STORING is not an object', async () => {
    const wrongExpectedObjVal = 'b';
    const planeObjStoringRes = await storePlaneObjectDataMock(expectedObjkey, wrongExpectedObjVal);
    expect(!!planeObjStoringRes).toBeTruthy();
    expect(planeObjStoringRes).toMatch(expectedErrorChunk);
  });

  test('should GET in a plane way the previously stored STRING value', async () => {
    const gettingPlaneRes = await getPlaneStringData(expectedkey);
    expect(gettingPlaneRes).toEqual(expectedVal);
    expect(!!gettingPlaneRes).not.toBeFalsy();
  });

  test('should GET NULL if the passed key to GETTING the plane STRING value does not exist', async () => {
    const gettingWrongPlaneRes = await getPlaneStringData(unexpectedkey);
    expect(gettingWrongPlaneRes).toBeNull();
    expect(gettingWrongPlaneRes).not.toBe(expectedVal);
  });

  test('should GET in a plane way the previously stored OBJECT value', async () => {
    const gettingPlaneRes = await getPlaneObjectData(expectedObjkey);
    expect(gettingPlaneRes).toEqual(expectedObjVal);
    expect(!!gettingPlaneRes).not.toBeFalsy();
  });

  test('should GET NULL if the passed key to GETTING the plane OBJECT value does not exist', async () => {
    const gettingWrongPlaneRes = await getPlaneObjectData(unexpectedkey);
    expect(gettingWrongPlaneRes).toBeNull();
    expect(gettingWrongPlaneRes).not.toBe(expectedVal);
  });

  test('should REMOVE the plane stored STRING value linked to the passed key', async () => {
    const removingRes = await deletePlaneData(expectedkey);
    expect(removingRes).toBeTruthy();
    expect(removingRes).not.toBeFalsy();
  });

  test('should GET NULL if the passed KEY to plane REMOVING a stored value does not exists', async () => {
    const removingRes = await deletePlaneStringDataMock(unexpectedkey);
    expect(removingRes).toMatch(expectedErrorChunk);
    expect(!!removingRes).not.toBeFalsy();
  });
});
