import { Dispatch } from 'react';
import { ActionType, TargetType, ActorType } from '../types';
import {
  EXECUTING,
  POST_EXECUTION,
  TARGETED,
  IDLE,
  HURT,
  DYING,
  DEAD,
  OK,
  PLAYER_GROUP,
  RIGHT_ENEMY_GROUP,
  LEFT_ENEMY_GROUP,
  SLASH,
  ANIMATION_DURATION_MAP,
  AnimationTypesEnum,
  USE,
  DAMAGE,
  HEAL,
  POISON,
  PARALYZE,
  SLEEP,
} from '../constants';
import {
  setGameState,
  setEntityAnimation,
  setEntityStatus,
  setGroupMessage,
  updateEntityHP,
  updateEntityTP,
  loseGame,
  winGame,
  incrementQueueIndex,
  removeEntityItem,
} from './actionCreators';
import { getTargetLeftPosition, retarget } from '../utils';

// TODO: pass getState to this function and call it right before resolving to see if new game has started and stop triggering more animations if so
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const newGameThunk = () => async (dispatch: Dispatch<ActionType>) => {
  await timeout(3000);
  dispatch(setGameState(EXECUTING));
};

export const attackThunk =
  (actor: ActorType, initialTarget: TargetType) =>
  async (dispatch: Dispatch<ActionType>, getState: any) => {
    const { groups } = getState();

    const { group: actorGroup, index: actorIndex } = actor;
    const actorEntity = groups[actorGroup].entities[actorIndex];
    const {
      equipment: { leftHand, rightHand },
    } = actorEntity;

    let { group: initialTargetGroup, index: initialTargetIndex } =
      initialTarget;

    const target = retarget(
      groups,
      actorGroup,
      initialTargetGroup,
      initialTargetIndex
    );
    const { group: targetGroup, index: targetIndex } = target;

    const attackAnimationType: AnimationTypesEnum =
      leftHand && 'twoHanded' in leftHand && leftHand.twoHanded
        ? leftHand.attackType
        : leftHand && 'attackType' in leftHand
        ? leftHand.attackType
        : rightHand && 'attackType' in rightHand
        ? rightHand.attackType
        : SLASH;

    const targetLeftPosition = getTargetLeftPosition(
      groups,
      targetGroup,
      targetIndex
    );

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
          targetGroup === PLAYER_GROUP && targetIndex !== undefined
            ? actorEntity.leftPosition
            : undefined,
      })
    );
    await timeout(ANIMATION_DURATION_MAP[attackAnimationType]);
    dispatch(setEntityAnimation(actor, IDLE));

    // TODO: use full actor and target entities from state to determine who gets hit and for how much
    // TODO: loop over target group if array
    // TODO: check to see if targets are currently defending
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
      dispatch(
        setEntityAnimation(target, {
          type: HURT,
          left:
            target.group === PLAYER_GROUP && targetIndex !== undefined
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
      dispatch(updateEntityHP(target, crit ? -attackPower * 2 : -attackPower));
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

export const techThunk =
  (actor: ActorType, initialTarget: TargetType, techIndex: number) =>
  async (dispatch: Dispatch<ActionType>, getState: any) => {
    const { groups } = getState();

    const { group: actorGroup, index: actorIndex } = actor;
    const actorEntity = groups[actorGroup].entities[actorIndex];
    const { techniques } = actorEntity;

    const techData = techniques[techIndex];
    const { name, effect, power, tp } = techData || {};

    let { group: initialTargetGroup, index: initialTargetIndex } =
      initialTarget;
    const target =
      effect === DAMAGE
        ? retarget(groups, actorGroup, initialTargetGroup, initialTargetIndex)
        : initialTarget;
    const { group: targetGroup, index: targetIndex } = target;

    const targetLeftPosition = getTargetLeftPosition(
      groups,
      targetGroup,
      targetIndex
    );

    const selfTargeting =
      actorGroup === targetGroup && actorIndex === targetIndex;

    dispatch(
      setEntityAnimation(actor, {
        type: USE,
        left:
          actorGroup === PLAYER_GROUP && targetGroup !== PLAYER_GROUP
            ? targetLeftPosition
            : undefined,
      })
    );

    if (!selfTargeting) {
      dispatch(
        setEntityAnimation(target, {
          type: TARGETED,
          left:
            actorGroup !== PLAYER_GROUP && targetIndex !== undefined
              ? actorEntity.leftPosition
              : undefined,
        })
      );
    }

    await timeout(ANIMATION_DURATION_MAP[USE]);

    if (tp > actorEntity.tp) {
      dispatch(setEntityAnimation(actor, IDLE));
      dispatch(setEntityAnimation(target, IDLE));
      dispatch(setGameState(POST_EXECUTION));
      return;
    }
    dispatch(updateEntityTP(actor, -tp));

    if (selfTargeting) {
      dispatch(setEntityAnimation(actor, { type: TARGETED, left: -1 }));
    } else {
      dispatch(setEntityAnimation(actor, { type: IDLE, left: -1 }));
    }

    dispatch(
      setGroupMessage({
        target: { group: PLAYER_GROUP },
        message: name,
      })
    );

    // TODO: FX animation, probably move animation and timeouts into switch below
    await timeout(500);

    switch (effect) {
      case DAMAGE: {
        if (targetGroup !== PLAYER_GROUP) {
          dispatch(
            setGroupMessage({
              target,
              message: power,
            })
          );
        }
        dispatch(
          setEntityAnimation(target, {
            type: HURT,
            left: -1,
          })
        );
        await timeout(ANIMATION_DURATION_MAP[HURT]);
        dispatch(updateEntityHP(target, -power));
        break;
      }
      case HEAL: {
        if (targetGroup !== PLAYER_GROUP) {
          dispatch(
            setGroupMessage({
              target,
              message: power,
            })
          );
        }
        await timeout(1000);
        dispatch(updateEntityHP(target, power));
        break;
      }
      case POISON: {
        break;
      }
      case PARALYZE: {
        break;
      }
      case SLEEP: {
        break;
      }
    }

    dispatch(
      setGroupMessage({
        target: { group: PLAYER_GROUP },
        message: '',
      })
    );
    if (targetGroup !== PLAYER_GROUP) {
      dispatch(
        setGroupMessage({
          target,
          message: '',
        })
      );
    }
    dispatch(setEntityAnimation(target, { type: IDLE, left: -1 }));

    // need to dispatch this at the end of any queue action to progress the queue
    dispatch(setGameState(POST_EXECUTION));
  };

export const itemThunk =
  (actor: ActorType, target: TargetType, itemIndex: number) =>
  async (dispatch: Dispatch<ActionType>, getState: any) => {
    const { groups } = getState();

    const { group: actorGroup, index: actorIndex } = actor;
    const actorEntity = groups[actorGroup].entities[actorIndex];
    const { inventory } = actorEntity;

    // TODO: retargeting logic needed?
    const { group: targetGroup, index: targetIndex } = target;

    const targetLeftPosition = getTargetLeftPosition(
      groups,
      targetGroup,
      targetIndex
    );

    const selfTargeting =
      actorGroup === targetGroup && actorIndex === targetIndex;

    const itemData = inventory[itemIndex];
    const { name, itemEffect, itemPower, consumable } = itemData || {};

    dispatch(
      setEntityAnimation(actor, {
        type: USE,
        left:
          actorGroup === PLAYER_GROUP && targetGroup !== PLAYER_GROUP
            ? targetLeftPosition
            : undefined,
      })
    );

    if (!selfTargeting) {
      dispatch(
        setEntityAnimation(target, {
          type: TARGETED,
          left:
            actorGroup !== PLAYER_GROUP && targetIndex !== undefined
              ? actorEntity.leftPosition
              : undefined,
        })
      );
    }

    await timeout(ANIMATION_DURATION_MAP[USE]);

    if (consumable) {
      dispatch(removeEntityItem(actor, itemIndex));
    }

    if (selfTargeting) {
      dispatch(setEntityAnimation(actor, { type: TARGETED, left: -1 }));
    } else {
      dispatch(setEntityAnimation(actor, { type: IDLE, left: -1 }));
    }

    dispatch(
      setGroupMessage({
        target: { group: PLAYER_GROUP },
        message: name,
      })
    );

    // TODO: FX animation, probably move animation and timeouts into switch below
    await timeout(500);

    switch (itemEffect) {
      case DAMAGE: {
        if (targetGroup !== PLAYER_GROUP) {
          dispatch(
            setGroupMessage({
              target,
              message: itemPower,
            })
          );
        }
        dispatch(
          setEntityAnimation(target, {
            type: HURT,
            left: -1,
          })
        );
        await timeout(ANIMATION_DURATION_MAP[HURT]);
        dispatch(updateEntityHP(target, -itemPower));
        break;
      }
      case HEAL: {
        if (targetGroup !== PLAYER_GROUP) {
          dispatch(
            setGroupMessage({
              target,
              message: itemPower,
            })
          );
        }
        await timeout(1000);
        dispatch(updateEntityHP(target, itemPower));
        break;
      }
      case POISON: {
        break;
      }
      case PARALYZE: {
        break;
      }
      case SLEEP: {
        break;
      }
    }

    dispatch(
      setGroupMessage({
        target: { group: PLAYER_GROUP },
        message: '',
      })
    );
    if (targetGroup !== PLAYER_GROUP) {
      dispatch(
        setGroupMessage({
          target,
          message: '',
        })
      );
    }
    dispatch(setEntityAnimation(target, { type: IDLE, left: -1 }));

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

      // TODO: account for revival?
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
