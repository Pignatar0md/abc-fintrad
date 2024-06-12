import { cleanup } from '@testing-library/react-native';
import { convertStr, trimStr } from 'utils/strings';

describe('All the test related to the strings.ts functions', () => {
  beforeEach(() => {
    cleanup();
  });

  test('should return a trimed string if we pass a string with spaces to the left and right', () => {
    const dirtyString = '  hey I have 2 spaces in front and a space at the end ';
    const cleanString = 'hey I have 2 spaces in front and a space at the end';
    const result = trimStr(dirtyString);
    expect(result).toMatch(cleanString);
  });

  test('should return a base64 string if we pass a utf8 string', () => {
    const utf8Str = 'hey how are you doing?';
    const base64Str = 'aGV5IGhvdyBhcmUgeW91IGRvaW5nPw==';
    const result = convertStr(utf8Str, 'utf8', 'base64');
    expect(result).toEqual(base64Str);
    expect(result).not.toEqual(utf8Str);
  });
});
