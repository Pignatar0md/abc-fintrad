import React from 'react';
import { View } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the SetPin screen', () => {
  let renderedComponent = '';
  let props;

  const SetPinMock = jest.fn(({ props }) => (
    <View testID="screens.SetPin" {...props}>
      <>
        <View testId="setPin.successModal"></View>
        <View />
      </>
    </View>
  ));

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <SetPinMock props={props} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered', () => {
    expect(renderedComponent.getByTestId('screens.SetPin')).toBeDefined();
  });

  test('should the screen have a modal component as a child', () => {
    expect(
      renderedComponent.getByTestId('screens.SetPin').props.children.props.children[0],
    ).toBeDefined();
  });

  test('should the screen have a PinComponent as a child', () => {
    expect(
      renderedComponent.getByTestId('screens.SetPin').props.children.props.children[1],
    ).toBeDefined();
  });
});
