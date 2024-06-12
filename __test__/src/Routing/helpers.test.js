import React from 'react';
import { ACCOUNT_OPTIONS } from 'utils/static';
import {
  renderIcon,
  renderSidebarSubOptions,
  renderQuickLinkButton,
} from '../../../src/Routing/helpers';
import MaterialIcon from 'components/Icons/MaterialIcon';

describe('All the tests related to the helpers file', () => {
  test('it renders sub options represented by a line decorator, an onPress function and text', () => {
    const expectedText = 'Balances';
    const result = renderSidebarSubOptions(ACCOUNT_OPTIONS, () => ({}));
    expect(result.length).toEqual(6);
    expect(result[0].props.children[0]).toBeDefined();
    expect(result[0].props.children[1].props.text).toMatch(expectedText);
    expect(result[0].props.children[1].props.onPress).toBeDefined();
  });

  test('it returns an image button with an onPress function, a text and an icon', () => {
    const expectedText = 'Rates';
    const expectedIcon = (
      <MaterialIcon color="grey" icon="attach-money" size={20} testId="quickLink.iconImageButton" />
    );
    const result = renderQuickLinkButton({
      testId: 'quickLink.Rates',
      onPress: () => console.log('hi'),
      buttonIcon: expectedIcon,
      buttonText: 'Rates',
    });
    expect(result.props.buttonText).toMatch(expectedText);
    expect(result.props.onPress).toBeDefined();
    expect(result.props.icon).toEqual(expectedIcon);
  });

  test('it renders an icon component with a name and an icon type', () => {
    const expectedIconName = 'bank';
    const expectedIconType = 'materialCommunity';
    const result = renderIcon({
      iconType: expectedIconType,
      testId: 'sidebar.AccountIcon',
      iconName: expectedIconName,
    });
    expect(result.props.icon).toEqual(expectedIconName);
  });
});
