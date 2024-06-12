import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Row from 'components/Table/Rates/Row';
import { Text } from 'react-native';

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

  test('should render id the passed id as a prop by changing the backgroundColor', () => {
    expect(renderedComponent.getByTestId(testId).props.style[1].backgroundColor).toMatch('#F9F9F9');
    let otherRenderedComponent = render(
      <Row testId="otherTestId" id={1}>
        {wrappedComponent}
      </Row>,
    );
    expect(
      otherRenderedComponent.getByTestId('otherTestId').props.style[1].backgroundColor,
    ).not.toMatch('#F9F9F9');
    expect(
      otherRenderedComponent.getByTestId('otherTestId').props.style[1].backgroundColor,
    ).toMatch(/#ffffff/);
  });
});
