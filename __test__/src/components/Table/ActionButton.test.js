import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react-native';
import ActionButton from 'components/Table/ActionButton';

describe('All the tests related to the ActionButton component', () => {
  let renderedComponent = '';
  const onPressMock = jest.fn();
  const expectedText = 'hey hello';
  const testId = 'component.Balances.ActionButton';
  const expectedCustomStyle = { color: 'red' };

  beforeEach(() => {
    const componentToTest = (
      <ActionButton
        customStyle={expectedCustomStyle}
        onPress={onPressMock}
        buttonText={expectedText}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.children[0].props.children).toMatch(
      expectedText,
    );
  });

  test('should run the passed function as a prop', () => {
    fireEvent.press(renderedComponent.getByTestId(testId));
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
  });
  test('should apply the passed customStyle as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.style.color).toBeDefined();
    expect(renderedComponent.getByTestId(testId).props.style.color).toMatch('red');
  });
});
