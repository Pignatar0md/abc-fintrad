import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { CurrencyBalance } from 'types/screens';
import { ActionType, BalanceState } from 'types/state';
import {
  ACCOUNTBALANCE_SET_ERROR,
  ACCOUNTBALANCE_SET_INFO,
  ACCOUNTBALANCE_SET_NEGATIVES,
  ACCOUNTBALANCE_SET_POSITIVES,
} from './actionTypes';
import { initialBalanceState } from 'screens/Authenticated/initialStates';

const balanceReducer = (state: BalanceState, action: ActionType) => {
  switch (action.type) {
    case ACCOUNTBALANCE_SET_INFO:
      return { ...state, all: action.payload as CurrencyBalance[], errorMessage: '' };
    case ACCOUNTBALANCE_SET_POSITIVES:
      return { ...state, positives: action.payload as CurrencyBalance[], errorMessage: '' };
    case ACCOUNTBALANCE_SET_NEGATIVES:
      return { ...state, negatives: action.payload as CurrencyBalance[], errorMessage: '' };
    case ACCOUNTBALANCE_SET_ERROR:
      return { ...state, errorMessage: action.payload as string };
    default:
      return state;
  }
};

export const AccountBalanceContext = createContext({
  balanceInfo: initialBalanceState,
  setBalanceSuccess: (balance: CurrencyBalance[]) => {
    //only as an initialization
  },
  setBalancePositives: (balance: CurrencyBalance[]) => {
    //only as an initialization
  },
  setBalanceNegatives: (balance: CurrencyBalance[]) => {
    //only as an initialization
  },
  setBalanceError: (errorMessage: string) => {
    //only as an initialization
  },
});

export const AccountBalanceContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(balanceReducer, initialBalanceState);

  const setBalanceSuccess = (balance: CurrencyBalance[]) => {
    dispatch({ type: ACCOUNTBALANCE_SET_INFO, payload: balance });
  };

  const setBalancePositives = (balance: CurrencyBalance[]) => {
    dispatch({ type: ACCOUNTBALANCE_SET_POSITIVES, payload: balance });
  };

  const setBalanceNegatives = (balance: CurrencyBalance[]) => {
    dispatch({ type: ACCOUNTBALANCE_SET_NEGATIVES, payload: balance });
  };

  const setBalanceError = (errorMessage: string) => {
    dispatch({ type: ACCOUNTBALANCE_SET_ERROR, payload: errorMessage });
  };

  return (
    <AccountBalanceContext.Provider
      value={{
        balanceInfo: state,
        setBalanceSuccess,
        setBalancePositives,
        setBalanceNegatives,
        setBalanceError,
      }}>
      {children}
    </AccountBalanceContext.Provider>
  );
};
