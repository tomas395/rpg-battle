import { FROGGY, WRESTLER, DARKFALS, MONSTER } from '../constants';
import { generateEntityAnimations } from '../utils';
import TECHNIQUES from './techniques';

const { RES, FOI } = TECHNIQUES;

const ENEMY_DATA = {
  [FROGGY]: {
    type: MONSTER,
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
    animations: generateEntityAnimations(true),
    size: 1,
  },
  [WRESTLER]: {
    type: MONSTER,
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
    animations: generateEntityAnimations(true),
    size: 1,
  },
  [DARKFALS]: {
    type: MONSTER,
    name: DARKFALS,
    maxHp: 100,
    hp: 100,
    maxTp: 20,
    tp: 20,
    attack: 10,
    defense: 10,
    speed: 3,
    inventory: [],
    equipment: [],
    techniques: [RES, FOI],
    animations: generateEntityAnimations(true),
    size: 4,
  },
};

export default ENEMY_DATA;
