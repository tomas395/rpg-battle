import { ALL, DAMAGE, ENTITY, GROUP, HEAL } from '../constants';

const ITEMS = {
  RES: {
    name: 'RES',
    targetType: ENTITY,
    targetAllies: true,
    effect: HEAL,
    power: 20,
    tp: 3,
  },
  FOI: {
    name: 'FOI',
    targetType: ENTITY,
    effect: DAMAGE,
    power: 14, // TODO: add support for value ranges
    tp: 2,
  },
  GIFOI: {
    name: 'GIFOI',
    targetType: GROUP,
    effect: DAMAGE,
    power: 20,
    tp: 5,
  },
  LIGHTNING: {
    name: 'LIGHTNING',
    targetType: ALL,
    effect: DAMAGE,
    power: 100,
    tp: 5,
  },
};

export default ITEMS;
