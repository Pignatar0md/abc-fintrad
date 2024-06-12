import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Legend from 'components/Texts/Legend';

describe('All the tests related to the Legend component', () => {
  let renderedComponent = '';
  const testID = 'theLegend';
  const expectedText = 'Hey hi';

  beforeEach(() => {
    const componentToTest = <Legend testId={testID}>{expectedText}</Legend>;
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
