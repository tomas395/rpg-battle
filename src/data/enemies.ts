import { FROGGY, WRESTLER, DARKFALS, MONSTER } from '../constants';
import { generateEntityAnimations } from '../utils';

const ENEMY_DATA = {
  [FROGGY]: {
    // id: uuid(),
    // index: 0,
    // leftPosition: `${
    //   (group === RIGHT_ENEMY_GROUP ? realIndex + 1 : realIndex + 1) *
    //   (100 / (totalGroupSize + 1))
    // }%`,
    // group: LEFT_ENEMY_GROUP,
    type: MONSTER,
    // status: OK,
    name: FROGGY,
    maxHp: 10,
    hp: 10,
    maxTp: 5,
    tp: 5,
    attack: 1,
    defense: 3,
    speed: 1,
    inventory: [],
    equipment: {},
    techniques: [],
    // queuedAction: {
    //   type: ATTACK,
    //   target: { group: PLAYER_GROUP, index: 0 },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(true),
    size: 1,
  },
  [WRESTLER]: {
    // id: uuid(),
    // index: 1,
    // leftPosition: `${
    //   (group === RIGHT_ENEMY_GROUP ? realIndex + 1 : realIndex + 1) *
    //   (100 / (totalGroupSize + 1))
    // }%`,
    // group: RIGHT_ENEMY_GROUP,
    type: MONSTER,
    // status: OK,
    name: WRESTLER,
    maxHp: 20,
    hp: 20,
    maxTp: 0,
    tp: 0,
    attack: 1,
    defense: 3,
    speed: 3,
    inventory: [],
    equipment: [],
    techniques: [],
    // queuedAction: {
    //   type: ATTACK,
    //   target: { group: PLAYER_GROUP, index: 0 },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(true),
    size: 1,
  },
  [DARKFALS]: {
    // id: uuid(),
    // index: 1,
    // leftPosition: `${
    //   (group === RIGHT_ENEMY_GROUP ? realIndex + 1 : realIndex + 1) *
    //   (100 / (totalGroupSize + 1))
    // }%`,
    // group: RIGHT_ENEMY_GROUP,
    type: MONSTER,
    // status: OK,
    name: DARKFALS,
    maxHp: 20,
    hp: 20,
    maxTp: 0,
    tp: 0,
    attack: 1,
    defense: 3,
    speed: 3,
    inventory: [],
    equipment: [],
    techniques: [],
    // queuedAction: {
    //   type: ATTACK,
    //   target: { group: PLAYER_GROUP, index: 0 },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(true),
    size: 4,
  },
};

export default ENEMY_DATA;
