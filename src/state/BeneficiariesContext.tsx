import React, { createContext, FC, ReactNode, useReducer } from 'react';
import {
  BENEFICIARIES_SET_COUNTRIES,
  BENEFICIARIES_SET_COUNTRIES_ERROR,
  BENEFICIARIES_SET_CURRENCIES,
  BENEFICIARIES_GET_LIST,
  BENEFICIARIES_GET_LIST_ERROR,
  BENEFICIARIES_SET_CURRENCIES_ERROR,
} from './actionTypes';
import { Beneficiary, ActionType, BeneficiariesState } from 'types/state';
import { Country } from 'types/forms';
import {
  beneficiaryInitState,
  countryInitState,
  dropdownInitState,
} from 'screens/Authenticated/initialStates';

const initialBeneficiariesState = {
  countries: [countryInitState],
  beneficiaryList: [beneficiaryInitState],
  currencies: [dropdownInitState],
  errorMessage: '',
};

const beneficiariesReducer = (state: BeneficiariesState, action: ActionType) => {
  switch (action.type) {
    case BENEFICIARIES_SET_COUNTRIES:
      return { ...state, countries: action.payload as any };
    case BENEFICIARIES_SET_COUNTRIES_ERROR:
      return { ...state, errorMessage: action.payload as any };
    case BENEFICIARIES_SET_CURRENCIES:
      return { ...state, currencies: action.payload as any };
    case BENEFICIARIES_SET_CURRENCIES_ERROR:
      return { ...state, errorMessage: action.payload as any };
    case BENEFICIARIES_GET_LIST:
      return { ...state, beneficiaryList: action.payload as any };
    case BENEFICIARIES_GET_LIST_ERROR:
      return { ...state, errorMessage: action.payload as any };
    default:
      return state;
  }
};

export const BeneficiariesContext = createContext({
  beneficiariesInfo: initialBeneficiariesState,
  setCountriesForBeneficiaries: (countries: Country[]) => {
    //only as an initialization
  },
  setBeneficiariesError: (message: string) => {
    //only as an initialization
  },
  setCurrenciesForBeneficiaries: (currencies: []) => {
    //only as an initialization
  },
  setCurrenciesError: (message: string) => {
    //only as an initialization
  },
  setBeneficiaryList: (Benericiaries: Beneficiary[]) => {
    //only as an initialization
  },
  setBeneficiaryListError: (message: string) => {
    //only as an initialization
  },
});

export const BeneficiariesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const setCountriesForBeneficiaries = (countries: Country[]) => {
    dispatch({ type: BENEFICIARIES_SET_COUNTRIES, payload: countries });
  };
  const setBeneficiariesError = (message: string) => {
    dispatch({ type: BENEFICIARIES_SET_COUNTRIES_ERROR, payload: message });
  };
  const setCurrenciesForBeneficiaries = (currencies: []) => {
    dispatch({ type: BENEFICIARIES_SET_CURRENCIES, payload: currencies });
  };
  const setCurrenciesError = (message: string) => {
    dispatch({ type: BENEFICIARIES_SET_CURRENCIES_ERROR, payload: message });
  };
  const setBeneficiaryList = (Benericiaries: Beneficiary[]) => {
    dispatch({ type: BENEFICIARIES_GET_LIST, payload: Benericiaries });
  };
  const setBeneficiaryListError = (message: string) => {
    dispatch({ type: BENEFICIARIES_GET_LIST_ERROR, payload: message });
  };

  const [state, dispatch] = useReducer(beneficiariesReducer, initialBeneficiariesState);

  return (
    <BeneficiariesContext.Provider
      value={{
        beneficiariesInfo: state,
        setCountriesForBeneficiaries,
        setBeneficiaryList,
        setBeneficiaryListError,
        setBeneficiariesError,
        setCurrenciesForBeneficiaries,
        setCurrenciesError,
      }}>
      {children}
    </BeneficiariesContext.Provider>
  );
};
