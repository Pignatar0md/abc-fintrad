import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { waitFor, act, fireEvent, render } from '@testing-library/react-native';
import { UserDetailsContext, UserDetailsContextProvider } from 'state/UserDetailsContext';

const expectedAccountNumber = '2392914';
const infoForUser = {
  AccountNumber: expectedAccountNumber,
  AccountType: 'Personal',
  Address1: 'Berry street 12',
  Country: 'EN',
};
const TestingComponent = () => {
  const { userInfo, userDetailsSetInfo } = useContext(UserDetailsContext);
  return (
    <View>
      <Button
        testID="setUserAccountNumber"
        title="press me"
        onPress={() => userDetailsSetInfo(infoForUser)}
      />
      <Text testID="userAccountNumber">
        {JSON.stringify(userInfo.userInformation.AccountNumber)}
      </Text>
    </View>
  );
};

describe('All the related tests with the UserDetails Context and  Context Provider', () => {
  test('should show the accountNumber after pressing the press me button', async () => {
    const { getByTestId } = render(
      <UserDetailsContextProvider>
        <TestingComponent />
      </UserDetailsContextProvider>,
    );
    await waitFor(() => {
      expect(getByTestId('userAccountNumber').props.children).toMatch('');
    });
    await act(() => {
      fireEvent.press(getByTestId('setUserAccountNumber'));
    });
    await waitFor(() => {
      expect(getByTestId('userAccountNumber').props.children).toMatch(expectedAccountNumber);
      expect(getByTestId('userAccountNumber').props.children).not.toMatch(/acd/);
    });
  });
});
