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
  TargetTypesEnum,
  EffectTypesEnum,
  ArmorTypesEnum,
  HeroesEnum,
  EnemyTypesEnum,
} from './constants';

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
  equipment: {
    leftHand?: WeaponType | ShieldType;
    rightHand?: WeaponType | ShieldType;
    head?: ArmorType;
    body?: ArmorType;
    legs?: ArmorType;
  };
  techniques: TechniqueType[];
  leftPosition: number | string;
  queuedAction: {
    type: EntityActionTypesEnum;
    target: TargetType;
    techIndex: number;
    itemIndex: number;
  };
  currentAnimation: {
    type: AnimationTypesEnum;
    left?: number | string;
  };
  animations: {
    [key in AnimationTypesEnum]: AnimationType;
  };
  height?: number;
  width?: number;
}

export interface EnemyType extends EntityType {
  size: number;
}

export interface EntityGroupType {
  type?: EnemyTypesEnum;
  entities: Array<EntityType | EnemyType>;
  message: string;
}

export interface AnimationType {
  frames: number | number[];
  duration: number;
  top?: number | string;
  bottom?: number | string;
}

export interface ItemType {
  name: string;
  consumable?: boolean;
  itemTargetType?: TargetTypesEnum;
  itemTargetAllies?: boolean;
  itemEffect?: EffectTypesEnum;
  itemPower?: number;
}

export interface WeaponType extends ItemType {
  attackPower: number;
  defensePower: number;
  attackType: 'SLASH' | 'SHOOT'; // TODO
  twoHanded?: boolean;
  targetType: TargetTypesEnum;
  equippableBy: HeroesEnum[];
}

export interface ShieldType extends ItemType {
  defensePower: number;
  equippableBy: HeroesEnum[];
}

export interface ArmorType extends ItemType {
  defensePower: number;
  type: ArmorTypesEnum;
  equippableBy: HeroesEnum[];
}

export interface TechniqueType {
  name: string;
  targetType: TargetTypesEnum;
  targetAllies: boolean;
  effect: EffectTypesEnum;
  power: number;
  tp: number;
}

export interface ActionType {
  type: string;
  payload?: any;
}

export interface EntityActionType {
  type: any; // TODO
  actor: ActorType;
  target: TargetType;
  techIndex?: number;
  itemIndex?: number;
}

export interface ActorType {
  group: GroupsEnum;
  index: number;
}

export interface TargetType {
  group: GroupsEnum | Array<GroupsEnum>;
  index?: number;
}
