import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import QuickLinks from 'Routing/QuickLinks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('All the tests related to the QuickLinks component', () => {
  let renderedComponent = '';
  const useContextMock = () => ({
    userInfo: { userInformation: { AccountType: 2 } },
  });

  jest.spyOn(React, 'useContext').mockImplementation(useContextMock);

  beforeEach(() => {
    const componentToTest = <QuickLinks />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the 9 passed options as a prop', () => {
    expect(
      renderedComponent.getByTestId('quickLinks.optionsList').props.children[1].props.children
        .length,
    ).toEqual(9);
  });
});
