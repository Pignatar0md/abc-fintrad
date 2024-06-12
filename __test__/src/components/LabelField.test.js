import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import LabelField from 'components/LabelField';

describe('All the tests related to the LabelField', () => {
  let renderedComponent = '';
  const testID = 'testLabel';
  const expectedTextResult = 'enter your alias';
  const expectedCustomStyleResult = { backgroundColor: 'red' };

  beforeEach(() => {
    const componentToTest = (
      <LabelField
        testId={testID}
        text={expectedTextResult}
        customStyle={expectedCustomStyleResult}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    const unexpectedTextResult = 'Hi I am Amber';
    expect(renderedComponent.getByTestId(testID).props.children).toEqual(expectedTextResult);
    expect(renderedComponent.getByTestId(testID).props.children).not.toEqual(unexpectedTextResult);
    expect(renderedComponent.getByTestId(testID).props.children).not.toEqual('');
  });

  test('should render the passed custom style as a prop', () => {
    const unexpectedCustomStyleResult = { fontWeight: '600' };
    expect(renderedComponent.getByTestId(testID).props.style[1]).toMatchObject(
      expectedCustomStyleResult,
    );
    expect(renderedComponent.getByTestId(testID).props.style[1]).not.toMatchObject(
      unexpectedCustomStyleResult,
    );
    expect(renderedComponent.getByTestId(testID).props.style[1]).not.toMatchObject({ a: 'n' });
  });
});
