import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { getPlaneStringData, secureStore, storePlaneStringData } from 'utils/localStorage';
import { SLIDER_WAS_SHOWN } from 'utils/static';
import {
  LOGIN_RESET_ERROR_MESSAGE,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_SWITCH_BIOMETRICS,
} from './actionTypes';
import { ActionType, AuthState } from '../types/state';
import { navigateType } from 'types/types';
import { initialAuthState } from 'screens/Authenticated/initialStates';

const authReducer = (state: AuthState, action: ActionType) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return { ...state, authToken: action.payload as string, errorMessage: '' };
    case LOGIN_USER_SWITCH_BIOMETRICS:
      return { ...state, isBiometricsActive: action.payload as boolean };
    case LOGIN_USER_ERROR:
      return { ...state, errorMessage: action.payload as string };
    case LOGIN_RESET_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
};

export const AuthContext = createContext({
  authInfo: initialAuthState,
  loginUserSuccess: (authToken: string, navigation: navigateType) => {
    //only as an initialization
  },
  loginUserError: (errorMessage: string) => {
    //only as an initialization
  },
  switchActiveBiometrics: (isBiometricsActive: boolean) => {
    //only as an initialization
  },
  resetErrorMessage: () => {
    //only as an initialization
  },
});

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const loginUserSuccess = async (authToken: string, navigation: navigateType) => {
    await secureStore('authToken', authToken);
    dispatch({ type: LOGIN_USER_SUCCESS, payload: authToken });

    const alreadyShownSlider = await getPlaneStringData(SLIDER_WAS_SHOWN);
    alreadyShownSlider === '1'
      ? navigation.navigate('Sidebar')
      : navigation.navigate('IntroSlider');
  };

  const loginUserError = (errorMessage: string) => {
    dispatch({ type: LOGIN_USER_ERROR, payload: errorMessage });
  };

  const switchActiveBiometrics = async (isBiometricsActive: boolean) => {
    await storePlaneStringData('isUsingBiometrics', isBiometricsActive ? '1' : '0');
    dispatch({ type: LOGIN_USER_SWITCH_BIOMETRICS, payload: isBiometricsActive });
  };

  const resetErrorMessage = () => {
    dispatch({ type: LOGIN_RESET_ERROR_MESSAGE });
  };

  return (
    <AuthContext.Provider
      value={{
        authInfo: state,
        loginUserSuccess,
        loginUserError,
        resetErrorMessage,
        switchActiveBiometrics,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
