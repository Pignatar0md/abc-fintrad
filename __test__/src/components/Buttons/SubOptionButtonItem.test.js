import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import SubOptionButtonItem from 'components/Buttons/Sidebar/SubOptionButtonItem';

describe('All the tests related to the Button', () => {
  let renderedComponent = '';
  const testID = 'optionButton';
  const onPressMock = jest.fn();
  const expectedTextValue = 'Press me';

  beforeEach(() => {
    const componentToTest = (
      <SubOptionButtonItem testId={testID} text={expectedTextValue} onPress={onPressMock} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('should render the passed text value as a prop', () => {
    const unexpectedTextValue = 'login';
    const textValueNode = renderedComponent.getByTestId(testID).props.children[0].props.children;
    expect(textValueNode).toEqual(expectedTextValue);
    expect(textValueNode).not.toEqual('');
    expect(textValueNode).not.toEqual(unexpectedTextValue);
  });

  test('should run the passed onPress function as a prop', () => {
    act(() => {
      fireEvent.press(renderedComponent.getByTestId(testID));
    });
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
  });
});
