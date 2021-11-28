import { v4 as uuid } from 'uuid';

import { EntityType } from './types';
import {
  EntityTypesEnum,
  HERO_NAMES,
  ATTACK,
  HUMAN,
  FROGGY,
  IDLE,
  SLASH,
  SHOOT,
  USE,
  TARGETED,
  HURT,
  DYING,
  OK,
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
  leftPosition,
  queuedAction,
  currentAnimation,
  animations,
});

const generateHeroName = (index: number) => {
  return HERO_NAMES[index] || `Hero-${index}`;
};

const generateEnemyName = (type: EntityTypesEnum, index: number) => {
  return `${type}-${index}`;
};

// TODO: ts
const generateEntityAnimations = (isEnemy: boolean) => ({
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
    frames: 1,
    duration: 1,
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

// TODO: attributes should be driven by 'type', NEI, ROLF, ROBOT, FROGGY, etc. and a default generic fallback
export const generateHeroes = (count: number) => {
  const heroes: EntityType[] = [];

  for (let index = 0; index < count; index++) {
    heroes.push(
      generateEntity({
        id: uuid(),
        index,
        group: PLAYER_GROUP,
        type: HUMAN,
        status: OK,
        name: generateHeroName(index),
        maxHp: 10,
        hp: 10,
        maxTp: 5,
        tp: 5,
        attack: 1,
        defense: 3,
        speed: 2,
        inventory: [],
        leftPosition: `${
          index === 0 ? 40 : index === 1 ? 60 : index === 2 ? 20 : 80
        }%`,
        queuedAction: {
          type: ATTACK,
          target: {
            group: LEFT_ENEMY_GROUP,
            index: index === 1 ? undefined : 0,
          },
        },
        currentAnimation: { type: IDLE },
        animations: generateEntityAnimations(false),
      })
    );
  }

  return heroes;
};

export const generateEnemies = (
  count: number,
  type: EntityTypesEnum,
  group: Exclude<GroupsEnum, GroupsEnum.PLAYER_GROUP>,
  totalGroupSize: number,
  offset?: number
) => {
  const enemies: EntityType[] = [];

  for (let index = 0; index < count; index++) {
    const realIndex = offset ? index + offset : index;

    enemies.push(
      generateEntity({
        id: uuid(),
        index,
        group,
        type,
        status: OK,
        name: generateEnemyName(type, index),
        maxHp: type === FROGGY ? 10 : 20,
        hp: type === FROGGY ? 10 : 20,
        maxTp: type === FROGGY ? 5 : 0,
        tp: type === FROGGY ? 5 : 0,
        attack: 1,
        defense: 3,
        speed: type === FROGGY ? 1 : 3,
        inventory: [],
        leftPosition: `${
          (group === RIGHT_ENEMY_GROUP ? realIndex + 1 : realIndex + 1) *
          (100 / (totalGroupSize + 1))
        }%`,
        queuedAction: {
          type: ATTACK,
          target: { group: PLAYER_GROUP, index: 0 },
        },
        currentAnimation: { type: IDLE },
        animations: generateEntityAnimations(true),
      })
    );
  }

  return enemies;
};

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
      const { type, target } = queuedAction;

      // TODO: check equipped weapons, etc. determine what kind of action or actions to queue

      const action = {
        type,
        actor: { group, index, leftPosition },
        target,
      };
      return [action];
    })
    .reduce((prev, curr) => [...prev, ...curr], []);
};
