import {
  FROGGY,
  WRESTLER,
  DARKFORCE,
  MONSTER,
  ATTACK,
  PLAYER_GROUP,
  TECH,
} from '../constants';
import { generateEntityAnimations } from '../utils';
import TECHNIQUES from './techniques';

const { RES, FOI, LIGHTNING } = TECHNIQUES;

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
    queuedAction: {
      type: ATTACK,
      target: {
        group: PLAYER_GROUP,
        index: 0,
      },
    },
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
    queuedAction: {
      type: ATTACK,
      target: {
        group: PLAYER_GROUP,
        index: 0,
      },
    },
  },
  [DARKFORCE]: {
    type: MONSTER,
    name: DARKFORCE,
    maxHp: 2560,
    hp: 2560,
    maxTp: 20,
    tp: 20,
    attack: 10,
    defense: 10,
    speed: 3,
    inventory: [],
    equipment: [],
    techniques: [RES, FOI, LIGHTNING],
    animations: generateEntityAnimations(true),
    size: 4,
    height: 120,
    width: 320,
    queuedAction: {
      type: TECH,
      target: {
        group: PLAYER_GROUP,
        // index: 0, // TODO: this ultimately controls what gets executed, need to always determine target by weapon/tech/item
      },
      techIndex: 2,
    },
  },
};

export default ENEMY_DATA;
