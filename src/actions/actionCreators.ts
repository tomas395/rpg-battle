import { Dispatch } from 'react';
import {
  START_NEW_GAME,
  START_NEW_ROUND,
  WIN_GAME,
  LOSE_GAME,
  SET_QUEUE_INDEX,
  INCREMENT_QUEUE_INDEX,
  SET_GAME_STATE,
  SET_PLAYER_INTERRUPT,
  SET_ACTIVE_HERO,
  QUEUE_ACTION,
  SET_GROUP_MESSAGE,
  SET_ENTITY_ANIMATION,
  SET_ENTITY_STATUS,
  ENTITY_DAMAGE,
} from './actionTypes';
import {
  AppStateType,
  ActionType,
  TargetType,
  EntityActionType,
  ActorType,
} from '../types';
import {
  EXECUTING,
  POST_EXECUTION,
  EntityActionTypesEnum,
  AnimationTypesEnum,
  TARGETED,
  IDLE,
  HURT,
  EntityStatusesEnum,
  DYING,
  DEAD,
  OK,
  PLAYER_GROUP,
  RIGHT_ENEMY_GROUP,
  LEFT_ENEMY_GROUP,
  SLASH,
  ANIMATION_DURATION_MAP,
} from '../constants';

export const startNewGame = (newGameState: AppStateType) => ({
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

export const setActiveHero = (activeIndex: number) => ({
  type: SET_ACTIVE_HERO,
  payload: activeIndex,
});

export const queueAction = ({
  heroIndex,
  target,
  type,
}: {
  heroIndex: number;
  target: TargetType;
  type: EntityActionTypesEnum;
}) => ({
  type: QUEUE_ACTION,
  payload: {
    heroIndex,
    target,
    type,
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

export const entityDamage = (target: TargetType, attackPower: number) => ({
  type: ENTITY_DAMAGE,
  payload: { target, attackPower },
});

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const newGameThunk = () => async (dispatch: Dispatch<ActionType>) => {
  await timeout(3000);
  dispatch(setGameState(EXECUTING));
};

export const attackThunk =
  (actor: ActorType, target: TargetType) =>
  async (dispatch: Dispatch<ActionType>, getState: any) => {
    const { groups } = getState();

    const { group: actorGroup, index: actorIndex } = actor;
    const actorEntity = groups[actorGroup].entities[actorIndex];
    const { group: targetGroup, index: targetIndex } = target;

    // TODO: check actor equipped weapon from state to determine which animation to trigger (SLASH vs SHOOT, etc.)
    const attackAnimationType = SLASH;
    // TODO: need get average position of group/groups instead of falling back to 50% (though 50% would be a valid fallback for anything larger than a single group)
    const targetLeftPosition =
      targetIndex !== undefined
        ? groups[targetGroup].entities[targetIndex].leftPosition
        : '50%';

    dispatch(
      setEntityAnimation(actor, {
        type: attackAnimationType,
        left: targetLeftPosition,
      })
    );
    dispatch(
      setEntityAnimation(target, {
        type: TARGETED,
        left:
          targetGroup === PLAYER_GROUP ? actorEntity.leftPosition : undefined,
      })
    );
    await timeout(ANIMATION_DURATION_MAP[attackAnimationType]);
    dispatch(setEntityAnimation(actor, IDLE));

    // TODO: use full actor and target entities from state to determine who gets hit and for how much
    // TODO: loop over target group if array
    const attackPower = Math.floor(Math.random() * 5);
    let crit = false;
    if (Math.random() > 0.85) {
      crit = true;
    }

    if (attackPower > 0) {
      if (crit) {
        dispatch(
          setGroupMessage({
            target: { group: PLAYER_GROUP },
            message: 'terrific blow!!!',
          })
        );
      }
      if (actorGroup === PLAYER_GROUP) {
        dispatch(
          setGroupMessage({
            target,
            message: attackPower,
          })
        );
      }
      // TODO: may have to implement some weird offset cascade of each animation dispatch for group attacks
      dispatch(
        setEntityAnimation(target, {
          type: HURT,
          left:
            target.group === PLAYER_GROUP
              ? actorEntity.leftPosition
              : undefined,
        })
      );
      await timeout(ANIMATION_DURATION_MAP[HURT]);
      if (actorGroup === PLAYER_GROUP) {
        dispatch(
          setGroupMessage({
            target,
            message: '',
          })
        );
      }
      dispatch(entityDamage(target, crit ? attackPower * 2 : attackPower));
      if (crit) {
        dispatch(
          setGroupMessage({
            target: { group: PLAYER_GROUP },
            message: '',
          })
        );
      }
      dispatch(setEntityAnimation(target, { type: IDLE, left: -1 }));
    } else {
      if (actorGroup === PLAYER_GROUP) {
        dispatch(
          setGroupMessage({
            target,
            message: 'miss',
          })
        );
      }
      await timeout(1000);
      if (actorGroup === PLAYER_GROUP) {
        dispatch(
          setGroupMessage({
            target,
            message: '',
          })
        );
      }
      dispatch(setEntityAnimation(target, IDLE));
    }

    // need to dispatch this at the end of any queue action to progress the queue
    dispatch(setGameState(POST_EXECUTION));
  };

export const postExecutionThunk =
  () => async (dispatch: Dispatch<ActionType>, getState: any) => {
    const {
      groups: {
        [PLAYER_GROUP]: playerGroup,
        [LEFT_ENEMY_GROUP]: leftEnemyGroup,
        [RIGHT_ENEMY_GROUP]: rightEnemyGroup,
      },
    } = getState();

    let livingHeroes = 0;
    let livingLeft = 0;
    let livingRight = 0;

    for (const [index, hero] of playerGroup.entities.entries()) {
      const { status, currentAnimation, hp } = hero;

      // TODO: will need to account for paralyzed as well
      if (hp > 0 && status === OK) {
        dispatch(
          setEntityAnimation({ group: PLAYER_GROUP, index }, { type: IDLE })
        );
        livingHeroes++;
      } else if (currentAnimation.type !== DYING && status !== DEAD) {
        dispatch(
          setEntityAnimation(
            { group: PLAYER_GROUP, index },
            { type: DYING, left: -1 } // TODO: -1 thing is kind of hacky, maybe formalize into a preservePosition flag
          )
        );
        await timeout(ANIMATION_DURATION_MAP[DYING]);
        dispatch(setEntityStatus({ group: PLAYER_GROUP, index }, DEAD));
        dispatch(setEntityAnimation({ group: PLAYER_GROUP, index }, IDLE));
      }
    }
    for (const [index, enemy] of leftEnemyGroup.entities.entries()) {
      const { status, currentAnimation, hp } = enemy;

      if (hp > 0 && status === OK) {
        livingLeft++;
      } else if (currentAnimation.type !== DYING && status !== DEAD) {
        dispatch(setEntityAnimation({ group: LEFT_ENEMY_GROUP, index }, DYING));
        await timeout(ANIMATION_DURATION_MAP[DYING]);
        dispatch(setEntityStatus({ group: LEFT_ENEMY_GROUP, index }, DEAD));
        dispatch(setEntityAnimation({ group: LEFT_ENEMY_GROUP, index }, IDLE));
      }
    }
    for (const [index, enemy] of rightEnemyGroup.entities.entries()) {
      const { status, currentAnimation, hp } = enemy;

      if (hp > 0 && status === OK) {
        livingRight++;
      } else if (currentAnimation.type !== DYING && status !== DEAD) {
        dispatch(
          setEntityAnimation({ group: RIGHT_ENEMY_GROUP, index }, DYING)
        );
        await timeout(ANIMATION_DURATION_MAP[DYING]);
        dispatch(setEntityStatus({ group: RIGHT_ENEMY_GROUP, index }, DEAD));
        dispatch(setEntityAnimation({ group: RIGHT_ENEMY_GROUP, index }, IDLE));
      }
    }

    await timeout(500);

    if (!livingHeroes) {
      dispatch(loseGame());
    } else if (!livingLeft && !livingRight) {
      dispatch(winGame());
    } else {
      dispatch(incrementQueueIndex());
      dispatch(setGameState(EXECUTING));
    }
  };
