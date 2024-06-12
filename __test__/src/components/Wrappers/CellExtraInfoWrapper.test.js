import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import CellExtraInfoWrapper from 'components/Wrappers/CellExtraInfoWrapper';

describe('All the tests related to the Cell component', () => {
  let renderedComponent = '';
  const testID = 'component.Wrappers.CellExtraInfoWrapper';
  const expectedInfo = 'Hey hi';
  const expectedTitle = 'Tiiitle';
  beforeEach(() => {
    const componentToTest = <CellExtraInfoWrapper title={expectedTitle} info={expectedInfo} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed string info value as a prop', () => {
    const unexpectedInfo = 'Lala la';
    expect(renderedComponent.getByTestId(testID).props.children[1].props.children).toMatch(
      expectedInfo,
    );
    expect(renderedComponent.getByTestId(testID).props.children[1].props.children).not.toMatch(
      unexpectedInfo,
    );
  });

  test('should render the passed string title value as a prop', () => {
    const unexpectedTitle = 'As you wish';
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).toMatch(
      expectedTitle,
    );
    expect(renderedComponent.getByTestId(testID).props.children[0].props.children).not.toEqual(
      unexpectedTitle,
    );
  });
});
