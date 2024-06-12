import React, { FC, ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { genericFn } from 'types/components';
import { colors } from 'styles';
import { DEVICE_WIDTH } from 'utils/static';
import EvilIcon from '../../Icons/EvilIcon';
import FontAwesomeFive from '../../Icons/FontAwesomeFive';

const BottomButtonOptionsStatements: FC<{
  onPdfPress: genericFn;
  onXlsPress: genericFn;
  onSearchPress: genericFn;
}> = ({ onPdfPress, onXlsPress, onSearchPress }): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonOptionWrapper}>
        <TouchableOpacity onPress={onPdfPress}>
          <FontAwesomeFive
            icon={'file-pdf'}
            color={colors.grey.c750}
            size={20}
            testId={'bottomButtonOptionsStatements.pdfButton'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onXlsPress}>
          <FontAwesomeFive
            icon={'file-excel'}
            color={colors.grey.c750}
            size={20}
            testId={'bottomButtonOptionsStatements.xlsfButton'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSearchPress}>
          <EvilIcon
            icon={'search'}
            color={colors.grey.c750}
            size={24}
            testId={'bottomButtonOptionsStatements.searchButton'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.grey.A100,
  },
  buttonOptionWrapper: {
    width: DEVICE_WIDTH,
    height: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.grey.c350,
  },
});

export default BottomButtonOptionsStatements;
