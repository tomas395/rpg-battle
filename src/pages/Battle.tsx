import { useContext, useRef, useEffect } from 'react';

import { AppStateContext } from '../state';
import { actionCreators } from '../actions';
import {
  GameStatesEnum,
  LEFT_ENEMY_GROUP,
  NEW_GAME,
  PLAYER_GROUP,
  RIGHT_ENEMY_GROUP,
} from '../constants';
import { generateQueue } from '../utils';
import Battle from '../components/Battle';

const { PLAYER_INPUT, POST_EXECUTION } = GameStatesEnum;

const {
  startNewRound: startNewRoundAction,
  setQueueIndex,
  incrementQueueIndex,
  postExecutionThunk,
  winGame,
  loseGame,
  setGameState,
  setPlayerInterrupt,
  attackThunk,
  newGameThunk,
} = actionCreators;

const BattlePage = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, groups, queue, queueIndex, playerInterrupt } = state;
  const prevQueueIndex = useRef(queueIndex);
  const prevGameState = useRef(gameState);

  useEffect(() => {
    if (queueIndex !== null && queueIndex !== prevQueueIndex.current) {
      prevQueueIndex.current = queueIndex;

      if (queue[queueIndex]) {
        const { actor, target } = queue[queueIndex];

        // TODO: randomize target selection from target group (only pass target group in queue object, no target index needed)
        const { group: actorGroup, index: actorIndex } = actor;
        let { group: targetGroup, index: targetIndex } = target;

        const actorEntity = groups[actorGroup].entities[actorIndex];

        if (actorEntity.hp <= 0) {
          dispatch(incrementQueueIndex());
          return;
        }

        // TODO: add support for no index passed (target entire group)
        // TODO: add support for array of groups

        if (targetGroup === PLAYER_GROUP) {
          if (
            targetIndex !== undefined &&
            (!groups[PLAYER_GROUP].entities[targetIndex] ||
              groups[PLAYER_GROUP].entities[targetIndex].hp <= 0)
          ) {
            targetIndex = groups[PLAYER_GROUP].entities.findIndex(
              ({ hp }) => hp > 0
            );

            if (targetIndex === -1) {
              dispatch(loseGame());
              return;
            }
          }
        } else if (
          targetGroup !== undefined &&
          targetIndex !== undefined &&
          (!groups[targetGroup].entities[targetIndex] ||
            groups[targetGroup].entities[targetIndex].hp <= 0)
        ) {
          targetIndex = groups[targetGroup].entities.findIndex(
            ({ hp }) => hp > 0
          );
          if (targetIndex === -1) {
            targetGroup =
              targetGroup === LEFT_ENEMY_GROUP
                ? RIGHT_ENEMY_GROUP
                : LEFT_ENEMY_GROUP;
            targetIndex = groups[targetGroup].entities.findIndex(
              ({ hp }) => hp > 0
            );

            if (targetIndex === -1) {
              dispatch(winGame());
              return;
            }
          }
        }

        const newTarget = {
          group: targetGroup,
          index: targetIndex,
        };

        // TODO: use action type to determine what thunk to dispatch
        dispatch(attackThunk(actor, newTarget));

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
    if (gameState !== prevGameState.current) {
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
      } else if (gameState === NEW_GAME) {
        dispatch(newGameThunk());
      } else if (gameState === POST_EXECUTION) {
        dispatch(postExecutionThunk());
      }

      prevGameState.current = gameState;
    }
  }, [gameState, groups, dispatch]);

  return <Battle />;
};

export default BattlePage;
