import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import SubOptionDecoration from 'components/Figures/SubOptionDecoration';

describe('All the tests related to the SubOptionDecoration component', () => {
  let renderedComponent = '';
  const testID = 'component.optionDecorator';

  beforeEach(() => {
    const componentToTest = <SubOptionDecoration />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render a SubOption Decoration vertical line', () => {
    expect(renderedComponent.getByTestId(testID)).toBeDefined();
  });
});
