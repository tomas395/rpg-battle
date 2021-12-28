import { ROLF, RUDO, NEI, AMY, HUMAN, NUMAN } from '../constants';
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
    type: HUMAN,
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
    animations: generateEntityAnimations(false),
  },
  [RUDO]: {
    type: HUMAN,
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
    animations: generateEntityAnimations(false),
  },
  [NEI]: {
    type: NUMAN,
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
    animations: generateEntityAnimations(false),
  },
  [AMY]: {
    type: HUMAN,
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
    animations: generateEntityAnimations(false),
  },
};

export default HERO_DATA;
