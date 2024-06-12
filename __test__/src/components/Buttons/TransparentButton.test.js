import React from 'react';
import { Text } from 'react-native';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import TransparentButton from 'components/Buttons/TransparentButton';

describe('All the tests related to the IconButton', () => {
  let renderedComponent = '';
  const expectedOptSelectedVal = true;
  const testID = 'transpButton';
  const onPressMock = jest.fn();
  const expectedTextValue = 'Hi there';
  beforeEach(() => {
    const componentToTest = (
      <TransparentButton
        testId={testID}
        onPress={onPressMock}
        optionSelected={expectedOptSelectedVal}>
        <Text>{expectedTextValue}</Text>
      </TransparentButton>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed children component as a prop', () => {
    const unexpectedTextValue = 'abcd';
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).toMatch(
      expectedTextValue,
    );
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).not.toMatch(
      unexpectedTextValue,
    );
  });

  test('should run the passed as a prop function', () => {
    fireEvent.press(renderedComponent.getByTestId(testID));
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
  });

  test('should render the right style if optionSelected value passed as a prop is true', () => {
    expect(renderedComponent.getByTestId(testID).props.style.backgroundColor).toMatch('#eeeeee');
  });

  test('should render the right style if optionSelected value passed as a prop is false', () => {
    const unexpectedOptSelectedVal = false;
    const { getByTestId } = render(
      <TransparentButton
        testId={'tbutton'}
        onPress={onPressMock}
        optionSelected={unexpectedOptSelectedVal}>
        <Text>{expectedTextValue}</Text>
      </TransparentButton>,
    );
    expect(getByTestId('tbutton').props.style.backgroundColor).not.toBeDefined();
  });
});
