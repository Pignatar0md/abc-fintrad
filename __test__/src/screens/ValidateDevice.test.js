import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import ValidateDevice from 'screens/Authenticated/ValidateDevice';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the Validate Device screen', () => {
  let renderedComponent = '';
  let validateButton = '';
  let textScreen = '';
  let codeInput = '';
  let screen = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <ValidateDevice {...props} />;
    renderedComponent = render(componentToTest);
    act(() => {
      screen = renderedComponent.getByTestId('validateDevice.wrapper');
      textScreen = renderedComponent.getByTestId('validateDevice.mainText');
      codeInput = renderedComponent.getByTestId('validateDevice.inputCode');
      validateButton = renderedComponent.getByTestId('validateDevice.validateButton');
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered successfully', () => {
    expect(screen).not.toBeNull();
  });

  test('should the screen show a text', () => {
    expect(textScreen.props.children).not.toBeNull();
    expect(textScreen.props.children).toMatch(/SmsSent/);
  });

  test('should the validate button be disabled if code is empty', () => {
    expect(validateButton.props.accessibilityState.disabled).toBeTruthy();
    expect(validateButton.props.accessibilityState.disabled).not.toBeFalsy();
  });

  test('should the validate button be enabled if code is NOT empty', () => {
    expect(validateButton.props.accessibilityState.disabled).toBeTruthy();
    expect(validateButton.props.accessibilityState.disabled).not.toBeFalsy();
    fireEvent.changeText(codeInput, '663491');
    expect(validateButton.props.accessibilityState.disabled).toBeFalsy();
    expect(validateButton.props.accessibilityState.disabled).not.toBeTruthy();
  });
});
