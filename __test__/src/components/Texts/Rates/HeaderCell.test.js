import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import HeaderCell from 'components/Texts/Rates/HeaderCell';

describe('All the tests related to the HeaderCell component', () => {
  let renderedComponent = '';
  let componentToTest;
  const expectedFlexVal = 2;
  const expectedAlignment = 'center';
  const expectedText = 'ccy';
  beforeEach(() => {
    componentToTest = (
      <HeaderCell flex={expectedFlexVal} align={expectedAlignment} text={expectedText} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render id the passed flex value as a prop', () => {
    expect(renderedComponent.getByTestId('component.HeaderCell').props.style[1].flex).toBe(2);
    expect(renderedComponent.getByTestId('component.HeaderCell').props.style[1].flex).not.toBe(0);
  });

  test('should render id the passed text value as a prop', () => {
    expect(renderedComponent.getByTestId('component.HeaderCell').props.children).toMatch(
      expectedText,
    );
    expect(renderedComponent.getByTestId('component.HeaderCell').props.children).not.toMatch('abc');
  });

  test('should render id the passed align string as a prop', () => {
    expect(
      renderedComponent.getByTestId('component.HeaderCell').props.style[1].textAlign,
    ).not.toMatch('left');
    expect(renderedComponent.getByTestId('component.HeaderCell').props.style[1].textAlign).toMatch(
      expectedAlignment,
    );
  });
});
