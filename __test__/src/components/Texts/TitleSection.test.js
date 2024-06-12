import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import TitleSection from 'components/Texts/TitleSection';

describe('All the tests related to the TitleSection component', () => {
  let renderedComponent = '';
  const expectedTitle = 'The title';
  const unexpectedTitle = 'Not bad';

  beforeEach(() => {
    const componentToTest = <TitleSection title={expectedTitle} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed title as a prop', () => {
    expect(renderedComponent.getByTestId('component.TitleSection').props.children).toMatch(
      expectedTitle,
    );
    expect(renderedComponent.getByTestId('component.TitleSection').props.children).not.toMatch(
      unexpectedTitle,
    );
  });
});
