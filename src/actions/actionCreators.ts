import {
  SET_PIXEL_MULTIPLIER,
  START_NEW_GAME,
  START_NEW_ROUND,
  WIN_GAME,
  LOSE_GAME,
  SET_QUEUE_INDEX,
  INCREMENT_QUEUE_INDEX,
  SET_GAME_STATE,
  SET_PLAYER_INTERRUPT,
  QUEUE_ACTION,
  SET_GROUP_MESSAGE,
  SET_ENTITY_ANIMATION,
  SET_ENTITY_STATUS,
  UPDATE_ENTITY_HP,
  UPDATE_ENTITY_TP,
  REMOVE_ENTITY_ITEM,
} from './actionTypes';
import { TargetType, EntityActionType } from '../types';
import {
  EntityActionTypesEnum,
  AnimationTypesEnum,
  EntityStatusesEnum,
} from '../constants';

export const setPixelMultiplier = (multiplier: number) => ({
  type: SET_PIXEL_MULTIPLIER,
  payload: multiplier,
});

// TODO: ts
export const startNewGame = (newGameState: any) => ({
  type: START_NEW_GAME,
  payload: newGameState,
});

export const startNewRound = (queue: EntityActionType[]) => ({
  type: START_NEW_ROUND,
  payload: queue,
});

export const winGame = () => ({ type: WIN_GAME });

export const loseGame = () => ({ type: LOSE_GAME });

export const setQueueIndex = (index: number | null) => ({
  type: SET_QUEUE_INDEX,
  payload: index,
});

export const incrementQueueIndex = () => ({
  type: INCREMENT_QUEUE_INDEX,
});

export const setGameState = (state: string) => ({
  type: SET_GAME_STATE,
  payload: state,
});

export const setPlayerInterrupt = (interrupt: boolean) => ({
  type: SET_PLAYER_INTERRUPT,
  payload: interrupt,
});

export const queueAction = ({
  heroIndex,
  target,
  type,
  techIndex,
  itemIndex,
}: {
  heroIndex: number;
  target?: TargetType;
  type: EntityActionTypesEnum;
  techIndex?: number;
  itemIndex?: number;
}) => ({
  type: QUEUE_ACTION,
  payload: {
    heroIndex,
    target,
    type,
    techIndex,
    itemIndex,
  },
});

export const setGroupMessage = ({
  target,
  message,
}: {
  target: TargetType;
  message: string | number;
}) => ({
  type: SET_GROUP_MESSAGE,
  payload: { target, message },
});

export const setEntityStatus = (
  target: TargetType,
  status: EntityStatusesEnum
) => ({
  type: SET_ENTITY_STATUS,
  payload: { target, status },
});

export const setEntityAnimation = (
  target: TargetType,
  animation:
    | AnimationTypesEnum
    | {
        type: AnimationTypesEnum;
        left?: number | string;
      }
) => ({
  type: SET_ENTITY_ANIMATION,
  payload: { target, animation },
});

export const updateEntityHP = (target: TargetType, offset: number) => ({
  type: UPDATE_ENTITY_HP,
  payload: { target, offset },
});

export const updateEntityTP = (target: TargetType, offset: number) => ({
  type: UPDATE_ENTITY_TP,
  payload: { target, offset },
});

export const removeEntityItem = (target: TargetType, itemIndex: number) => ({
  type: REMOVE_ENTITY_ITEM,
  payload: { target, itemIndex },
});
