import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import ContentSection from 'components/Texts/ContentSection';

describe('All the tests related to the LabelField', () => {
  let renderedComponent = '';
  const expectedTextResult = 'enter your alias';

  beforeEach(() => {
    const componentToTest = <ContentSection text={expectedTextResult} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    const unexpectedTextResult = 'Hi I am Amber';
    expect(renderedComponent.getByTestId('component.ContentSection').props.children).toEqual(
      expectedTextResult,
    );
    expect(renderedComponent.getByTestId('component.ContentSection').props.children).not.toEqual(
      unexpectedTextResult,
    );
  });
});
