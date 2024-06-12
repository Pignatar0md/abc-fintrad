import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import Row from 'components/Table/Beneficiaries/Row';

describe('All the tests related to the Row component', () => {
  let renderedComponent = '';
  const testId = 'myGreatRow';
  const wrappedComponent = <Text>hii</Text>;
  beforeEach(() => {
    const componentToTest = (
      <Row testId={testId} id={0}>
        {wrappedComponent}
      </Row>
    );
    renderedComponent = render(componentToTest);
  });
  afterEach(() => {
    cleanup();
  });

  test('should render the passed children as a prop', () => {
    expect(renderedComponent.getByTestId(testId).props.children).toBeDefined();
    expect(renderedComponent.getByTestId(testId).props.children.props.children).toMatch('hii');
  });

  test('should render white as backgroundColor', () => {
    expect(renderedComponent.getByTestId(testId).props.style.backgroundColor).toMatch('#ffffff');
  });
});
