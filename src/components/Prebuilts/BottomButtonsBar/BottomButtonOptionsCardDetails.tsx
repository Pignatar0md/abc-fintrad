import React, { FC, ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes } from 'styles';
import { BottomButtonOptions } from 'types/components';

const BottomButtonOptionsCardDetails: FC<BottomButtonOptions> = ({
  textOpt1,
  textOpt2,
  textOpt3,
  textOpt4,
  onPressOpt1,
  onPressOpt2,
  onPressOpt3,
  onPressOpt4,
}): ReactElement => {
  return (
    <View style={styles.container}>
      {!!textOpt1 && (
        <View style={styles.buttonOptionWrapper}>
          <TouchableOpacity onPress={onPressOpt1}>
            <Text style={styles.textOption}>{textOpt1}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!textOpt2 && (
        <View style={styles.buttonOptionWrapper}>
          <TouchableOpacity onPress={onPressOpt2}>
            <Text style={styles.textOption}>{textOpt2}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!textOpt3 && (
        <View style={styles.buttonOptionWrapper}>
          <TouchableOpacity onPress={onPressOpt3}>
            <Text style={styles.textOption}>{textOpt3}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!textOpt4 && (
        <View style={styles.buttonOptionWrapper}>
          <TouchableOpacity onPress={onPressOpt4}>
            <Text style={styles.textOption}>{textOpt4}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonOptionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    flexDirection: 'row',
    backgroundColor: colors.grey.c350,
  },
  textOption: {
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
    color: colors.grey.c750,
  },
});

export default BottomButtonOptionsCardDetails;
