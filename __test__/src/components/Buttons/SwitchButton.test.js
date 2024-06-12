import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react-native';
import SwitchButton from 'components/Buttons/SwitchButton';

describe('All the tests related to the IconButton', () => {
  let renderedComponent = '';
  const testID = 'switchButton';
  const onValueChangeMock = jest.fn();
  const expectedValue = true;

  beforeEach(() => {
    const componentToTest = (
      <SwitchButton
        testId={testID}
        onValueChange={() => onValueChangeMock(expectedValue)}
        value={expectedValue}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed initial value as a prop', () => {
    expect(renderedComponent.getByTestId(testID).props.value).toBeTruthy();
    expect(renderedComponent.getByTestId(testID).props.value).not.toBeFalsy();
  });

  test('should run the passed function as an onValueChange prop', () => {
    fireEvent(renderedComponent.getByTestId(testID), 'onValueChange', false);
    expect(onValueChangeMock).toHaveBeenCalled();
  });
});
