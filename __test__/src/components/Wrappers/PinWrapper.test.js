import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import PinWrapper from 'components/Wrappers/PinWrapper';
import { Text } from 'react-native';

describe('All the tests related to the PinWrapper component', () => {
  let renderedComponent = '';
  const testId = 'component.pinWrapper';
  const wrappedComponent = <Text>hii</Text>;
  beforeEach(() => {
    const componentToTest = (
      <PinWrapper testId={testId} background="light">
        {wrappedComponent}
      </PinWrapper>
    );
    renderedComponent = render(componentToTest);
  });
  afterEach(() => {
    cleanup();
  });

  test('should render the passed component as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.children).toBeDefined();
  });

  test('should render the passed background theme as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.style.backgroundColor).toEqual('#ffffff');
    expect(renderedComponent.getByTestId(testId).props.style.backgroundColor).not.toEqual(
      '#as23d2',
    );
  });
});
