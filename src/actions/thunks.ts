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
} from '../constants';
import {
  setGameState,
  setEntityAnimation,
  setEntityStatus,
  setGroupMessage,
  entityDamage,
  loseGame,
  winGame,
  incrementQueueIndex,
} from './actionCreators';

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

    // TODO: randomize target selection from target group (only pass target group in queue object, no target index needed)

    /*
[group]: 
  pass group array along to action thunk
    thunk should be set up to accept an array, in which case it targets all entities in each group
group+index: 
  if group === PLAYER_GROUP
    check if entity exists and is alive
      if not, select random entity from living entities in group
        if no living entities in PLAYER_GROUP, game lost
  else
    check if entity exists and is alive
      if not, select random entity from living entities in group
        if no living entities in group
group: 
  check to make sure there are living entities in group
    if not, game won/lost
  pass group along to action thunk
    thunk should be set up to accept a target without an index, in which case it will target all entities in group
*/

    const { group: actorGroup, index: actorIndex } = actor;
    const actorEntity = groups[actorGroup].entities[actorIndex];
    let { group: targetGroup, index: targetIndex } = initialTarget;

    if (Array.isArray(targetGroup)) {
      //
    } else if (targetGroup === PLAYER_GROUP) {
      if (
        targetIndex !== undefined &&
        (!groups[PLAYER_GROUP].entities[targetIndex] ||
          groups[PLAYER_GROUP].entities[targetIndex].hp <= 0)
      ) {
        targetIndex = groups[PLAYER_GROUP].entities.findIndex(
          ({ hp }: { hp: number }) => hp > 0
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
        ({ hp }: { hp: number }) => hp > 0
      );
      if (targetIndex === -1) {
        targetGroup =
          targetGroup === LEFT_ENEMY_GROUP
            ? RIGHT_ENEMY_GROUP
            : LEFT_ENEMY_GROUP;
        targetIndex = groups[targetGroup].entities.findIndex(
          ({ hp }: { hp: number }) => hp > 0
        );

        if (targetIndex === -1) {
          dispatch(winGame());
          return;
        }
      }
    }

    const target = {
      group: targetGroup,
      index: targetIndex,
    };

    // TODO: check actor equipped weapon from state to determine which animation to trigger (SLASH vs SHOOT, etc.)
    const attackAnimationType = SLASH;

    // TODO: yeaaaa... we need to handle leftPosition percentage another way
    const targetLeftPosition =
      targetIndex !== undefined && !Array.isArray(targetGroup)
        ? groups[targetGroup].entities[targetIndex].leftPosition
        : !Array.isArray(targetGroup)
        ? String(
            (Number(
              groups[targetGroup].entities[0].leftPosition.replace('%', '')
            ) +
              Number(
                groups[targetGroup].entities[
                  groups[targetGroup].entities.length - 1
                ].leftPosition.replace('%', '')
              )) /
              groups[targetGroup].entities.length
          ) + '%'
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
