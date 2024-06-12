import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import BodyCell from 'components/Texts/Rates/BodyCell';

describe('All the tests related to the BodyCell component', () => {
  let renderedComponent = '';
  const expectedWrappedText = 'hii';
  const wrappedComponent = <Text>{expectedWrappedText}</Text>;
  const expectedSize = 'medium';
  const expectedColor = '#a4a4a4';
  const expectedAlignment = 'center';

  beforeEach(() => {
    const componentToTest = (
      <BodyCell size={expectedSize} color={expectedColor} alignment={expectedAlignment}>
        {wrappedComponent}
      </BodyCell>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the string the passed as a prop', () => {
    let componentToTest = (
      <BodyCell size={expectedSize} color={expectedColor}>
        {'hey hi'}
      </BodyCell>
    );
    renderedComponent = render(componentToTest);
    expect(renderedComponent.getByTestId('component.BodyCellString').props.children).toMatch(
      'hey hi',
    );
    expect(renderedComponent.getByTestId('component.BodyCellString').props.children).not.toMatch(
      'never say never',
    );
  });

  test('should render the element passed as a prop', () => {
    expect(renderedComponent.getByTestId('component.BodyCellView')).toBeDefined();
    expect(
      renderedComponent.getByTestId('component.BodyCellView').props.children.props.children,
    ).toMatch(expectedWrappedText);
  });

  test('should render the passed string size value as a prop', () => {
    let componentToTest = (
      <BodyCell size={expectedSize} color={expectedColor}>
        {'hey hi'}
      </BodyCell>
    );
    renderedComponent = render(componentToTest);
    expect(renderedComponent.getByTestId('component.BodyCellView').props.style[1].flex).toBe(2);
    expect(renderedComponent.getByTestId('component.BodyCellView').props.style[1].flex).not.toBe(1);
  });

  // test('should render the passed alignment string as a prop', () => {
  // });

  test('should render the passed color string as a prop', () => {
    let componentToTest = (
      <BodyCell size={expectedSize} color={expectedColor}>
        {'hey hi'}
      </BodyCell>
    );
    renderedComponent = render(componentToTest);
    expect(renderedComponent.getByTestId('component.BodyCellString').props.style[1].color).toMatch(
      expectedColor,
    );
    expect(
      renderedComponent.getByTestId('component.BodyCellString').props.style[1].color,
    ).not.toMatch('#ffffff');
  });
});
