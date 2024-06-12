import React, { FC, ReactElement, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { QUICKLINKS_OPTIONS } from 'utils/static';
import { renderQuickLinkButton } from './helpers';
import { Navigation } from 'types/types';
import { UserDetailsContext } from 'state/UserDetailsContext';

const QuickLinks: FC = (): ReactElement => {
  const { userInfo } = useContext(UserDetailsContext);
  const navigation: Navigation = useNavigation();
  // let filteredQuickLinkOptions = null;
  // quits TopUp option if account is corporate, this is for Production ===================v
  const filteredQuickLinkOptions =
    userInfo?.userInformation?.AccountType === 2
      ? QUICKLINKS_OPTIONS
      : QUICKLINKS_OPTIONS.filter((option) => option.routeName !== 'TopUp');
  // ====================================================================================^

  //  only useful to develop =================v
  // filteredQuickLinkOptions = QUICKLINKS_OPTIONS;
  // =========================================^

  return (
    <>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        testID="quickLinks.optionsList">
        {filteredQuickLinkOptions?.map(
          ({ testId, routeName, buttonIcon, buttonText, screenName }) => {
            return renderQuickLinkButton({
              testId,
              onPress: () =>
                navigation.navigate(routeName, screenName ? { screen: screenName } : undefined),
              buttonIcon,
              buttonText,
            });
          },
        )}
      </ScrollView>
    </>
  );
};

export default QuickLinks;
