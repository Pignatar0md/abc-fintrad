import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from 'screens/Unauthenticated/Login';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the Login screen', () => {
  const expectedClientInput = 'efx1020';
  const expectedUserInput = 'pipo lo';
  const expectedPassInput = '12312312';
  let renderedComponent = '';
  let loginButton = '';
  let contactUsButton = '';
  let signUpButton = '';
  let clientIdInput = '';
  let userIdInput = '';
  let passwordInput = '';
  let contactUsIcon = '';
  let screen = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <Login {...props} />;
    renderedComponent = render(componentToTest);
    act(() => {
      screen = renderedComponent.getByTestId('login.viewWrapper');
      loginButton = renderedComponent.getByTestId('login.loginButton');
      clientIdInput = renderedComponent.getByTestId('login.clientId');
      userIdInput = renderedComponent.getByTestId('login.userId');
      passwordInput = renderedComponent.getByTestId('login.password');
      contactUsIcon = renderedComponent.getByTestId('login.contactUsIcon');
      contactUsButton = renderedComponent.getByTestId('login.contactUsIconButton');
      signUpButton = renderedComponent.getByTestId('login.signUpButton');
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered successfully', () => {
    expect(screen).not.toBeNull();
  });

  test('should the login button be disabled if clientid, userid and password are empty', () => {
    expect(loginButton.props.accessibilityState.disabled).toBeTruthy();
    expect(loginButton.props.accessibilityState.disabled).not.toBeFalsy();
  });

  test('should the login button be enabled if clientid, userid and password are filled', () => {
    expect(loginButton.props.accessibilityState.disabled).toBeTruthy();
    fireEvent.changeText(clientIdInput, expectedClientInput);
    fireEvent.changeText(userIdInput, expectedUserInput);
    fireEvent.changeText(passwordInput, expectedPassInput);
    expect(loginButton.props.accessibilityState.disabled).toBeFalsy();
  });

  test('should hide the top-right contact us button if the user enters some text in some textfields', async () => {
    expect(contactUsIcon.props.children).not.toBeNull();
    fireEvent.changeText(clientIdInput, expectedClientInput);
    await waitFor(() => {
      expect(renderedComponent.getByTestId('login.contactUsIconSpace')).toBeDefined();
    });
  });
});
