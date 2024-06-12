import React, { useContext } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import { AuthContext, AuthContextProvider } from 'state/AuthContext';

const expectedErrorMessage = 'error!';
const token = 'sljkdsajlkdjldasdkljdkjsaldjlkasdlaks';

const TestingComponent = () => {
  const { authInfo, resetErrorMessage, loginUserError, loginUserSuccess, switchActiveBiometrics } =
    useContext(AuthContext);
  return (
    <>
      <Text testID="authToken">{authInfo.authToken}</Text>
      <Text testID="errorMessage">{authInfo.errorMessage}</Text>
      <Text testID="biometricsToggleValue">{authInfo.isBiometricsActive}</Text>
      <Button
        testID="setError"
        title="press me"
        onPress={() => loginUserError(expectedErrorMessage)}
      />
      <Button testID="cleanError" title="clean me" onPress={() => resetErrorMessage()} />
      <Button
        testID="switchBiometrics"
        title="activate/deactivate biometrics"
        onPress={() => switchActiveBiometrics(true)}
      />
      <Button
        testID="loginSuccess"
        title="clean me"
        onPress={() =>
          loginUserSuccess(token, () => {
            () => {};
          })
        }
      />
    </>
  );
};

describe('All the related tests with the AuthContext and AuthContext Provider', () => {
  test('should show an error after pressing the press me button', () => {
    const { getByTestId } = render(
      <AuthContextProvider>
        <TestingComponent />
      </AuthContextProvider>,
    );
    act(() => {
      fireEvent.press(getByTestId('setError'));
    });
    expect(getByTestId('errorMessage').props.children).toMatch(expectedErrorMessage);
    expect(getByTestId('errorMessage').props.children).not.toMatch(/acd/);
  });

  test('should show the text error empty after pressing the clean me button', () => {
    const { getByTestId } = render(
      <AuthContextProvider>
        <TestingComponent />
      </AuthContextProvider>,
    );
    act(() => {
      fireEvent.press(getByTestId('setError'));
    });
    expect(getByTestId('errorMessage').props.children).toMatch(expectedErrorMessage);
    expect(getByTestId('errorMessage').props.children).not.toMatch(/acd/);
    fireEvent.press(getByTestId('cleanError'));
    expect(getByTestId('errorMessage').props.children).toMatch('');
    expect(getByTestId('errorMessage').props.children).not.toMatch(expectedErrorMessage);
  });

  test('should get the authToken after pressing the loginSuccess button', async () => {
    const { getByTestId } = render(
      <AuthContextProvider>
        <TestingComponent />
      </AuthContextProvider>,
    );
    await act(() => {
      fireEvent.press(getByTestId('loginSuccess'));
    });
    await waitFor(() => {
      expect(getByTestId('authToken').props.children).toMatch(token);
      expect(getByTestId('authToken').props.children).not.toMatch(/''/);
    });
  });
  test('should change the stored value paired with the key "isUsingBiometrics" to 1 or 0, and update the isBiometricsActive status value to true of false', async () => {
    const { getByTestId } = render(
      <AuthContextProvider>
        <TestingComponent />
      </AuthContextProvider>,
    );
    expect(getByTestId('biometricsToggleValue').props.children).toBeFalsy();
    await act(() => {
      fireEvent.press(getByTestId('switchBiometrics'));
    });
    await waitFor(() => {
      expect(getByTestId('biometricsToggleValue').props.children).toBeTruthy();
    });
  });
});
