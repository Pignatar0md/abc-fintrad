import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { ORDERS_GET_LIST, ORDERS_GET_LIST_ERROR, ORDERS_GET_LIST_SUCCESS } from './actionTypes';
import { ActionType, OrdersState, OrderItem } from 'types/state';
import { initialOrdersState } from 'screens/Authenticated/initialStates';

const ordersReducer = (state: OrdersState, action: ActionType) => {
  switch (action.type) {
    case ORDERS_GET_LIST:
      return { ...state, errorMessage: '' };
    case ORDERS_GET_LIST_SUCCESS:
      return { ...state, errorMessage: '', ordersList: action.payload as any };
    case ORDERS_GET_LIST_ERROR:
      return { ...state, errorMessage: action.payload as any };
    default:
      return state;
  }
};

export const OrdersContext = createContext({
  ordersInfo: initialOrdersState,
  ordersGetList: () => {
    // only to initialize
  },
  ordersGetListError: (message: string) => {
    // only to initialize
  },
  ordersGetListSuccess: (ordersList: OrderItem[]) => {
    // only to initialize
  },
});

export const OrderContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialOrdersState);

  const ordersGetList = () => {
    dispatch({ type: ORDERS_GET_LIST });
  };

  const ordersGetListError = (message: string) => {
    dispatch({ type: ORDERS_GET_LIST_ERROR, payload: message });
  };

  const ordersGetListSuccess = (paymentsList: OrderItem[]) => {
    dispatch({ type: ORDERS_GET_LIST_SUCCESS, payload: paymentsList });
  };

  return (
    <OrdersContext.Provider
      value={{
        ordersInfo: state,
        ordersGetList,
        ordersGetListError,
        ordersGetListSuccess,
      }}>
      {children}
    </OrdersContext.Provider>
  );
};
