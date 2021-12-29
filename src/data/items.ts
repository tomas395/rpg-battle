import { ENTITY, HEAL } from '../constants';

const ITEMS = {
  MONOMATE: {
    name: 'MONOMATE',
    consumable: true,
    itemTargetType: ENTITY,
    itemTargetAllies: true,
    itemEffect: HEAL,
    itemPower: 10,
  },
};

export default ITEMS;
