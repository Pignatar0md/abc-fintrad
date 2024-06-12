import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import LinkButton from 'components/Buttons/LinkButton';

describe('All the tests related to the Button', () => {
  let renderedComponent = '';
  const testID = 'linkButton';
  const onPressMock = jest.fn();
  const expectedTextValue = 'Press me';
  beforeEach(() => {
    const componentToTest = (
      <LinkButton testId={testID} text={expectedTextValue} onPress={onPressMock} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text value as a prop', () => {
    const unexpectedTextValue = 'Go to the..';
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).toEqual(
      expectedTextValue,
    );
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).not.toEqual('');
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).not.toEqual(
      unexpectedTextValue,
    );
  });

  test('should run the passed onPress function as a prop', () => {
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
});
