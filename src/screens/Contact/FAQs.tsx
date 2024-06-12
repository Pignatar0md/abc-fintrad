import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AntDesigns from 'components/Icons/AntDesigns';
import Line from 'components/Figures/Line';
import ScrollViewWrapper from 'components/Wrappers/ScrollViewWrapper';

import { colors, fontSizes } from 'styles';
import { FAQ_OPTIONS } from 'utils/static';
import TransparentButton from 'components/Buttons/TransparentButton';
import BulletPoint from 'components/Texts/BulletPoint';
import TitleSection from 'components/Texts/TitleSection';
import ContentSection from 'components/Texts/ContentSection';
import { FaqOption } from 'types/screens';

const FAQs: FC = (): ReactElement => {
  const [optionOpened, setOptionOpened] = useState({
    generalInfo: false,
    tradingInfo: false,
    payandSettlementsInfo: false,
  });
  const { titleTopic } = styles;
  const focusedTitle = { ...titleTopic, color: colors.cyan.A800 };

  const onOptionPress = (option: FaqOption) => {
    setOptionOpened({ ...optionOpened, [option]: !optionOpened[option] });
  };

  return (
    <ScrollViewWrapper testId="faqs.wrapperScroll" backgroundColor="white">
      {FAQ_OPTIONS.map(({ key, name, content }) => {
        const optionSelected = optionOpened[key as FaqOption];
        return (
          <View key={key}>
            <TransparentButton
              testId={`faq.button.${key}`}
              optionSelected={optionSelected}
              onPress={() => onOptionPress(key as FaqOption)}>
              <>
                <Text style={optionSelected ? focusedTitle : titleTopic}>{name}</Text>
                <AntDesigns
                  color={optionSelected ? colors.cyan.A800 : colors.grey.c750}
                  size={18}
                  icon={optionSelected ? 'minus' : 'plus'}
                  testId="faqs.MoreLessInfo"
                />
              </>
            </TransparentButton>
            <View testID={`faq.hideableContent.${key}`}>
              {!!optionSelected &&
                content?.map(({ title, text }, index) => (
                  <View
                    key={title}
                    style={styles.titleContentWrapper}
                    testID={`faqs.TitleAndContentWrapper.${index}`}>
                    <TitleSection title={title} />
                    {typeof text === 'string' ? (
                      <ContentSection text={text} />
                    ) : (
                      <>
                        {!!text.text1 && <ContentSection text={text.text1} />}
                        {!!text.subContent &&
                          text.subContent.map(({ title, text }) => (
                            <BulletPoint key={title} title={title} text={text} />
                          ))}
                        {!!text.warning && <Text style={styles.warning}>{text.warning}</Text>}
                        {!!text.text2 && <Text style={styles.clarification}>{text.text2}</Text>}
                      </>
                    )}
                  </View>
                ))}
            </View>
            <Line />
          </View>
        );
      })}
    </ScrollViewWrapper>
  );
};

const styles = StyleSheet.create({
  titleTopic: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.mediumSmall14,
    letterSpacing: 0.6,
    color: colors.grey.c750,
  },
  titleContentWrapper: { marginTop: 16, marginHorizontal: 16 },
  warning: {
    marginVertical: 10,
    letterSpacing: 0.6,
    lineHeight: 24,
    fontSize: fontSizes.mediumSmall14,
    fontFamily: 'OpenSans-Bold',
    color: colors.grey.c750,
  },
  clarification: {
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSizes.medium16,
    color: colors.grey.c750,
  },
});

export default FAQs;
