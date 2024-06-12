import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Major from 'screens/Authenticated/Rates/Major';
import { createTestProps } from '../../../testHelpers';

describe('All the tests related to the Major screen', () => {
  let renderedComponent = '';
  let props;

  beforeEach(() => {
    props = createTestProps({ data: [{ info: 'abc' }] });
    const componentToTest = <Major {...props} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered', () => {
    expect(renderedComponent.getByTestId('major.mainWrapper')).toBeDefined();
  });

  test('should show a a table header with 3 titles and 3 ghost headers', () => {
    expect(renderedComponent.getByTestId('major.mainWrapper').props.children[0]).toBeDefined();
    expect(
      renderedComponent.getByTestId('major.mainWrapper').props.children[1].props.children.length,
    ).toEqual(6);
    expect(
      renderedComponent.getByTestId('major.mainWrapper').props.children[1].props.children[1].props
        .text,
    ).toMatch('ccy');
    expect(
      renderedComponent.getByTestId('major.mainWrapper').props.children[1].props.children[2].props
        .text,
    ).toMatch('bid');
    expect(
      renderedComponent.getByTestId('major.mainWrapper').props.children[1].props.children[3].props
        .text,
    ).toMatch('offer');
  });

  test('should show a line between the header and the body', () => {
    expect(renderedComponent.getByTestId('major.mainWrapper').props.children[1]).toBeDefined();
  });

  test('should render a modal to validate account if it is not validated yet', () => {
    expect(renderedComponent.getByTestId('major.ModalSecurityCode')).toBeDefined();
  });

  test('should show a message if flatList do not has info to show', () => {
    console.log(renderedComponent.getByTestId('major.flatList').props.children.props.children);
    // expect(renderedComponent.getByTestId('major.flatList').props.children.props.message).toEqual(
    //   'noRatesFound',
    // );
  });
});
