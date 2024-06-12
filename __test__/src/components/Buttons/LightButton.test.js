import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import LightButton from 'components/Buttons/LightButton';
import { colors } from 'styles/colors';

describe('All the tests related to the Button', () => {
  let renderedComponent = '';
  const testID = 'sendButton';
  const onPressMock = jest.fn();
  const expectedTextValue = 'Press me';
  const expectedDisabledValue = false;
  const expectedSize = 'big';
  const unexpectedSizeValue = '45%';

  beforeEach(() => {
    const componentToTest = (
      <LightButton
        testId={testID}
        onPress={onPressMock}
        text={expectedTextValue}
        disabled={expectedDisabledValue}
        size={expectedSize}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('should render the passed text value as a prop', () => {
    const unexpectedTextValue = 'login';
    const textValueNode = renderedComponent.getByTestId(testID).props.children[0].props.children;
    expect(textValueNode).toEqual(expectedTextValue);
    expect(textValueNode).not.toEqual('');
    expect(textValueNode).not.toEqual(unexpectedTextValue);
  });

  test('should render the passed disabled value as a prop', () => {
    const unexpectedDisabledValue = true;
    expect(renderedComponent.getByTestId(testID).props.accessibilityState.disabled).toEqual(
      expectedDisabledValue,
    );
    expect(renderedComponent.getByTestId(testID).props.accessibilityState.disabled).not.toEqual(
      unexpectedDisabledValue,
    );
  });

  test('should render the passed filled value as a prop', () => {
    const nodeColorProp = renderedComponent.getByTestId(testID).props.style.borderColor;
    expect(nodeColorProp).not.toEqual(colors.cyan.c950);
    expect(nodeColorProp).toEqual(colors.cyan.A800);
  });

  test('should run the passed onPress function as a prop if disabled is false', () => {
    act(() => {
      fireEvent.press(renderedComponent.getByTestId(testID));
    });
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
    act(() => {
      fireEvent.press(renderedComponent.getByTestId(testID));
    });
    expect(onPressMock.mock.calls.length).toBe(2);
    expect(onPressMock.mock.calls.length).not.toBe(3);
  });

  test('should run the passed onPress function as a prop if disabled is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <LightButton testId="abc" onPress={onPressMock} text={'hello'} disabled />,
    );
    act(() => {
      fireEvent.press(getByTestId('abc'));
    });
    expect(onPressMock).not.toHaveBeenCalled();
  });

  test('should render the passed size value as a prop', () => {
    const expectedSizeValue = '100%';
    const nodeColorProp = renderedComponent.getByTestId(testID).props.style.width;
    expect(nodeColorProp).not.toEqual(unexpectedSizeValue);
    expect(nodeColorProp).toEqual(expectedSizeValue);
  });
});
