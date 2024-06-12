import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import EvilIcon from 'components/Icons/EvilIcon';
import AntDesigns from 'components/Icons/AntDesigns';

describe('All the tests related to the ModalWindow', () => {
  let renderedComponent = '';
  const testID = 'mWindow';
  const expectedVisibleValue = true;
  const expectedTitleValue = "I'm your creator";
  const expectedTextValue = 'Abc d';
  const expectedButtonAcceptTextValue = 'Cool';
  const buttonAcceptPressMock = jest.fn();
  const expectedIcon = <EvilIcon icon={'sc-telegram'} color="green" size="20" />;

  beforeEach(() => {
    const componentToTest = (
      <ModalWindow
        testId={testID}
        isVisible={expectedVisibleValue}
        icon={expectedIcon}
        title={expectedTitleValue}
        text={expectedTextValue}
        buttonAcceptText={expectedButtonAcceptTextValue}
        onButtonAcceptPress={buttonAcceptPressMock}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed icon component as a prop', () => {
    const unexpectedIcon = <AntDesigns icon={'chat'} color="red" size="12" />;
    const iconNode =
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children[0];
    expect(iconNode).toMatchObject(expectedIcon);
    expect(iconNode).not.toMatchObject(unexpectedIcon);
  });

  test('should render the passed title as a prop', () => {
    const unexpectedTitleValue = 'Ah ha!';
    const textNodeValue =
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children[1].props
        .children;
    expect(textNodeValue).toMatch(expectedTitleValue);
    expect(textNodeValue).not.toMatch(unexpectedTitleValue);
  });

  test('should render the passed text as a prop', () => {
    const unexpectedTextValue = 'Insert coin';
    const textNodeValue =
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children[2].props
        .children;
    expect(textNodeValue).toMatch(expectedTextValue);
    expect(textNodeValue).not.toMatch(unexpectedTextValue);
  });

  test('should render the content if isVisible value passed as a prop is true', () => {
    const childrenAmount =
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children.length;
    expect(childrenAmount).toBe(5);
    expect(childrenAmount).not.toBe(0);
  });

  test('should NOT render the content if isVisible value passed as a prop is false', () => {
    const { getByTestId } = render(
      <ModalWindow
        testId={'abc'}
        isVisible={false}
        icon={expectedIcon}
        title={expectedTitleValue}
        text={expectedTextValue}
        buttonAcceptText={expectedButtonAcceptTextValue}
        onButtonAcceptPress={buttonAcceptPressMock}
      />,
    );
    const childrenAmount = getByTestId('abc').props.children;
    expect(childrenAmount).toBeNull();
    expect(childrenAmount).not.toBe(2);
  });

  test('should render the acceptButtonText passed as a prop', () => {
    const unexpectedButtonAcceptTextValue = 'Reject';
    const childrenAmount =
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.children[4].props
        .children.props.text;
    expect(childrenAmount).toMatch(expectedButtonAcceptTextValue);
    expect(childrenAmount).not.toMatch(unexpectedButtonAcceptTextValue);
  });

  test('should run the onAcceptPress function passed as a prop', () => {
    act(() => {
      fireEvent.press(renderedComponent.getByTestId('acceptButton'));
    });
    expect(buttonAcceptPressMock).toHaveBeenCalled();
    expect(buttonAcceptPressMock.mock.calls.length).toBe(1);
    act(() => {
      fireEvent.press(renderedComponent.getByTestId('acceptButton'));
    });
    expect(buttonAcceptPressMock.mock.calls.length).toBe(2);
    expect(buttonAcceptPressMock.mock.calls.length).not.toBe(3);
  });
});
