import React, { Dispatch, FC, ReactElement, SetStateAction } from 'react';
import IconButton from 'components/Buttons/IconButton';
import EvilIcon from 'components/Icons/EvilIcon';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from 'styles/colors';
import { fontSizes } from 'styles/fontSizes';
import { genericFn } from 'types/components';

const Searchbar: FC<{ onChangeText: Dispatch<SetStateAction<string>>; onPressBack: genericFn }> = ({
  onChangeText,
  onPressBack,
}): ReactElement => {
  return (
    <View style={styles.container}>
      <IconButton
        onPress={onPressBack}
        testId={''}
        icon={
          <EvilIcon
            icon={'chevron-left'}
            color={colors.blueGrey.c100}
            size={40}
            testId={'trade.imageButton.swapIcon'}
          />
        }
      />
      <TextInput onChangeText={onChangeText} style={styles.searchText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue.c999,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 60,
    flexDirection: 'row',
  },
  searchText: {
    color: colors.grey.A100,
    fontSize: fontSizes.large20,
    padding: 5,
    margin: 10,
    borderBottomColor: colors.grey.A200,
    borderBottomWidth: 1,
    width: 300,
  },
});

export default Searchbar;
