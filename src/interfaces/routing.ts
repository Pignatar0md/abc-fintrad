import {
  antDesignName,
  evilIconsName,
  fontAwesome5Name,
  fontAwesomeName,
  materialCommunityIconName,
  materialIconName,
} from 'types/icons';
import { ReactElement } from 'react';

export interface IQuickLinkButton {
  buttonText: string;
  buttonIcon: ReactElement;
  testId: string;
  onPress: () => void;
}

export interface SubOptionsI {
  id: number;
  name: string;
  routeName: string;
}

export interface RenderIconI {
  iconType: string;
  testId: string;
  iconName:
    | antDesignName
    | evilIconsName
    | materialCommunityIconName
    | fontAwesomeName
    | fontAwesome5Name
    | materialIconName;
}
