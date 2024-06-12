import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createTestProps } from '../../testHelpers';
import ContactUsTopTabbar from 'Routing/TopTabbars/ContactUsTopTabbar';

describe('All the tests related to the ContactUsTopTabbar component', () => {
  let renderedComponent = '';
  let props;

  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = (
      <NavigationContainer>
        <ContactUsTopTabbar {...props} />
      </NavigationContainer>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('it has the 3 screen names to render the screen contents', () => {
    expect(renderedComponent.getByTestId('routing.ContactUsTabbar').props.data.length).toEqual(3);
    expect(
      renderedComponent.getByTestId('routing.ContactUsTabbar').props.children[1].props.children[0]
        .key,
    ).toEqual('first');
    expect(
      renderedComponent.getByTestId('routing.ContactUsTabbar').props.children[1].props.children[1]
        .key,
    ).toEqual('second');
    expect(
      renderedComponent.getByTestId('routing.ContactUsTabbar').props.children[1].props.children[2]
        .key,
    ).toEqual('third');
  });
});
