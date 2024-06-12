import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Cell from 'components/Table/Cell';

describe('All the tests related to the Cell component', () => {
  let renderedComponent = '';
  const testID = 'component.Balances.Cell';
  const expectedText = 'Hey hi';

  beforeEach(() => {
    const componentToTest = <Cell info={expectedText} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    const unexpectedText = 'Hi I am Amber';
    expect(renderedComponent.getByTestId(testID).props.children).toEqual(expectedText);
    expect(renderedComponent.getByTestId(testID).props.children).not.toEqual(unexpectedText);
  });
});
