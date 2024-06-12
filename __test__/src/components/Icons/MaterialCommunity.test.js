import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import MaterialCommunity from 'components/Icons/MaterialCommunity';

describe('All the tests related to the MaterialCommunity Icon', () => {
  let renderedComponent = '';
  const testID = 'mcIcon';
  const expectedIconName = 'face-recognition';
  const expectedSizeValue = 24;
  const expectedColorValue = 'red';
  beforeEach(() => {
    const componentToTest = (
      <MaterialCommunity
        testId={testID}
        icon={expectedIconName}
        color={expectedColorValue}
        size={expectedSizeValue}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed iconName as a prop', () => {
    const unexpectedIconName = 'bell';
    const textValueNode = renderedComponent.getByTestId(testID).props.children.props.name;
    expect(textValueNode).toEqual(expectedIconName);
    expect(textValueNode).not.toEqual('');
    expect(textValueNode).not.toEqual(unexpectedIconName);
  });

  test('should render the passed color as a prop', () => {
    const unexpectedColorValue = 'blue';
    const textValueNode = renderedComponent.getByTestId(testID).props.children.props.color;
    expect(textValueNode).toEqual(expectedColorValue);
    expect(textValueNode).not.toEqual('');
    expect(textValueNode).not.toEqual(unexpectedColorValue);
  });

  test('should render the passed size number as a prop', () => {
    const unexpectedSizeValue = 32;
    const textValueNode = renderedComponent.getByTestId(testID).props.children.props.size;
    expect(textValueNode).toBe(expectedSizeValue);
    expect(textValueNode).not.toEqual('');
    expect(textValueNode).not.toEqual(unexpectedSizeValue);
  });
});