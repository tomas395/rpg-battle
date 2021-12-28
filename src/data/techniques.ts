import { DAMAGE, ENTITY, HEAL } from '../constants';

const ITEMS = {
  RES: {
    name: 'RES',
    targetType: ENTITY,
    targetAllies: true,
    effect: HEAL,
    power: 10,
    tp: 5,
  },
  FOI: {
    name: 'FOI',
    targetType: ENTITY,
    effect: DAMAGE,
    power: 10,
    tp: 5,
  },
};

export default ITEMS;
