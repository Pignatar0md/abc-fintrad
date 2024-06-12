import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import PhoneField from 'components/Inputs/PhoneField';
import LabelField from 'components/LabelField';

describe('All the tests related to the TextField', () => {
  let renderedComponent = '';
  const testID = 'inputAge';
  const expectedValue = '34533';
  const expectedPlaceHolderValue = 'ex. 67';
  const expectedLabelValue = <LabelField testId="abc" text="write your age here!" />;
  const expectedAutoCompleteValue = 'none';
  const expectedWrapperStyle = { flex: 1 };
  const expectedStyle = { fontSize: 13 };
  const expectedTextStyle = { fontWeight: '600' };
  const onChangeTextMock = jest.fn();

  beforeEach(() => {
    const componentToTest = (
      <PhoneField
        label={expectedLabelValue}
        value={expectedValue}
        onChangeText={onChangeTextMock}
        placeHolder={expectedPlaceHolderValue}
        autoComplete={expectedAutoCompleteValue}
        wrapperStyle={expectedWrapperStyle}
        style={expectedStyle}
        textStyle={expectedTextStyle}
        testId={testID}
      />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the keyboardType be phone-pad', () => {
    const expectedKeyboardTypeValue = 'phone-pad';
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.keyboardType,
    ).toMatch(expectedKeyboardTypeValue);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.keyboardType,
    ).not.toMatch('default');
  });

  test('should render the passed label as a prop', () => {
    const unexpectedLabelValue = <LabelField testId="Fefe" text="write your age " />;
    expect(renderedComponent.getByTestId(testID).props.children[0].props.text).toEqual(
      expectedLabelValue,
    );
    expect(renderedComponent.getByTestId(testID).props.children[0].props.text).not.toEqual(
      unexpectedLabelValue,
    );
  });

  test('should render the passed autoComplete as a prop', () => {
    const unexpectedAutoCompleteValue = 'words';
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.autoComplete,
    ).toMatch(expectedAutoCompleteValue);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.autoComplete,
    ).not.toMatch(unexpectedAutoCompleteValue);
  });

  test('should render the passed value as a prop', () => {
    const unexpectedValue = '99999';
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.value,
    ).toMatch(expectedValue);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.value,
    ).not.toMatch(unexpectedValue);
  });

  test('should run the passed onChangeText function as a prop', () => {
    const newTextFieldValue = '91919191';
    act(() => {
      fireEvent.changeText(
        renderedComponent.getByTestId('phoneField.inputField'),
        newTextFieldValue,
      );
    });
    expect(onChangeTextMock).toHaveBeenCalled();
    expect(onChangeTextMock).not.toHaveBeenCalledWith('0000000');
    expect(onChangeTextMock).toHaveBeenCalledWith(newTextFieldValue);
  });

  test('should render the passed placeHolder text as a prop', () => {
    const unexpectedPlaceHolderValue = 'can we go for a strall?';
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.placeholder,
    ).toMatch(expectedPlaceHolderValue);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.placeholder,
    ).not.toMatch(unexpectedPlaceHolderValue);
  });

  test('should render the passed wrapperStyle as a prop', () => {
    const unexpectedWrapperStyle = { flex: 3 };
    expect(renderedComponent.getByTestId(testID).props.children[1].props.style).toEqual(
      expectedWrapperStyle,
    );
    expect(renderedComponent.getByTestId(testID).props.children[1].props.style).not.toEqual(
      unexpectedWrapperStyle,
    );
  });

  test('should render the passed textStyle as a prop', () => {
    const unexpectedTextStyle = { textAlign: 'center' };
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.style[1],
    ).toEqual(expectedTextStyle);
    expect(
      renderedComponent.getByTestId(testID).props.children[1].props.children.props.style[1],
    ).not.toEqual(unexpectedTextStyle);
  });
});
