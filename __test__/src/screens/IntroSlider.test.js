import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import IntroSlider from 'screens/Authenticated/IntroSlider';
import { createTestProps } from '../../testHelpers';

jest.mock('images/onboarding/Home-o.svg', () => 'HomeIcon');
jest.mock('images/onboarding/Send-money.svg', () => 'SendMoneyIcon');
jest.mock('images/onboarding/Easy-access.svg', () => 'EasyAccessIcon');
jest.mock('images/onboarding/Security.svg', () => 'SecurityIcon');

describe('All the tests related to the IntroSlider screen', () => {
  let props = '';
  let renderedComponent = '';

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <IntroSlider {...props} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should the slider be visible', () => {
    expect(renderedComponent.getByTestId('introSlider.slider')).toBeDefined();
  });

  test('should the slider have a custom next button', () => {
    expect(
      renderedComponent.getByTestId('introSlider.slider').props.renderNextButton,
    ).toBeDefined();
  });

  test('should the slider have a custom next button', () => {
    expect(
      renderedComponent.getByTestId('introSlider.slider').props.renderNextButton,
    ).toBeDefined();
    expect(renderedComponent.getByTestId('introSlider.slider').props.bottomButton).toBeTruthy();
    expect(renderedComponent.getByTestId('introSlider.slider').props.bottomButton).not.toBeFalsy();
  });

  test('should the slider have the info to render the 4 screens', () => {
    expect(renderedComponent.getByTestId('introSlider.slider').props.data.length).toBe(4);
    expect(renderedComponent.getByTestId('introSlider.slider').props.data.length).not.toBe(0);
  });

  test('should the dots of the slider be touchable to navigate between the sliders screens', () => {
    expect(renderedComponent.getByTestId('introSlider.slider').props.dotClickEnabled).toBeTruthy();
    expect(
      renderedComponent.getByTestId('introSlider.slider').props.dotClickEnabled,
    ).not.toBeFalsy();
  });
});
