import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import TextInfo from 'components/Texts/AccountDetails/TextInfo';

describe('All the tests related to the TextInfo component', () => {
  let renderedComponent = '';
  const expectedText = 'If you were so perfect';
  const expectedCustomStyle = { backgroundColor: 'red' };
  beforeEach(() => {
    const componentToTest = <TextInfo text={expectedText} customStyle={expectedCustomStyle} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.AccountDetails.TextInfo').props.children,
    ).toMatch(expectedText);
  });

  test('should render the passed customStyle as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.AccountDetails.TextInfo').props.style[1],
    ).toBeDefined();
    expect(
      renderedComponent.getByTestId('component.AccountDetails.TextInfo').props.style[1],
    ).toEqual(expectedCustomStyle);
  });
});
