import React, { useContext } from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';
import { ContactUsContext, ContactUsContextProvider } from 'state/ContactUsContext';

const expectedErrorMessage = 'Something went wrong';

const TestingComponent = () => {
  const { contactUsInfo, sendMessageError, resetErrorMessage } = useContext(ContactUsContext);
  return (
    <>
      <Text testID="errorMessage">{contactUsInfo.errorMessage}</Text>
      <Button
        testID="setError"
        title="press me"
        onPress={() => sendMessageError(expectedErrorMessage)}
      />
      <Button testID="cleanError" title="clean me" onPress={() => resetErrorMessage()} />
    </>
  );
};

describe('All the related tests with the ContactUsContext and ContactUsContext Provider', () => {
  test('should show an error after pressing the press me button', () => {
    const { getByTestId } = render(
      <ContactUsContextProvider>
        <TestingComponent />
      </ContactUsContextProvider>,
    );
    act(() => {
      fireEvent.press(getByTestId('setError'));
    });
    expect(getByTestId('errorMessage').props.children).toMatch(expectedErrorMessage);
    expect(getByTestId('errorMessage').props.children).not.toMatch(/acd/);
  });

  test('should show the text error empty after pressing the clean me button', () => {
    const { getByTestId } = render(
      <ContactUsContextProvider>
        <TestingComponent />
      </ContactUsContextProvider>,
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
