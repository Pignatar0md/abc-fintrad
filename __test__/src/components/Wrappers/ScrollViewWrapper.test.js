import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';

describe('All the tests related to the ScrollViewWrapper', () => {
  let renderedComponent = '';
  const testID = 'wrapper';
  const expectedTextContent = 'Left';
  beforeEach(() => {
    const componentToTest = (
      <ScrollViewWrapper testId={testID}>
        <Text>{expectedTextContent}</Text>
      </ScrollViewWrapper>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should run the passed component as a prop', () => {
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children,
    ).toEqual(expectedTextContent);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children,
    ).not.toEqual('');
  });
});
