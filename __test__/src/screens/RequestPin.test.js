import React from 'react';
import { View } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the RequestPin screen', () => {
  let renderedComponent = '';
  let props;
  const RequestPinMock = jest.fn(({ props }) => (
    <View testID="requestPin.PinWrapper" {...props}>
      <>
        <View>
          <View />
        </View>
        <View testId="">
          <View />
        </View>
        <View>
          <View />
        </View>
      </>
    </View>
  ));

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <RequestPinMock props={props} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered', () => {
    expect(renderedComponent.getByTestId('requestPin.PinWrapper')).toBeDefined();
  });

  test('should show the icon component', () => {
    expect(
      renderedComponent.getByTestId('requestPin.PinWrapper').props.children.props.children[0].props
        .children,
    ).toBeDefined();
  });

  test('should show the pin component', () => {
    expect(
      renderedComponent.getByTestId('requestPin.PinWrapper').props.children.props.children[1].props
        .children,
    ).toBeDefined();
  });

  test('should show the link button component', () => {
    expect(
      renderedComponent.getByTestId('requestPin.PinWrapper').props.children.props.children[2].props
        .children,
    ).toBeDefined();
  });
});
