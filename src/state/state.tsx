import {
  createContext,
  Dispatch,
  useReducer,
  useRef,
  useCallback,
} from 'react';

import { AppStateType, ActionType } from '../types';
import {
  INIT,
  LEFT_ENEMY_GROUP,
  PLAYER_GROUP,
  RIGHT_ENEMY_GROUP,
} from '../constants';
import reducer from './reducer';

export const initialState = {
  pixelMultiplier: 1,
  gameState: INIT,
  queue: [],
  queueIndex: null,
  playerInterrupt: false,
  groups: {
    [PLAYER_GROUP]: {
      entities: [],
      message: '',
    },
    [LEFT_ENEMY_GROUP]: {
      entities: [],
      message: '',
    },
    [RIGHT_ENEMY_GROUP]: {
      entities: [],
      message: '',
    },
  },
};

export const AppStateContext = createContext<[AppStateType, Dispatch<any>]>([
  initialState,
  () => null,
]);

// TODO: ts
export const AppStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevState = useRef();

  let customDispatch = useCallback((action: ActionType | void) => {
    if (typeof action === 'function') {
      // @ts-ignore
      action(customDispatch, () => prevState.current);
    } else {
      // @ts-ignore
      dispatch(action);
    }
  }, []);

  prevState.current = state;

  return (
    <AppStateContext.Provider value={[state, customDispatch]}>
      {children}
    </AppStateContext.Provider>
  );
};
