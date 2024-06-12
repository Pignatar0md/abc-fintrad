import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import ImageButton from 'components/Buttons/ImageButton';
import EvilIcon from 'components/Icons/EvilIcon';
import AntDesigns from 'components/Icons/AntDesigns';

describe('All the tests related to the ImageButton', () => {
  let renderedComponent = '';
  const testID = 'iconButton';
  const onPressMock = jest.fn();
  const expectedIcon = <EvilIcon icon={'sc-telegram'} color="green" size="20" />;
  const unexpectedIcon = <AntDesigns icon={'chat'} color="red" size="12" />;
  beforeEach(() => {
    const componentToTest = (
      <ImageButton testId={testID} onPress={onPressMock} icon={expectedIcon} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed icon component as a prop', () => {
    expect(renderedComponent.getByTestId(testID).props.children).toBeDefined();
    expect(renderedComponent.getByTestId(testID).props.children).toMatchObject(expectedIcon);
    expect(renderedComponent.getByTestId(testID).props.children).not.toMatchObject(unexpectedIcon);
  });

  test('should run the passed function as a prop', () => {
    fireEvent.press(renderedComponent.getByTestId('home.quickLinkButton'));
    expect(onPressMock).toHaveBeenCalled();
    expect(onPressMock.mock.calls.length).toBe(1);
    act(() => {
      fireEvent.press(renderedComponent.getByTestId('home.quickLinkButton'));
    });
    expect(onPressMock.mock.calls.length).toBe(2);
    expect(onPressMock.mock.calls.length).not.toBe(3);
  });
});
