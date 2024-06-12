import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { VALIDATE_DEVICE_RESET_ERROR_MESSAGE, VALIDATE_DEVICE_ERROR } from './actionTypes';
import { ActionType, DeviceValidationState } from 'types/state';

const initialDeviceValidationState = {
  errorMessage: '',
};

const deviceValidationReducer = (state: DeviceValidationState, action: ActionType) => {
  switch (action.type) {
    case VALIDATE_DEVICE_RESET_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    case VALIDATE_DEVICE_ERROR:
      return { ...state, errorMessage: action.payload as string };
    default:
      return state;
  }
};

export const DeviceValidationContext = createContext({
  deviceValidationInfo: initialDeviceValidationState,
  validateMessageError: (errorMessage: string) => {
    //only as an initialization
  },
  resetErrorMessage: () => {
    //only as an initialization
  },
});

export const DeviceValidationContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const validateMessageError = (errorMessage: string) => {
    dispatch({ type: VALIDATE_DEVICE_ERROR, payload: errorMessage });
  };
  const resetErrorMessage = () => {
    dispatch({ type: VALIDATE_DEVICE_RESET_ERROR_MESSAGE });
  };

  const [state, dispatch] = useReducer(deviceValidationReducer, initialDeviceValidationState);

  return (
    <DeviceValidationContext.Provider
      value={{
        deviceValidationInfo: state,
        validateMessageError,
        resetErrorMessage,
      }}>
      {children}
    </DeviceValidationContext.Provider>
  );
};
