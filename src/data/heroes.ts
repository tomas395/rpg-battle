import { ROLF, RUDO, NEI, AMY, PLAYER_GROUP, HUMAN, NUMAN } from '../constants';
import { generateEntityAnimations } from '../utils';
import ITEMS from './items';
import WEAPONS from './weapons';
import SHIELDS from './shields';
import ARMOR from './armor';
import TECHNIQUES from './techniques';

const { MONOMATE } = ITEMS;
const { KNIFE, STEEL_BAR, SHOTGUN } = WEAPONS;
const { CARBON_EMEL, CARBON_SHIELD } = SHIELDS;
const { HEADGEAR, RIBBON } = ARMOR;
const { RES, FOI } = TECHNIQUES;

const HERO_DATA = {
  [ROLF]: {
    // id: uuid(),
    // index: 0, // TODO
    // leftPosition: '40%', // TODO
    group: PLAYER_GROUP,
    type: HUMAN,
    // status: OK,
    name: ROLF,
    maxHp: 10,
    hp: 10,
    maxTp: 5,
    tp: 5,
    attack: 1,
    defense: 3,
    speed: 2,
    inventory: [MONOMATE, MONOMATE],
    equipment: {
      leftHand: CARBON_SHIELD,
      rightHand: KNIFE,
      head: HEADGEAR,
    },
    techniques: [RES, FOI],
    // queuedAction: {
    //   type: ATTACK,
    //   target: {
    //     group: LEFT_ENEMY_GROUP,
    //     index: 0,
    //   },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(false),
  },
  [RUDO]: {
    // id: uuid(),
    // index: 1, // TODO
    // leftPosition: '60%', // TODO
    group: PLAYER_GROUP,
    type: HUMAN,
    // status: OK,
    name: RUDO,
    maxHp: 10,
    hp: 10,
    maxTp: 5,
    tp: 5,
    attack: 1,
    defense: 3,
    speed: 2,
    inventory: [],
    equipment: {
      leftHand: SHOTGUN,
      rightHand: SHOTGUN,
    },
    techniques: [],
    // queuedAction: {
    //   type: ATTACK,
    //   target: {
    //     group: LEFT_ENEMY_GROUP,
    //     index: 0,
    //   },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(false),
  },
  [NEI]: {
    // id: uuid(),
    // index: 2, // TODO
    // leftPosition: '20%', // TODO
    group: PLAYER_GROUP,
    type: NUMAN,
    // status: OK,
    name: NEI,
    maxHp: 10,
    hp: 10,
    maxTp: 5,
    tp: 5,
    attack: 1,
    defense: 3,
    speed: 3,
    inventory: [MONOMATE, MONOMATE, MONOMATE],
    equipment: {
      leftHand: STEEL_BAR,
      rightHand: STEEL_BAR,
      head: RIBBON,
    },
    techniques: [RES],
    // queuedAction: {
    //   type: ATTACK,
    //   target: {
    //     group: LEFT_ENEMY_GROUP,
    //     index: 0,
    //   },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(false),
  },
  [AMY]: {
    // id: uuid(),
    // index: 3, // TODO
    // leftPosition: '80%', // TODO
    group: PLAYER_GROUP,
    type: HUMAN,
    // status: OK,
    name: AMY,
    maxHp: 10,
    hp: 10,
    maxTp: 5,
    tp: 5,
    attack: 1,
    defense: 3,
    speed: 2,
    inventory: [MONOMATE, MONOMATE],
    equipment: {
      leftHand: CARBON_EMEL,
      rightHand: KNIFE,
      head: HEADGEAR,
    },
    techniques: [RES],
    // queuedAction: {
    //   type: ATTACK,
    //   target: {
    //     group: LEFT_ENEMY_GROUP,
    //     index: 0,
    //   },
    // },
    // currentAnimation: { type: IDLE },
    animations: generateEntityAnimations(false),
  },
};

export default HERO_DATA;
