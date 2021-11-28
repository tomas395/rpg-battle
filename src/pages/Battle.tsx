import { useContext, useRef, useEffect } from 'react';

import { AppStateContext } from '../state';
import { actionCreators, thunks } from '../actions';
import {
  GameStatesEnum,
  LEFT_ENEMY_GROUP,
  NEW_GAME,
  RIGHT_ENEMY_GROUP,
  ATTACK,
  TECH,
  ITEM,
  DEFEND,
} from '../constants';
import { generateQueue } from '../utils';
import Battle from '../components/Battle';

const { PLAYER_INPUT, POST_EXECUTION } = GameStatesEnum;

const {
  startNewRound: startNewRoundAction,
  setQueueIndex,
  incrementQueueIndex,
  setGameState,
  setPlayerInterrupt,
} = actionCreators;
const { postExecutionThunk, attackThunk, newGameThunk } = thunks;

const BattlePage = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, groups, queue, queueIndex, playerInterrupt } = state;
  const prevQueueIndex = useRef(queueIndex);
  const prevGameState = useRef(gameState);

  useEffect(() => {
    if (queueIndex !== null && queueIndex !== prevQueueIndex.current) {
      prevQueueIndex.current = queueIndex;

      if (queue[queueIndex]) {
        const { type, actor, target } = queue[queueIndex];

        const { group: actorGroup, index: actorIndex } = actor;
        const actorEntity = groups[actorGroup].entities[actorIndex];

        // TODO: also check status (paralyzed, etc.)
        if (actorEntity.hp <= 0) {
          dispatch(incrementQueueIndex());
          return;
        }

        // TODO
        let action =
          type === ATTACK
            ? attackThunk
            : type === TECH
            ? attackThunk
            : type === ITEM
            ? attackThunk
            : type === DEFEND
            ? attackThunk
            : undefined;

        if (typeof action === 'function') {
          dispatch(action(actor, target));
        }

        // TODO: ideally we would be able to wait for actionCreator to finish and then dispatch gameState: POST_EXECUTION here (should be doable since no new state is needed)
      } else {
        if (playerInterrupt) {
          dispatch(setGameState(PLAYER_INPUT));
          dispatch(setQueueIndex(null));
          dispatch(setPlayerInterrupt(false));
        } else {
          dispatch(setQueueIndex(0));
        }
      }
    }
  }, [queueIndex, gameState, queue, groups, playerInterrupt, dispatch]);

  useEffect(() => {
    if (gameState === NEW_GAME) {
      dispatch(newGameThunk());
    } else if (gameState !== prevGameState.current) {
      // enemy pre-emptive attack chance
      if (prevGameState.current === NEW_GAME) {
        // TODO: maybe check speed or luck or something
        if (Math.random() > 0.9) {
          const newQueue = generateQueue([
            ...groups[LEFT_ENEMY_GROUP].entities,
            ...groups[RIGHT_ENEMY_GROUP].entities,
          ]);

          dispatch(startNewRoundAction(newQueue));
          dispatch(setPlayerInterrupt(true));
        } else {
          dispatch(setGameState(PLAYER_INPUT));
        }
      } else if (gameState === POST_EXECUTION) {
        dispatch(postExecutionThunk());
      }

      prevGameState.current = gameState;
    }
  }, [gameState, groups, dispatch]);

  return <Battle />;
};

export default BattlePage;
