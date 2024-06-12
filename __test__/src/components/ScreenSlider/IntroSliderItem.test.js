import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import IntroSliderItem from 'components/ScreenSlider/IntroSliderItem';
import EasyAccess from 'images/onboarding/Easy-access.svg';

describe('All the tests related to the SliderItem component', () => {
  let renderedComponent = '';
  const expectedText = 'you could be who wish to be';
  const expectedTitle = 'Hey hi';
  beforeEach(() => {
    const componentToTest = (
      <IntroSliderItem title={expectedTitle} text={expectedText} image={EasyAccess} />
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed title as a prop', () => {
    const unexpectedTitle = 'Pleased to meet you';
    expect(
      renderedComponent.getByTestId('sliderItem.textWrapper').props.children[0].props.children,
    ).toEqual(expectedTitle);
    expect(
      renderedComponent.getByTestId('sliderItem.textWrapper').props.children[0].props.children,
    ).not.toEqual(unexpectedTitle);
  });

  test('should render the passed text as a prop', () => {
    const unexpectedText = 'Hi I am Amber';
    expect(
      renderedComponent.getByTestId('sliderItem.textWrapper').props.children[1].props.children,
    ).toEqual(expectedText);
    expect(
      renderedComponent.getByTestId('sliderItem.textWrapper').props.children[1].props.children,
    ).not.toEqual(unexpectedText);
  });

  test('should render the passed image as a prop', () => {
    expect(renderedComponent.getByTestId('sliderItem.generalWrapper').props.children[0]).toBe(1);
  });
});
