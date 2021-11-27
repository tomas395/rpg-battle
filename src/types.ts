import {
  GameStatesEnum,
  EntityTypesEnum,
  EntityActionTypesEnum,
  AnimationTypesEnum,
  EntityStatusesEnum,
  GroupsEnum,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
} from './constants';

// TODO: review interface vs. type
export interface AppStateType {
  pixelMultiplier: number;
  gameState: GameStatesEnum;
  queue: EntityActionType[];
  queueIndex: number | null;
  playerInterrupt: boolean;
  groups: {
    [PLAYER_GROUP]: EntityGroupType;
    [LEFT_ENEMY_GROUP]: EntityGroupType;
    [RIGHT_ENEMY_GROUP]: EntityGroupType;
  };
}

export interface EntityType {
  id: string;
  index: number;
  group: GroupsEnum;
  type: EntityTypesEnum;
  status: EntityStatusesEnum;
  name: string;
  hp: number;
  maxHp: number;
  tp: number;
  maxTp: number;
  attack: number;
  defense: number;
  speed: number;
  inventory: ItemType[];
  // equipment: EntityEquipmentType;
  leftPosition: number | string;
  queuedAction: {
    type: EntityActionTypesEnum;
    target: TargetType;
  };
  currentAnimation: {
    type: AnimationTypesEnum;
    left?: number | string;
  };
  animations: {
    [key in AnimationTypesEnum]: AnimationType;
  };
}

export interface EntityGroupType {
  type?: EntityTypesEnum;
  entities: EntityType[];
  message: string;
}

export interface AnimationType {
  frames: number | number[];
  duration: number;
  top?: number;
  bottom?: number;
}

export interface ItemType {}

export interface EntityEquipmentType {
  // head: EquippableItemType | null;
  // leftHand: EquippableItemType | null;
  // rightHand: EquippableItemType | null;
  // body: EquippableItemType | null;
  // legs: EquippableItemType | null;
}

export interface EquippableItemType {
  twoHanded: boolean;
}

export interface ActionType {
  type: string;
  payload?: any;
}

export interface EntityActionType {
  type: any; // TODO
  actor: ActorType;
  target: TargetType;
}

export interface ActorType {
  group: GroupsEnum;
  index: number;
}

export interface TargetType {
  group: GroupsEnum;
  // | Array<GroupsEnum>;
  index?: number;
}
