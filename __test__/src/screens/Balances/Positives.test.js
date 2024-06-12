import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Positives from 'screens/Authenticated/Balances/Positives';
import { createTestProps } from '../../../testHelpers';

describe('All the tests related to the Positives screen', () => {
  let renderedComponent = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <Positives {...props} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered', () => {
    expect(renderedComponent.getByTestId('positives.flatList')).toBeDefined();
  });
});
