import { EntityType } from './types';

// export enum GroupsEnum {
//   PLAYER_GROUP = 'PLAYER_GROUP',
//   LEFT_ENEMY_GROUP = 'LEFT_ENEMY_GROUP',
//   RIGHT_ENEMY_GROUP = 'RIGHT_ENEMY_GROUP',
// }
// export const { PLAYER_GROUP, LEFT_ENEMY_GROUP, RIGHT_ENEMY_GROUP } = GroupsEnum;

export enum EntityTypesEnum {
  HERO = 'HERO',
  HUMAN = 'HUMAN',
  NUMAN = 'NUMAN',
  MONSTER = 'MONSTER',
  ROBOT = 'ROBOT',
}

export enum GameStatesEnum {
  INIT = 'INIT',
  NEW_GAME = 'NEW_GAME',
  GAME_WON = 'GAME_WON',
  GAME_LOST = 'GAME_LOST',
  PLAYER_INPUT = 'PLAYER_INPUT',
  EXECUTING = 'EXECUTING',
  POST_EXECUTION = 'POST_EXECUTION',
}

export enum EntityActionsEnum {
  ATTACK = 'ATTACK',
  USE_ITEM = 'USE_ITEM',
  USE_SKILL = 'USE_SKILL',
}

export const HERO_NAMES = ['ROLF', 'NEI', 'RUDO', 'ANNA'];

export const NEI: EntityType = {
  name: 'NEI',
  status: 'idle',
  type: EntityTypesEnum.HERO,
  hp: 10,
  maxHp: 10,
  tp: 5,
  maxTp: 5,
  attack: 10,
  defense: 5,
  speed: 3,
  inventory: [],
  queuedActions: [],
};
