import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import TextLegend from 'components/Texts/AccountDetails/TextLegend';

describe('All the tests related to the Legend component', () => {
  let renderedComponent = '';
  const expectedText = 'Asspera hiems synfonia';
  beforeEach(() => {
    const componentToTest = <TextLegend text={expectedText} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });
  test('should render the passed text as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.AccountDetails.TextLegend').props.children,
    ).toMatch(expectedText);
  });
});
