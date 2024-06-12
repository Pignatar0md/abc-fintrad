import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import ActiveOption from 'components/Texts/ActiveOption';
import { Text } from 'react-native';

describe('All the tests related to the ActiveOption component', () => {
  let renderedComponent = '';
  const wrappedComponent = <Text>hey hi</Text>;

  beforeEach(() => {
    const componentToTest = <ActiveOption>{wrappedComponent}</ActiveOption>;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed component as a children type prop', () => {
    expect(renderedComponent.getByTestId('component.activeOption').props.children).toBeDefined();
  });
});
