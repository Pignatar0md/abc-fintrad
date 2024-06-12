import React, { createContext, FC, ReactNode, useReducer } from 'react';
import { CONTACT_US_RESET_ERROR_MESSAGE, CONTACT_US_SENDMESSAGE_ERROR } from './actionTypes';
import { ActionType, ContactUsState } from 'types/state';

const initialContactUsState = {
  errorMessage: '',
};

const contactUsReducer = (state: ContactUsState, action: ActionType) => {
  switch (action.type) {
    case CONTACT_US_RESET_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    case CONTACT_US_SENDMESSAGE_ERROR:
      return { ...state, errorMessage: action.payload as string };
    default:
      return state;
  }
};

export const ContactUsContext = createContext({
  contactUsInfo: initialContactUsState,
  sendMessageError: (errorMessage: string) => {
    //only as an initialization
  },
  resetErrorMessage: () => {
    //only as an initialization
  },
});

export const ContactUsContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const sendMessageError = (errorMessage: string) => {
    dispatch({ type: CONTACT_US_SENDMESSAGE_ERROR, payload: errorMessage });
  };
  const resetErrorMessage = () => {
    dispatch({ type: CONTACT_US_RESET_ERROR_MESSAGE });
  };

  const [state, dispatch] = useReducer(contactUsReducer, initialContactUsState);

  return (
    <ContactUsContext.Provider
      value={{
        contactUsInfo: state,
        sendMessageError,
        resetErrorMessage,
      }}>
      {children}
    </ContactUsContext.Provider>
  );
};
