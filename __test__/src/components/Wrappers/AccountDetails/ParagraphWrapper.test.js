import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import ParagraphWrapper from 'components/Wrappers/AccountDetails/ParagraphWrapper';

describe('All the tests related to the ParagraphWrapper component', () => {
  let renderedComponent = '';
  const expectedText = 'hey hi';
  beforeEach(() => {
    const componentToTest = (
      <ParagraphWrapper customStyle={{ flex: 1 }}>
        <Text>{expectedText}</Text>
      </ParagraphWrapper>
    );
    renderedComponent = render(componentToTest);
  });
  afterEach(() => {
    cleanup();
  });

  test('should render the passed customStyle as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.AccountDetails.ParagraphWrapper').props.style[1],
    ).toBeDefined();
    expect(
      renderedComponent.getByTestId('component.AccountDetails.ParagraphWrapper').props.style[1],
    ).toEqual({ flex: 1 });
  });

  test('should render the passed children as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.AccountDetails.ParagraphWrapper').props.children,
    ).toBeDefined();
    expect(
      renderedComponent.getByTestId('component.AccountDetails.ParagraphWrapper').props.children
        .props.children,
    ).toEqual(expectedText);
  });
});
