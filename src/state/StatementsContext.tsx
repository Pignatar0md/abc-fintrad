import React, { createContext, FC, ReactNode, useReducer } from 'react';
import {
  STATEMENTS_SET_CCYCARDS_INFO,
  STATEMENTS_SET_BALANCES_INFO,
  STATEMENTS_SET_CCIES_INFO,
  STATEMENTS_SET_CARDS_TX_LIST,
  STATEMENTS_SET_CCY_TX_LIST,
} from './actionTypes';
import { StatementsState, ActionType, CCyCard } from 'types/state';
import { DropDownCurrency } from 'interfaces/forms';
import { dropdownInitState } from 'screens/Authenticated/initialStates';

const initialStatementsState = {
  currencyCards: [dropdownInitState],
  ccies: [dropdownInitState],
  vfxCardsTransactions: [],
  allTransactions: [],
  balances: [{ id: 0, title: '', value: 0 }],
};

const statementsReducer = (state: StatementsState, action: ActionType) => {
  switch (action.type) {
    case STATEMENTS_SET_BALANCES_INFO: {
      const [EndingBalance, OpeningBalance] = action.payload;
      return {
        ...state,
        balances: [
          { id: 0, title: 'spotBalance', value: EndingBalance },
          { id: 1, title: 'closingBalance', value: EndingBalance },
          { id: 2, title: 'openingBalance', value: OpeningBalance },
        ],
      };
    }
    case STATEMENTS_SET_CCIES_INFO:
      return {
        ...state,
        ccies: action.payload as any,
      };
    case STATEMENTS_SET_CCYCARDS_INFO:
      return {
        ...state,
        currencyCards: action.payload as any,
      };
    case STATEMENTS_SET_CARDS_TX_LIST:
      return {
        ...state,
        vfxCardsTransactions: action.payload as any,
      };
    case STATEMENTS_SET_CCY_TX_LIST:
      return {
        ...state,
        allTransactions: action.payload as any,
      };
    default:
      return state;
  }
};

export const StatementsContext = createContext({
  statementsInfo: initialStatementsState,
  ccyCardsSetInfo: (ccyCardsDetails: CCyCard[]) => {
    // only to initialize
  },
  setCcyCardStatements: (statements: any[]) => {
    // only to initialize
  },
  setCcyAllStatements: (statements: any[]) => {
    // only to initialize
  },
  setCciesStatements: (ccies: { label: string; value: string }[]) => {
    // only to initialize
  },
  setBalances: (data: any) => {
    // only to initialize
  },
});

export const StatementsContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(statementsReducer, initialStatementsState);

  const setCcyCardStatements = (statements: any[]) => {
    dispatch({ type: STATEMENTS_SET_CARDS_TX_LIST, payload: statements });
  };

  const setCcyAllStatements = (statements: any[]) => {
    dispatch({ type: STATEMENTS_SET_CCY_TX_LIST, payload: statements });
  };

  const setCciesStatements = (ccies: { label: string; value: string }[]) => {
    dispatch({ type: STATEMENTS_SET_CCIES_INFO, payload: ccies });
  };

  const ccyCardsSetInfo = (ccyCardsDetails: CCyCard[]) => {
    const dataForCardLabel: DropDownCurrency[] = [];
    ccyCardsDetails?.map(({ ID, CardNumber }: CCyCard) => {
      dataForCardLabel.push({ value: ID + '', label: CardNumber.substring(7), sortCode: '' });
    });
    dispatch({ type: STATEMENTS_SET_CCYCARDS_INFO, payload: dataForCardLabel });
  };

  const setBalances = ({
    EndingBalance,
    OpeningBalance,
  }: {
    EndingBalance: number;
    OpeningBalance: number;
  }) => {
    dispatch({ type: STATEMENTS_SET_BALANCES_INFO, payload: [EndingBalance, OpeningBalance] });
  };

  return (
    <StatementsContext.Provider
      value={{
        statementsInfo: state,
        ccyCardsSetInfo,
        setCcyCardStatements,
        setCcyAllStatements,
        setCciesStatements,
        setBalances,
      }}>
      {children}
    </StatementsContext.Provider>
  );
};
