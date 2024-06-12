import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import BulletPoint from 'components/Texts/BulletPoint';

describe('All the tests related to the LabelField', () => {
  let renderedComponent = '';
  const expectedTextResult = 'The great text content';
  const expectedTitleResult = 'Tiiitle';

  beforeEach(() => {
    const componentToTest = <BulletPoint text={expectedTextResult} title={expectedTitleResult} />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the passed text as a prop', () => {
    const unexpectedTextResult = 'Milestone';
    expect(renderedComponent.getByTestId('component.bulletPointText').props.children[1]).toMatch(
      expectedTextResult,
    );
    expect(
      renderedComponent.getByTestId('component.bulletPointText').props.children[1],
    ).not.toMatch(unexpectedTextResult);
  });

  test('should render the passed title as a prop', () => {
    const unexpectedTitleResult = 'Milestone';
    expect(
      renderedComponent.getByTestId('component.bulletPointText').props.children[0].props.children,
    ).toMatch(expectedTitleResult);
    expect(
      renderedComponent.getByTestId('component.bulletPointText').props.children[0].props.children,
    ).not.toMatch(unexpectedTitleResult);
  });
});
