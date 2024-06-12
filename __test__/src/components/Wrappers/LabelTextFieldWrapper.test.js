import React from 'react';
import { Text } from 'react-native';
import { cleanup, render } from '@testing-library/react-native';
import LabelTextFieldWrapper from 'components/Wrappers/LabelTextFieldWrapper';

describe('All the tests related to the LabelTextFieldWrapper', () => {
  let renderedComponent = '';
  beforeEach(() => {
    const componentToTest = (
      <LabelTextFieldWrapper>
        <Text>Hi</Text>
      </LabelTextFieldWrapper>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should run the passed component as a prop', () => {
    expect(renderedComponent.getByTestId('wrapper').props.children.props.children).toEqual('Hi');
    expect(renderedComponent.getByTestId('wrapper').props.children.props.children).not.toEqual('');
  });
});
