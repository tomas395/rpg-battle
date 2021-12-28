import { EntityType } from './types';
import { IDLE, SLASH, SHOOT, USE, TARGETED, HURT, DYING } from './constants';

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
