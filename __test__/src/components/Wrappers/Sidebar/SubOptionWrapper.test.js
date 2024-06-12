import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import SubOptionWrapper from 'components/Wrappers/Sidebar/SubOptionWrapper';
import { Text } from 'react-native';

describe('All the tests related to the Cell component', () => {
  let renderedComponent = '';
  const testID = 'component.Wrappers.SubOptionWrapper';
  const expectedInfo = 'hii';
  const wrappedComponent = <Text>{expectedInfo}</Text>;

  beforeEach(() => {
    const componentToTest = <SubOptionWrapper>{wrappedComponent}</SubOptionWrapper>;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed string as a children component passed as a prop', () => {
    const unexpectedInfo = 'Lala la';
    expect(renderedComponent.getByTestId(testID).props.children.props.children).toMatch(
      expectedInfo,
    );
    expect(renderedComponent.getByTestId(testID).props.children.props.children).not.toMatch(
      unexpectedInfo,
    );
  });
});
