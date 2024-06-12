import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import ContactUs from 'screens/Contact/Mail';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the ContactUs screen', () => {
  const expectedNameInput = 'Jorge';
  const expectedPhoneInput = '912642811';
  const expectedEmailInput = 'pleasego@gmail.com';
  const expectedMessageInput = 'Hello there, hope you are well';
  let renderedComponent = '';
  let sendButton = '';
  let nameInput = '';
  let phoneInput = '';
  let emailInput = '';
  let messageInput = '';
  let screen = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <ContactUs {...props} />;
    renderedComponent = render(componentToTest);
    act(() => {
      screen = renderedComponent.getByTestId('contactUs.viewContactUsWrapper');
      nameInput = renderedComponent.getByTestId('contactUs.userName');
      emailInput = renderedComponent.getByTestId('contactUs.email');
      phoneInput = renderedComponent.getByTestId('contactUs.userPhone');
      messageInput = renderedComponent.getByTestId('contactUs.message');
      sendButton = renderedComponent.getByTestId('contactUs.sendButton');
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered successfully', () => {
    expect(screen).not.toBeNull();
  });

  test('should the send button be disabled if the username, email, phone and message fields are empty', () => {
    expect(sendButton.props.accessibilityState.disabled).toBeTruthy();
    expect(sendButton.props.accessibilityState.disabled).not.toBeFalsy();
  });

  test('should the send button be enabled if username, phone, email and message field are filled', () => {
    expect(sendButton.props.accessibilityState.disabled).toBeTruthy();
    act(() => {
      fireEvent.changeText(nameInput, expectedNameInput);
      fireEvent.changeText(phoneInput, expectedPhoneInput);
      fireEvent.changeText(emailInput, expectedEmailInput);
      fireEvent.changeText(messageInput, expectedMessageInput);
    });
    expect(sendButton.props.accessibilityState.disabled).toBeFalsy();
  });
});
