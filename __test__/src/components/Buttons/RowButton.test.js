import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react-native';
import RowButton from 'components/Buttons/Balances/RowButton';
import { Text } from 'react-native';

describe('All the tests related to the RowButton component', () => {
  let renderedComponent = '';
  const onPressMock = jest.fn();
  const expectedText = 'hey hello';
  const expectedChildren = <Text>{expectedText}</Text>;
  const expectedIdValue = '1';
  const expectedPressedValue = '2';
  const testID = 'component.Balances.RowButton';
  beforeEach(() => {
    const componentToTest = (
      <RowButton pressed={expectedPressedValue} id={expectedIdValue} onPress={onPressMock}>
        {expectedChildren}
      </RowButton>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should remder the children as a prop', () => {
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).toMatch(
      expectedText,
    );
  });

  test('should apply the passed pressed value as a prop', () => {
    expect(renderedComponent.getByTestId(testID).props.style[1].height).toEqual(50);
    const componentToTest2 = (
      <RowButton pressed={'1'} id={expectedIdValue} onPress={onPressMock}>
        {expectedChildren}
      </RowButton>
    );
    const renderedComponent2 = render(componentToTest2);
    expect(renderedComponent2.getByTestId(testID).props.style[1].height).toEqual(150);
  });

  test('should apply the passed id value as a prop', () => {
    expect(renderedComponent.getByTestId(testID).props.style[1].height).toEqual(50);
    const componentToTest2 = (
      <RowButton pressed={expectedPressedValue} id={'2'} onPress={onPressMock}>
        {expectedChildren}
      </RowButton>
    );
    const renderedComponent2 = render(componentToTest2);
    expect(renderedComponent2.getByTestId(testID).props.style[1].height).toEqual(150);
  });

  test('should run the passed function as a prop', () => {
    fireEvent.press(renderedComponent.getByTestId(testID));
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
  });
});
