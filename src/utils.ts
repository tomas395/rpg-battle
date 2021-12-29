import { EntityType } from './types';
import {
  IDLE,
  SLASH,
  SHOOT,
  USE,
  TARGETED,
  HURT,
  DYING,
  GroupsEnum,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
} from './constants';

export const generateEntity = ({
  id,
  index,
  group,
  type,
  status,
  name,
  maxHp,
  hp,
  maxTp,
  tp,
  attack,
  defense,
  speed,
  inventory,
  techniques,
  leftPosition,
  queuedAction,
  currentAnimation,
  animations,
}: EntityType) => ({
  id,
  index,
  group,
  type,
  status,
  name,
  maxHp,
  hp,
  maxTp,
  tp,
  attack,
  defense,
  speed,
  inventory,
  techniques,
  leftPosition,
  queuedAction,
  currentAnimation,
  animations,
});

export const generateEntityAnimations = (isEnemy: boolean) => ({
  [IDLE]: {
    frames: isEnemy ? [0, 1] : 0,
    duration: isEnemy ? 600 : 0,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
  [SLASH]: {
    frames: isEnemy ? [2, 3] : [3, 3, 4, 5, 6, 6],
    duration: 600,
    top: isEnemy ? 0 : '20%',
    bottom: isEnemy ? undefined : 0,
  },
  [SHOOT]: {
    frames: [0, 2, 2],
    duration: 1000,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
  [USE]: {
    frames: [0, 1, 1, 1, 1, 1, 1, 1, 1],
    duration: 2000,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
  [TARGETED]: {
    frames: isEnemy ? [0, 1] : 0,
    duration: isEnemy ? 600 : 0,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
  [HURT]: {
    frames: [0, -1, 0, -1, 0, -1, 0],
    duration: 1000,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
  [DYING]: {
    frames: 0,
    duration: 150,
    top: isEnemy ? 0 : undefined,
    bottom: isEnemy ? undefined : 0,
  },
});

export const sortEntitiesBySpeed = (
  firstEntity: EntityType,
  secondEntity: EntityType
) => {
  const { speed: speedA } = firstEntity;
  const { speed: speedB } = secondEntity;

  if (speedA === speedB) {
    return Math.random() > 0.5 ? 1 : -1;
  } else {
    return speedA > speedB ? -1 : 1;
  }
};

export const generateQueue = (entities: EntityType[]) => {
  return [...entities]
    .sort(sortEntitiesBySpeed)
    .map((entity) => {
      const { index, group, queuedAction, leftPosition } = entity;
      const { type, target, techIndex, itemIndex } = queuedAction;

      // TODO: check equipped weapons, etc. determine what kind of action or actions to queue

      const action = {
        type,
        actor: { group, index, leftPosition },
        target,
        techIndex,
        itemIndex,
      };
      return [action];
    })
    .reduce((prev, curr) => [...prev, ...curr], []);
};

export const retarget = (
  groups: any, // TODO: ts
  actorGroup: GroupsEnum,
  targetGroup: GroupsEnum | GroupsEnum[],
  targetIndex?: number
) => {
  // retargeting logic
  if (Array.isArray(targetGroup)) {
    targetGroup.filter(
      (group) =>
        groups[group].entities.findIndex(({ hp }: { hp: number }) => hp > 0) !==
        -1
    );
    // TODO: if no living entities in any target group maybe add some sort of skip flag to check below so we only show actor animation with no other effects
  } else if (targetIndex === undefined) {
    if (targetGroup !== PLAYER_GROUP) {
      if (
        groups[targetGroup].entities.findIndex(
          ({ hp }: { hp: number }) => hp > 0
        ) === -1
      ) {
        targetGroup =
          targetGroup === LEFT_ENEMY_GROUP
            ? RIGHT_ENEMY_GROUP
            : LEFT_ENEMY_GROUP;
      }
    }
  } else {
    // TODO: this is hacky, we are checking to see if we have an index, then ignoring it and picking a random one
    let livingTargetGroupEntities = groups[targetGroup].entities.filter(
      (entity: EntityType) => entity.hp > 0
    );

    if (actorGroup === PLAYER_GROUP && livingTargetGroupEntities.length === 0) {
      targetGroup =
        targetGroup === LEFT_ENEMY_GROUP ? RIGHT_ENEMY_GROUP : LEFT_ENEMY_GROUP;

      livingTargetGroupEntities = groups[targetGroup].entities.filter(
        (entity: EntityType) => entity.hp > 0
      );
    }

    targetIndex =
      livingTargetGroupEntities[
        Math.floor(Math.random() * livingTargetGroupEntities.length)
      ].index;
  }

  const newTarget = {
    group: targetGroup,
    index: targetIndex,
  };

  return newTarget;
};

// TODO: need to consider only living entities
export const getTargetLeftPosition = (
  groups: any, // TODO: ts
  targetGroup: GroupsEnum | GroupsEnum[],
  targetIndex?: number
) => {
  // TODO: yeaaaa... we need to handle leftPosition percentage another way
  return targetIndex !== undefined && !Array.isArray(targetGroup)
    ? groups[targetGroup].entities[targetIndex].leftPosition
    : !Array.isArray(targetGroup)
    ? String(
        (Number(groups[targetGroup].entities[0].leftPosition.replace('%', '')) +
          Number(
            groups[targetGroup].entities[
              groups[targetGroup].entities.length - 1
            ].leftPosition.replace('%', '')
          )) /
          2
      ) + '%'
    : '50%';
};
