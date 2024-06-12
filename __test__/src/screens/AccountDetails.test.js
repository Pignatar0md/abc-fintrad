import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import AccountDetails from 'screens/Authenticated/Account/AccountDetails';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { createTestProps } from '../../testHelpers';

describe('All the tests related to the AccountDetails screen', () => {
  let renderedComponent = '';
  let props;

  const expectedAccountNumber = '33333333';
  beforeEach(() => {
    props = createTestProps({});
    const componentToTest = (
      <UserDetailsContext.Provider //mocking of react context
        value={{
          userInfo: { userInformation: { AccountNumber: expectedAccountNumber } },
        }}>
        <AccountDetails {...props} />
      </UserDetailsContext.Provider>
    );
    renderedComponent = render(componentToTest);
  });

  afterEach(() => {
    cleanup();
  });

  test('Should show the account currency and bank icon', () => {
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[0].props.children.props
        .children[0].props.icon,
    ).toBeDefined();

    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[0].props.children.props
        .children[0].props.icon,
    ).toEqual('bank-outline');

    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[0].props.children.props
        .children[1].props.text,
    ).toEqual('GBP accountMayusc');
  });

  test('Should show the bank account name and the "bank account" title', () => {
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[1].props.children.props
        .children.length,
    ).toEqual(2);
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[1].props.children.props
        .children[0].props.text,
    ).toEqual('bankAccount');
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[1].props.children.props
        .children[1].props.text,
    ).toEqual('ABC Fintrad LLC');
  });

  test('Should show the sort code and the "sort code" title', () => {
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[2].props.children.props
        .children.length,
    ).toEqual(2);
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[2].props.children.props
        .children[0].props.text,
    ).toEqual('sortCode');
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[2].props.children.props
        .children[1].props.text,
    ).toEqual(230088);
  });

  test('Should show the account number and the "account number" title', () => {
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[3].props.children.props
        .children[0].props.text,
    ).toEqual('accountNumber');
    expect(
      renderedComponent.getByTestId('acountDetails.Wrapper').props.children[3].props.children.props
        .children[1].props.text,
    ).toEqual(expectedAccountNumber);
  });
});
