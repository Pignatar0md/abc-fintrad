import React, { useContext } from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import {
  DeviceValidationContext,
  DeviceValidationContextProvider,
} from 'state/DeviceValidationContext';

const expectedErrorMessage = 'Something went wrong';

const TestingComponent = () => {
  const { deviceValidationInfo, validateMessageError, resetErrorMessage } =
    useContext(DeviceValidationContext);
  return (
    <>
      <Text testID="errorMessage">{deviceValidationInfo.errorMessage}</Text>
      <Button
        testID="setError"
        title="press me"
        onPress={() => validateMessageError(expectedErrorMessage)}
      />
      <Button testID="cleanError" title="clean me" onPress={() => resetErrorMessage()} />
    </>
  );
};

describe('All the related tests with the DeviceValidation Context and DeviceValidation Context Provider', () => {
  test('should show an error after pressing the press me button', () => {
    const { getByTestId } = render(
      <DeviceValidationContextProvider>
        <TestingComponent />
      </DeviceValidationContextProvider>,
    );
    act(() => {
      fireEvent.press(getByTestId('setError'));
    });
    expect(getByTestId('errorMessage').props.children).toMatch(expectedErrorMessage);
    expect(getByTestId('errorMessage').props.children).not.toMatch(/acd/);
  });

  test('should show the text error empty after pressing the clean me button', () => {
    const { getByTestId } = render(
      <DeviceValidationContextProvider>
        <TestingComponent />
      </DeviceValidationContextProvider>,
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
});
