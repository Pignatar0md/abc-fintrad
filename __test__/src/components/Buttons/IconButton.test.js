import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import IconButton from 'components/Buttons/IconButton';
import EvilIcon from 'components/Icons/EvilIcon';
import AntDesigns from 'components/Icons/AntDesigns';

describe('All the tests related to the IconButton', () => {
  let renderedComponent = '';
  const testID = 'iconButton';
  const onPressMock = jest.fn();
  const expectedIcon = <EvilIcon icon={'sc-telegram'} color="green" size="20" />;

  beforeEach(() => {
    const componentToTest = (
      <IconButton testId={testID} onPress={onPressMock} icon={expectedIcon} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed icon component as a prop', () => {
    const unexpectedIcon = <AntDesigns icon={'chat'} color="red" size="12" />;
    const iconNode = renderedComponent.getByTestId(testID).props.children[0];
    expect(iconNode).toMatchObject(expectedIcon);
    expect(iconNode).not.toMatchObject(unexpectedIcon);
  });

  test('should run the passed onPress function as a prop', () => {
    act(() => {
      fireEvent.press(renderedComponent.getByTestId(testID));
    });
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
    act(() => {
      fireEvent.press(renderedComponent.getByTestId(testID));
    });
    expect(onPressMock.mock.calls.length).toBe(2);
    expect(onPressMock.mock.calls.length).not.toBe(3);
  });
});
