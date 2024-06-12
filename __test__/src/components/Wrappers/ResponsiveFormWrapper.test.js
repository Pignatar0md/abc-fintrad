import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import ResponsiveFormWrapper from 'components/Wrappers/ResponsiveFormWrapper';

describe('All the tests related to the ResponsiveFormWrapper', () => {
  let renderedComponent = '';
  const testID = 'wrapper';
  const expectedTextContent = 'Hi there';
  beforeEach(() => {
    const componentToTest = (
      <ResponsiveFormWrapper testId={testID}>
        <Text>{expectedTextContent}</Text>
      </ResponsiveFormWrapper>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should run the passed component as a prop', () => {
    const result = renderedComponent.getByTestId(testID).props.children.props.children;
    expect(result).toEqual(expectedTextContent);
    expect(result).not.toEqual('');
  });
});
