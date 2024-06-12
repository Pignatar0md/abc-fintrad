import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { RATES_GET_INFO, RATES_GET_ERROR } from './actionTypes';
import { ActionType, RatesState } from '../types/state';
import { Rate } from 'types/screens';
import { initialRatesState } from 'screens/Authenticated/initialStates';

const ratesReducer = (state: RatesState, action: ActionType) => {
  switch (action.type) {
    case RATES_GET_INFO:
      return {
        ...state,
        ratesList: action.payload as any,
        errorMessage: '',
      };
    case RATES_GET_ERROR:
      return {
        ...state,
        errorMessage: action.payload as any,
      };
    default:
      return state;
  }
};

export const RatesContext = createContext({
  ratesInfo: initialRatesState,
  ratesGetInfo: (ratesInfo: Rate[]) => {
    // only to initialize
  },
  ratesGetError: (errorMessage: string) => {
    // only to initialize
  },
});

export const RatesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ratesReducer, initialRatesState);

  const ratesGetInfo = (ratesInfo: Rate[]) => {
    dispatch({ type: RATES_GET_INFO, payload: ratesInfo });
  };

  const ratesGetError = (errorMessage: string) => {
    dispatch({ type: RATES_GET_ERROR, payload: errorMessage });
  };

  return (
    <RatesContext.Provider
      value={{
        ratesInfo: state,
        ratesGetInfo,
        ratesGetError,
      }}>
      {children}
    </RatesContext.Provider>
  );
};

//DELETE RATESCONTEXT
