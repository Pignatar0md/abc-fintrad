import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import LoadingIndicator from 'components/LoadingIndicator';

describe('All the tests related to the Button', () => {
  let renderedComponent = '';
  const testID = 'loading';
  const expectedSize = 'large';
  beforeEach(() => {
    const componentToTest = <LoadingIndicator testId={testID} size={expectedSize} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed size value as a prop', () => {
    const unexpectedSize = 'small';
    expect(renderedComponent.getByTestId(testID).props.children.props.size).toMatch(expectedSize);
    expect(renderedComponent.getByTestId(testID).props.children.props.size).not.toMatch(
      unexpectedSize,
    );
  });
});
