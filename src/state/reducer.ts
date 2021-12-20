import { AppStateType, ActionType, TargetType } from '../types';
import { actionTypes } from '../actions';
import {
  AnimationTypesEnum,
  EntityStatusesEnum,
  EXECUTING,
  GAME_LOST,
  GAME_WON,
  PLAYER_GROUP,
} from '../constants';
const {
  SET_PIXEL_MULTIPLIER,
  START_NEW_GAME,
  START_NEW_ROUND,
  WIN_GAME,
  LOSE_GAME,
  SET_QUEUE_INDEX,
  INCREMENT_QUEUE_INDEX,
  SET_GAME_STATE,
  SET_PLAYER_INTERRUPT,
  // SET_ACTIVE_HERO,
  QUEUE_ACTION,
  SET_GROUP_MESSAGE,
  SET_ENTITY_STATUS,
  SET_ENTITY_ANIMATION,
  ENTITY_DAMAGE,
} = actionTypes;

const reducer = (state: AppStateType, action: ActionType) => {
  const { type, payload } = action;
  // console.log('*** reducer');
  // console.log(type);
  // console.log(payload);

  switch (type) {
    case SET_PIXEL_MULTIPLIER: {
      return {
        ...state,
        pixelMultiplier: payload,
      };
    }
    case START_NEW_GAME: {
      return {
        ...state,
        ...payload,
      };
    }
    case START_NEW_ROUND: {
      return {
        ...state,
        gameState: EXECUTING,
        queueIndex: 0,
        queue: payload,
      };
    }
    case WIN_GAME: {
      return {
        ...state,
        gameState: GAME_WON,
        queueIndex: null,
      };
    }
    case LOSE_GAME: {
      return {
        ...state,
        gameState: GAME_LOST,
        queueIndex: null,
      };
    }
    case SET_QUEUE_INDEX: {
      return {
        ...state,
        queueIndex: payload,
      };
    }
    case INCREMENT_QUEUE_INDEX: {
      return {
        ...state,
        queueIndex: state.queueIndex === null ? 0 : state.queueIndex + 1,
      };
    }
    case SET_GAME_STATE: {
      return {
        ...state,
        gameState: payload,
      };
    }
    case SET_PLAYER_INTERRUPT: {
      return {
        ...state,
        playerInterrupt: payload,
      };
    }
    case SET_GROUP_MESSAGE: {
      const {
        target: { group: targetGroup },
        message,
      }: { target: TargetType; message: string | number } = payload;

      let newGroups = { ...state.groups };

      if (Array.isArray(targetGroup)) {
        targetGroup.forEach((group) => {
          newGroups = {
            ...newGroups,
            [group]: {
              ...newGroups[group],
              message,
            },
          };
        });
      } else {
        newGroups = {
          ...newGroups,
          [targetGroup]: { ...newGroups[targetGroup], message },
        };
      }

      return {
        ...state,
        groups: newGroups,
      };
    }
    case SET_ENTITY_STATUS: {
      const {
        target: { group: targetGroup, index: targetIndex },
        status,
      }: {
        target: TargetType;
        status: EntityStatusesEnum;
      } = payload;

      let newGroups = { ...state.groups };

      if (Array.isArray(targetGroup)) {
        targetGroup.forEach((groupName) => {
          newGroups[groupName] = {
            ...newGroups[groupName],
            entities: newGroups[groupName].entities.map((entity) => ({
              ...entity,
              status,
            })),
          };
        });
      } else if (targetIndex === undefined) {
        const newGroupEntities = newGroups[targetGroup].entities.map(
          (entity) => ({ ...entity, status })
        );
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      } else {
        const newEntity = {
          ...newGroups[targetGroup].entities[targetIndex],
          status,
        };
        const newGroupEntities = [
          ...newGroups[targetGroup].entities.slice(0, targetIndex),
          newEntity,
          ...newGroups[targetGroup].entities.slice(targetIndex + 1),
        ];
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      }

      return {
        ...state,
        groups: newGroups,
      };
    }
    case SET_ENTITY_ANIMATION: {
      // TODO: lot of code duplication in these reducers with the addition of group support
      // could have more generic actions like SET_ENTITY_ATTRIBUTE, SET_ENTITY_GROUP_ATTRIBUTE, SET_ENTITY_GROUPS_ATTRIBUTE
      const {
        target: { group: targetGroup, index: targetIndex },
        animation,
      }: {
        target: TargetType;
        animation:
          | AnimationTypesEnum
          | {
              type: AnimationTypesEnum;
              left?: number | string;
            };
      } = payload;

      let newGroups = { ...state.groups };

      let newAnimation =
        typeof animation === 'string' ? { type: animation } : animation;

      // TODO: this -1 hack to preserve currentAnimation left position works but it needs to go
      if (Array.isArray(targetGroup)) {
        targetGroup.forEach((groupName) => {
          newGroups[groupName] = {
            ...newGroups[groupName],
            entities: newGroups[groupName].entities.map((entity) => ({
              ...entity,
              currentAnimation:
                newAnimation.left === -1
                  ? { ...entity.currentAnimation, type: newAnimation.type }
                  : newAnimation,
            })),
          };
        });
      } else if (targetIndex === undefined) {
        const newGroupEntities = newGroups[targetGroup].entities.map(
          (entity) => ({
            ...entity,
            currentAnimation:
              newAnimation.left === -1
                ? { ...entity.currentAnimation, type: newAnimation.type }
                : newAnimation,
          })
        );
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      } else {
        const newEntity = {
          ...newGroups[targetGroup].entities[targetIndex],
          currentAnimation:
            newAnimation.left === -1
              ? {
                  ...newGroups[targetGroup].entities[targetIndex]
                    .currentAnimation,
                  type: newAnimation.type,
                }
              : newAnimation,
        };
        const newGroupEntities = [
          ...newGroups[targetGroup].entities.slice(0, targetIndex),
          newEntity,
          ...newGroups[targetGroup].entities.slice(targetIndex + 1),
        ];
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      }

      return {
        ...state,
        groups: newGroups,
      };
    }
    case ENTITY_DAMAGE: {
      const {
        target: { group: targetGroup, index: targetIndex },
        attackPower,
      }: { target: TargetType; attackPower: number } = payload;

      let newGroups = { ...state.groups };

      if (Array.isArray(targetGroup)) {
        targetGroup.forEach((groupName) => {
          newGroups[groupName] = {
            ...newGroups[groupName],
            entities: newGroups[groupName].entities.map((entity) => ({
              ...entity,
              hp: entity.hp - attackPower,
            })),
          };
        });
      } else if (targetIndex === undefined) {
        const newGroupEntities = newGroups[targetGroup].entities.map(
          (entity) => ({ ...entity, hp: entity.hp - attackPower })
        );
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      } else {
        const newEntity = {
          ...newGroups[targetGroup].entities[targetIndex],
          hp: newGroups[targetGroup].entities[targetIndex].hp - attackPower,
        };
        const newGroupEntities = [
          ...newGroups[targetGroup].entities.slice(0, targetIndex),
          newEntity,
          ...newGroups[targetGroup].entities.slice(targetIndex + 1),
        ];
        newGroups = {
          ...newGroups,
          [targetGroup]: {
            ...newGroups[targetGroup],
            entities: newGroupEntities,
          },
        };
      }

      return {
        ...state,
        groups: newGroups,
      };
    }
    // case SET_ACTIVE_HERO: {
    //   return {
    //     ...state,
    //     activeHero: payload,
    //   };
    // }
    case QUEUE_ACTION: {
      const { heroIndex: index, target, type } = payload;

      const newEntity = {
        ...state.groups[PLAYER_GROUP].entities[index],
        queuedAction: {
          type,
          target,
        },
      };
      const newGroupEntities = [
        ...state.groups[PLAYER_GROUP].entities.slice(0, index),
        newEntity,
        ...state.groups[PLAYER_GROUP].entities.slice(index + 1),
      ];

      return {
        ...state,
        groups: {
          ...state.groups,
          [PLAYER_GROUP]: {
            ...state.groups[PLAYER_GROUP],
            entities: newGroupEntities,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
