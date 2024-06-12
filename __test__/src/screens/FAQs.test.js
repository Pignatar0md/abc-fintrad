import React from 'react';
import { cleanup, render, fireEvent, act } from '@testing-library/react-native';
import FAQs from 'screens/Contact/FAQs';

describe('All the tests related to the FAQs screen', () => {
  let renderedComponent = '';
  const testIdComponent = 'faqs.wrapperScroll';
  const generalInfotestID = 'faq.button.generalInfo';
  const payAndSettlementsInfotestID = 'faq.button.payAndSettlementsInfo';
  const tradingInfotestID = 'faq.button.tradingInfo';

  let buttonContainer1 = '';
  let buttonContainer2 = '';
  let buttonContainer3 = '';
  let btn1 = '';
  let btn2 = '';
  let btn3 = '';
  const expectedTextButton1 = 'General';
  const expectedTextButton2 = 'Trading';
  const expectedTextButton3 = 'Payments and Settlements';
  const unexpectedTextButton1 = ' ';
  const unexpectedTextButton2 = 'abc';
  const unexpectedTextButton3 = 'Payment+ and Settlement';
  beforeEach(() => {
    const componentToTest = <FAQs />;
    renderedComponent = render(componentToTest);
    const pathToButton = renderedComponent.getByTestId(testIdComponent).props.children[1].props;
    btn1 = renderedComponent.getByTestId(generalInfotestID);
    btn2 = renderedComponent.getByTestId(tradingInfotestID);
    btn3 = renderedComponent.getByTestId(payAndSettlementsInfotestID);
    buttonContainer1 = pathToButton.children[0];
    buttonContainer2 = pathToButton.children[1];
    buttonContainer3 = pathToButton.children[2];
  });

  afterEach(() => {
    cleanup();
  });

  test('should the screen be rendered and with 3 buttons', () => {
    expect(renderedComponent.getByTestId(testIdComponent)).toBeDefined();
    expect(buttonContainer1).toBeDefined();
    expect(buttonContainer2).toBeDefined();
    expect(buttonContainer3).toBeDefined();
  });

  test('should the 3 buttons be rendered with the right titles', () => {
    const pathToTextButton1 = btn1.props.children[0].props.children[0].props.children;
    const pathToTextButton2 = btn2.props.children[0].props.children[0].props.children;
    const pathToTextButton3 = btn3.props.children[0].props.children[0].props.children;

    expect(pathToTextButton1).toMatch(expectedTextButton1);
    expect(pathToTextButton1).not.toMatch(unexpectedTextButton1);
    expect(pathToTextButton2).toMatch(expectedTextButton2);
    expect(pathToTextButton2).not.toMatch(unexpectedTextButton2);
    expect(pathToTextButton3).toMatch(expectedTextButton3);
    expect(pathToTextButton3).not.toMatch(unexpectedTextButton3);
  });

  test('should show a text content if a button is pressed', async () => {
    expect(
      renderedComponent.getByTestId('faq.hideableContent.generalInfo').props.children,
    ).toBeFalsy();
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1000));
    expect(
      renderedComponent.getByTestId('faq.hideableContent.generalInfo').props.children,
    ).toBeDefined();
  });

  test('should hide a text content if a button is pressed and after a time the user presses the same button again', async () => {
    expect(
      renderedComponent.getByTestId('faq.hideableContent.generalInfo').props.children,
    ).toBeFalsy();
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1000));
    expect(
      renderedComponent.getByTestId('faq.hideableContent.generalInfo').props.children,
    ).toBeDefined();
    act(() => {
      fireEvent.press(btn1);
    });
    expect(
      renderedComponent.getByTestId('faq.hideableContent.generalInfo').props.children,
    ).toBeFalsy();
  });

  test('should the background color button change  after the user presses it to read the text content', async () => {
    expect(btn1.props.style.backgroundColor).toBeUndefined();
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1000));
    expect(btn1.props.style.backgroundColor).toBeDefined();
    expect(btn1.props.style.backgroundColor).toMatch('#eeeeee');
  });

  test('should the text color button, icon and icon color and  change after the user presses it to read the text content', async () => {
    expect(btn1.props.children[0].props.children[1].props.icon).toMatch('plus'); //icon symbol
    expect(btn1.props.children[0].props.children[1].props.color).toMatch('#4A4A4A'); //icon color
    expect(btn1.props.children[0].props.children[0].props.style.color).toMatch('#4A4A4A'); //text color
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1600));
    expect(btn1.props.children[0].props.children[1].props.icon).toMatch('minus'); //icon symbol
    expect(btn1.props.children[0].props.children[1].props.color).toMatch('#42AFB7'); //icon color
    expect(btn1.props.children[0].props.children[0].props.style.color).toMatch('#42AFB7'); //text color
  });

  test('should the button change back to its color after the user presses it to read the text content and presses again to hide the text content', async () => {
    expect(btn1.props.children[0].props.children[1].props.icon).toMatch('plus'); //icon symbol
    expect(btn1.props.children[0].props.children[1].props.color).toMatch('#4A4A4A'); //icon color
    expect(btn1.props.children[0].props.children[0].props.style.color).toMatch('#4A4A4A'); //text color
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1600));
    expect(btn1.props.children[0].props.children[1].props.icon).toMatch('minus'); //icon symbol
    expect(btn1.props.children[0].props.children[1].props.color).toMatch('#42AFB7'); //icon color
    expect(btn1.props.children[0].props.children[0].props.style.color).toMatch('#42AFB7'); //text color
    act(() => {
      fireEvent.press(btn1);
    });
    await new Promise((r) => setTimeout(r, 1600));
    expect(btn1.props.children[0].props.children[1].props.icon).toMatch('plus'); //icon symbol
    expect(btn1.props.children[0].props.children[1].props.color).toMatch('#4A4A4A'); //icon color
    expect(btn1.props.children[0].props.children[0].props.style.color).toMatch('#4A4A4A'); //text color
  });
});
