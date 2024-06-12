import { cleanup, render } from '@testing-library/react-native';
import {
  checkLoginTextInputError,
  checkContactUsTextInputError,
  isValidEmail,
  renderTextAreaInput,
  renderTextInput,
} from 'utils/forms';

describe('All the tests related to the forms library functions', () => {
  const loginErrors = { password: 'pass shoud not be empty', userId: '' };
  const contactusErrors = { message: 'messageshoud not be empty', name: '' };
  const loginKey = 'password';
  const contactusKey = 'message';
  const expectedResultStyle = { borderWidth: 1, borderColor: '#d32f2f' };
  const loginNotFoundKey = 'userId';
  const contactusNotFoundKey = 'userId';
  afterEach(() => {
    cleanup();
  });

  test('should return the STYLE if the key DOES exists in the  Login errors array', () => {
    const result = checkLoginTextInputError(loginErrors, loginKey);
    expect(result).toEqual(expectedResultStyle);
    expect(result).not.toBeNull();
  });

  test('should return NULL if the key oes NOT exists in the Login errors array', () => {
    const result = checkLoginTextInputError(loginErrors, loginNotFoundKey);
    expect(result).toBeNull();
    expect(result).not.toEqual(expectedResultStyle);
  });

  test('should return the STYLE if the key DOES exists in the ContactUs errors array', () => {
    const result = checkContactUsTextInputError(contactusErrors, contactusKey);
    expect(result).toEqual(expectedResultStyle);
    expect(result).not.toBeNull();
  });

  test('should return UNDEFINED if the key does NOT exists in the ContactUs errors array', () => {
    const result = checkContactUsTextInputError(contactusErrors, contactusNotFoundKey);
    expect(result).toBeUndefined();
    expect(result).not.toEqual(expectedResultStyle);
  });

  test('should return the customStyle if the key does NOT exists in the ContactUs errors array but a custom style were passed as a prop', () => {
    const expectedCustomResultStyle = { color: 'black' };
    const result = checkContactUsTextInputError(
      contactusErrors,
      contactusNotFoundKey,
      expectedCustomResultStyle,
    );
    expect(result).toBe(expectedCustomResultStyle);
    expect(result).not.toBeUndefined();
  });

  test('should return true if it was passed a valid email or false if it is not valid', () => {
    const validEmail = 'asdkla@gmail.com';
    const INvalidEmail = 'asdasd$hotmail,com';
    const firstIsValid = isValidEmail(validEmail);
    const secondIsValid = isValidEmail(INvalidEmail);
    expect(firstIsValid).toBeTruthy();
    expect(secondIsValid).toBeFalsy();
  });

  test('should render a textField', () => {
    const textInput = renderTextInput({
      value: '',
      onChange: () => 'abc',
      placeHolder: 'exClientId',
      label: 'clientId',
      wrapperStyle: checkLoginTextInputError(loginErrors, 'clientId'),
      testId: 'mima.clientId',
      keyboardType: 'default',
    });
    const { getByTestId } = render(textInput);
    expect(getByTestId('mima.clientId')).toBeDefined();
  });

  test('should render a textAreaField', () => {
    const textInput = renderTextAreaInput({
      value: '',
      onChange: () => 'abc',
      placeHolder: 'hola',
      label: 'message',
      wrapperStyle: checkLoginTextInputError(loginErrors, 'message'),
      testId: 'mima.clientId',
      keyboardType: 'default',
      multiline: true,
      numOfLines: 4,
    });
    const { getByTestId } = render(textInput);
    expect(getByTestId('mima.clientId')).toBeDefined();
  });
});
