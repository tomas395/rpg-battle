export const ANIMATION_DURATION_MAP = {
  IDLE: 600,
  SLASH: 600,
  SHOOT: 1000,
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
  MONSTER = 'MONSTER',
  ROBOT = 'ROBOT',
}
export const { HUMAN, NUMAN, MONSTER, ROBOT } = EntityTypesEnum;

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
export enum HeroesEnum {
  ROLF = 'ROLF',
  RUDO = 'RUDO',
  NEI = 'NEI',
  AMY = 'AMY',
}
export const { ROLF, RUDO, NEI, AMY } = HeroesEnum;

export enum EnemyTypesEnum {
  FROGGY = 'FROGGY',
  WRESTLER = 'WRESTLER',
  DARKFORCE = 'DARKFORCE',
}
export const { FROGGY, WRESTLER, DARKFORCE } = EnemyTypesEnum;

export enum TargetTypesEnum {
  ENTITY = 'ENTITY',
  GROUP = 'GROUP',
  ALL = 'ALL',
}
export const { ENTITY, GROUP, ALL } = TargetTypesEnum;

export enum ArmorTypesEnum {
  HEAD = 'HEAD',
  BODY = 'BODY',
  LEGS = 'LEGS',
}
export const { HEAD, BODY, LEGS } = ArmorTypesEnum;

export enum EffectTypesEnum {
  DAMAGE = 'DAMAGE',
  HEAL = 'HEAL',
  POISON = 'POISON',
  PARALYZE = 'PARALYZE',
  SLEEP = 'SLEEP',
}
export const { DAMAGE, HEAL, POISON, PARALYZE, SLEEP } = EffectTypesEnum;
