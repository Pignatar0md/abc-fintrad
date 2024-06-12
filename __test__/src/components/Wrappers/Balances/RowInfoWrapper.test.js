import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import RowInfoWrapper from 'components/Table/RowInfoWrapper';

describe('All the tests related to the ParagraphWrapper component', () => {
  let renderedComponent = '';
  const expectedText = 'hey hi';
  const testId = 'component.Wrappers.RowInfoWrapper';

  beforeEach(() => {
    const componentToTest = (
      <RowInfoWrapper>
        <Text>{expectedText}</Text>
      </RowInfoWrapper>
    );
    renderedComponent = render(componentToTest);
  });
  afterEach(() => {
    cleanup();
  });

  test('should render the passed children as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.children).toBeDefined();
    expect(renderedComponent.getByTestId(testId).props.children.props.children).toEqual(
      expectedText,
    );
  });
});
