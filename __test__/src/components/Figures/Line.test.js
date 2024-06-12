import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Line from 'components/Figures/Line';

describe('All the tests related to the Line', () => {
  let renderedComponent = '';
  const testID = 'lineComponent';
  beforeEach(() => {
    const componentToTest = <Line />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render a line', () => {
    expect(renderedComponent.getByTestId(testID)).toBeDefined();
  });
});
