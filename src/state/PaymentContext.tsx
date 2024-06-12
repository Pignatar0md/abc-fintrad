import React, { createContext, FC, ReactNode, useReducer } from 'react';
import {
  PAYMENTS_GET_LIST,
  PAYMENTS_GET_LIST_SUCCESS,
  PAYMENTS_GET_LIST_ERROR,
} from './actionTypes';
import { ActionType, PaymentsState, PaymentItem } from 'types/state';
import { initialPaymentsState } from 'screens/Authenticated/initialStates';

const paymentReducer = (state: PaymentsState, action: ActionType) => {
  switch (action.type) {
    case PAYMENTS_GET_LIST:
      return { ...state, errorMessage: '' };
    case PAYMENTS_GET_LIST_SUCCESS:
      return { ...state, errorMessage: '', paymentsList: action.payload as any };
    case PAYMENTS_GET_LIST_ERROR:
      return { ...state, errorMessage: action.payload as any };
    default:
      return state;
  }
};

export const PaymentsContext = createContext({
  paymentsInfo: initialPaymentsState,
  paymentsGetList: () => {
    // only to initialize
  },
  paymentsGetListError: (message: string) => {
    // only to initialize
  },
  paymentsGetListSuccess: (paymentsList: PaymentItem[]) => {
    // only to initialize
  },
});

export const PaymentContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialPaymentsState);

  const paymentsGetList = () => {
    dispatch({ type: PAYMENTS_GET_LIST });
  };

  const paymentsGetListError = (message: string) => {
    dispatch({ type: PAYMENTS_GET_LIST_ERROR, payload: message });
  };

  const paymentsGetListSuccess = (paymentsList: PaymentItem[]) => {
    dispatch({ type: PAYMENTS_GET_LIST_SUCCESS, payload: paymentsList });
  };

  return (
    <PaymentsContext.Provider
      value={{
        paymentsInfo: state,
        paymentsGetList,
        paymentsGetListError,
        paymentsGetListSuccess,
      }}>
      {children}
    </PaymentsContext.Provider>
  );
};
