import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createTestProps } from '../../testHelpers';
import BalancesBottomTabbar from 'Routing/BottomTabbars/BalancesBottomTabbar';

describe('All the tests related to the Sidebar component', () => {
  let renderedComponent = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = (
      <NavigationContainer>
        <BalancesBottomTabbar {...props} />
      </NavigationContainer>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('research more about how to test it', () => {
    expect(true).toBeTruthy();
  });

  // test('it renders the options defined using the DrawerItem component', () => {
  // console.log(
  //   renderedComponent.getByTestId('routing.tabNav.routing.balancesBottomTabbar.Positive').props,
  // );
  // });

  // test('it renders the options defined using the DrawerItem component', () => {
  // console.log(
  //   renderedComponent.getByTestId('routing.tabNav.routing.balancesBottomTabbar.Positive').props,
  // );
  // });
});
