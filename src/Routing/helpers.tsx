import React from 'react';
import { IQuickLinkButton, RenderIconI, SubOptionsI } from 'interfaces/routing';

import EvilIcon from 'components/Icons/EvilIcon';
import AntDesigns from 'components/Icons/AntDesigns';
import MaterialIcon from 'components/Icons/MaterialIcon';
import FontAwesomeFive from 'components/Icons/FontAwesomeFive';
import MaterialCommunity from 'components/Icons/MaterialCommunity';
import ImageButton from 'components/Buttons/ImageButton';
import SubOptionDecoration from 'components/Figures/SubOptionDecoration';
import SubOptionWrapper from 'components/Wrappers/Sidebar/SubOptionWrapper';
import SubOptionButtonItem from 'components/Buttons/Sidebar/SubOptionButtonItem';

import {
  antDesignName,
  evilIconsName,
  fontAwesome5Name,
  materialCommunityIconName,
  materialIconName,
} from 'types/icons';
import { colors } from 'styles';

export const renderSidebarSubOptions = (
  optionsList: SubOptionsI[],
  navigation: any,
  onPress: (name: string) => void,
  selected: string,
) =>
  optionsList.map(({ id, name, routeName }: SubOptionsI) => (
    <SubOptionWrapper key={id}>
      <SubOptionDecoration />
      <SubOptionButtonItem
        testId={`sidebar.subOption.navigate${id}`}
        text={name}
        bright={name === selected}
        onPress={() => {
          navigation.navigate(routeName);
          onPress(name);
        }}
      />
    </SubOptionWrapper>
  ));

export const renderQuickLinkButton = ({
  testId,
  onPress,
  buttonIcon,
  buttonText,
}: IQuickLinkButton) => {
  return (
    <ImageButton
      key={buttonText}
      disabled={false}
      buttonText={buttonText}
      icon={buttonIcon}
      testId={testId}
      onPress={onPress}
    />
  );
};

export const renderIcon = ({ iconType, testId, iconName }: RenderIconI) => {
  const ICON_SIZE = 20;
  const ICON_COLOR = colors.grey.A100;
  switch (iconType) {
    case 'materialIcon':
      return (
        <MaterialIcon
          testId={testId}
          size={ICON_SIZE}
          color={ICON_COLOR}
          icon={iconName as materialIconName}
        />
      );
    case 'antDesign':
      return (
        <AntDesigns
          testId={testId}
          size={ICON_SIZE}
          color={ICON_COLOR}
          icon={iconName as antDesignName}
        />
      );
    case 'materialCommunity':
      return (
        <MaterialCommunity
          testId={testId}
          size={ICON_SIZE}
          color={ICON_COLOR}
          icon={iconName as materialCommunityIconName}
        />
      );
    case 'fontAwesome5':
      return (
        <FontAwesomeFive
          testId={testId}
          size={iconName === 'money-check-alt' ? 15 : ICON_SIZE}
          color={ICON_COLOR}
          icon={iconName as fontAwesome5Name}
        />
      );
    default:
      return (
        <EvilIcon
          testId={testId}
          size={ICON_SIZE}
          color={ICON_COLOR}
          icon={iconName as evilIconsName}
        />
      );
  }
};
