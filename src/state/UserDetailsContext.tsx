import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { storePlaneObjectData } from 'utils/localStorage';
import { USERDETAILS_SET_INFO, USERDETAILS_SET_DEFAULT_CURRENCY } from './actionTypes';
import { ActionType, UserDetailsState } from '../types/state';
import { dropdownInitState } from 'screens/Authenticated/initialStates';

const initialUserDetailsState = {
  userInformation: {
    AccountNumber: '',
    AddressVerificationMode: 0,
    PINRequired: false,
    Address1: '',
    AccountType: null,
    Country: '',
    TradingAllowed: false,
  },
  defaultCurrency: dropdownInitState,
};

const userDetailsReducer = (state: UserDetailsState, action: ActionType) => {
  switch (action.type) {
    case USERDETAILS_SET_INFO:
      return {
        ...state,
        userInformation: action.payload as any,
      };
    case USERDETAILS_SET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: { value: action.payload, label: action.payload } as any,
      };
    default:
      return state;
  }
};

export const UserDetailsContext = createContext({
  userInfo: initialUserDetailsState,
  userDetailsSetInfo: (userInfo: UserDetailsState) => {
    // only to initialize
  },
  userDetailsSetDefaultCcy: (defaultCcy: string) => {
    // only to initialize
  },
});

export const UserDetailsContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userDetailsReducer, initialUserDetailsState);

  const userDetailsSetInfo = async (userDetails: UserDetailsState) => {
    await storePlaneObjectData('userDetails', {
      userDetails,
    });
    dispatch({ type: USERDETAILS_SET_INFO, payload: userDetails });
  };

  const userDetailsSetDefaultCcy = async (defaultCcy: string) => {
    await storePlaneObjectData('defaultCurrency', { label: defaultCcy, value: defaultCcy });
    dispatch({ type: USERDETAILS_SET_DEFAULT_CURRENCY, payload: defaultCcy });
  };

  return (
    <UserDetailsContext.Provider
      value={{
        userInfo: state,
        userDetailsSetInfo,
        userDetailsSetDefaultCcy,
      }}>
      {children}
    </UserDetailsContext.Provider>
  );
};
