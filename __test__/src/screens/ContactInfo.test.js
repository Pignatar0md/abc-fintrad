import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import ContactInfo from 'screens/Contact/ContactInfo';

describe('All the tests related to the ContactInfo screen', () => {
  let renderedComponent = '';
  const screenTitleTestID = 'contactInfo.title';
  const phoneNumberTestID = 'contactInfo.phoneNumber';
  const serviceSupportTimeTestID = 'contactInfo.supportTimeInfo';

  beforeEach(() => {
    const componentToTest = <ContactInfo />;
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('Should show the phone number, the screen title and the support service time', () => {
    const title = renderedComponent.getByTestId(screenTitleTestID).props.children;
    const phoneNumber = renderedComponent.getByTestId(phoneNumberTestID).props.children;
    const serviceSupportTime =
      renderedComponent.getByTestId(serviceSupportTimeTestID).props.children;

    const expectedTitle = 'cantFindAnswer';
    const expectedPhoneNumber = 'contactPhoneNumber';
    const expectedSupportTime = 'contactSupportTime';

    expect(title).toMatch(expectedTitle);
    expect(phoneNumber).toMatch(expectedPhoneNumber);
    expect(serviceSupportTime).toMatch(expectedSupportTime);
  });
});
