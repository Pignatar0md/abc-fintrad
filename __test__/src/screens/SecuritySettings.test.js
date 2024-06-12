import React from 'react';
import { render } from '@testing-library/react-native';
import SecuritySettings from 'screens/Authenticated/Settings/SecuritySettings';
import { createTestProps } from '../../testHelpers';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('All the tests related to the SecuritySettings screen', () => {
  let renderedComponent = '';
  let screen;
  let props;

  const setBiometricAuthType = jest.fn();
  const useStateMock = (initState) => [initState, setBiometricAuthType];
  const useContextMock = () => ({
    authInfo: { isBiometricsActive: true },
    switchActiveBiometrics: jest.fn(),
  });
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  jest.spyOn(React, 'useContext').mockImplementation(useContextMock);

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = <SecuritySettings {...props} />;
    renderedComponent = render(componentToTest);
    screen = renderedComponent.getByTestId('securitySettings.Screen');
  });

  test('should the screen be rendered successfully', () => {
    expect(screen).not.toBeNull();
  });

  test('should the screen render a button to enable biometrics authentication', () => {
    expect(
      renderedComponent.getByTestId('securitySettings.Screen').props.children[3][0],
    ).toBeDefined();
  });

  test('should the screen render a button to set pin to user authentication', () => {
    expect(
      renderedComponent.getByTestId('securitySettings.Screen').props.children[3][1],
    ).toBeDefined();
  });

  test('should the screen count with a modal window to show if the biometrics auth was configured successfully', () => {
    expect(
      renderedComponent.getByTestId('securitySettings.Screen').props.children[0],
    ).toBeDefined();
  });

  test('should the screen has a title and text as a first row', () => {
    expect(
      renderedComponent.getByTestId('securitySettings.Screen').props.children[1],
    ).toBeDefined();
    expect(renderedComponent.getByTestId('securitySettings.titleWrapper')).toBeDefined();
    expect(renderedComponent.getByTestId('securitySettings.titleText').props.children).toMatch(
      'securitySettings',
    );
    expect(renderedComponent.getByTestId('securitySettings.subtitleText').props.children).toMatch(
      'securityLegend',
    );
  });
});
