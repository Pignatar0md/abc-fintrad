import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import Sidebar from 'Routing/Sidebar';
import { NavigationContainer } from '@react-navigation/native';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the Sidebar component', () => {
  let renderedComponent = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = (
      <NavigationContainer>
        <Sidebar {...props} />
      </NavigationContainer>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('it renders the options defined using the DrawerItem component', () => {
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[1].props
        .label,
    ).toMatch('accountMayusc');
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[3].props
        .label,
    ).toMatch('Payments');
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[4].props
        .label,
    ).toMatch('Cards');
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[6].props
        .label,
    ).toMatch('Settings');
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[7].props
        .label,
    ).toMatch('ContactUs');
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[8].props
        .label,
    ).toMatch('Logout');
  });

  test('it renders the Rate option defined using the Drawer.Screen component', () => {
    const expectedResult = ['Rates'];
    const unexpectedResult = [''];
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[0].props
        .state.routeNames,
    ).toEqual(expectedResult);
    expect(
      renderedComponent.getByTestId('routing.sideBar').props.children[1].props.children[0].props
        .state.routeNames,
    ).not.toEqual(unexpectedResult);
  });
});
