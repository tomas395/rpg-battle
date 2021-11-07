// TODO: this probably belongs in a config file or something
export const SPRITE_MULTIPLIER = 3;
// all images at native dimensions (tiny)
// multiplier is used to uniformly scale all pixel art assets up
// usage: actual size = (desired size in px) * multiplier

export const ANIMATION_DURATION_MAP = {
  IDLE: 600,
  SLASH: 600,
  SHOOT: 600,
  USE: 1000,
  TARGETED: 600,
  HURT: 1000,
  DYING: 150,
};

export enum GameStatesEnum {
  INIT = 'INIT',
  NEW_GAME = 'NEW_GAME',
  GAME_WON = 'GAME_WON',
  GAME_LOST = 'GAME_LOST',
  PLAYER_INPUT = 'PLAYER_INPUT',
  EXECUTING = 'EXECUTING',
  POST_EXECUTION = 'POST_EXECUTION',
}
export const {
  INIT,
  NEW_GAME,
  GAME_WON,
  GAME_LOST,
  PLAYER_INPUT,
  EXECUTING,
  POST_EXECUTION,
} = GameStatesEnum;

export enum GroupsEnum {
  PLAYER_GROUP = 'PLAYER_GROUP',
  LEFT_ENEMY_GROUP = 'LEFT_ENEMY_GROUP',
  RIGHT_ENEMY_GROUP = 'RIGHT_ENEMY_GROUP',
}
export const { PLAYER_GROUP, LEFT_ENEMY_GROUP, RIGHT_ENEMY_GROUP } = GroupsEnum;

export enum EntityTypesEnum {
  HUMAN = 'HUMAN',
  NUMAN = 'NUMAN',
  FROGGY = 'FROGGY',
  SAKOFF = 'SAKOFF',
}
export const { HUMAN, NUMAN, FROGGY, SAKOFF } = EntityTypesEnum;

export enum EntityStatusesEnum {
  OK = 'OK',
  DEAD = 'DEAD',
  PARALYZED = 'PARALYZED',
  POISONED = 'POISONED',
}
export const { OK, DEAD, PARALYZED, POISONED } = EntityStatusesEnum;

export enum EntityActionTypesEnum {
  ATTACK = 'ATTACK',
  TECH = 'TECH',
  ITEM = 'ITEM',
  DEFEND = 'DEFEND',
}
export const { ATTACK, TECH, ITEM, DEFEND } = EntityActionTypesEnum;

export enum AnimationTypesEnum {
  IDLE = 'IDLE',
  SLASH = 'SLASH',
  SHOOT = 'SHOOT',
  USE = 'USE',
  TARGETED = 'TARGETED',
  HURT = 'HURT',
  DYING = 'DYING',
}
export const { IDLE, SLASH, SHOOT, USE, TARGETED, HURT, DYING } =
  AnimationTypesEnum;

export const HERO_NAMES = ['ROLF', 'RUDO', 'NEI', 'AMY'];
