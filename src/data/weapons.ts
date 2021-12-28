import { ENTITY, ROLF, RUDO, NEI, AMY, GROUP } from '../constants';

const WEAPONS = {
  KNIFE: {
    name: 'KNIFE',
    attackPower: 5,
    targetType: ENTITY,
    attackType: 'SLASH',
    equippableBy: [ROLF, RUDO, AMY],
  },
  STEEL_BAR: {
    name: 'STEEL_BAR',
    attackPower: 7,
    defensePower: 2,
    targetType: ENTITY,
    attackType: 'SLASH',
    equippableBy: [NEI],
  },
  SHOTGUN: {
    name: 'SHOTGUN',
    attackPower: 20,
    targetType: GROUP,
    attackType: 'SHOOT',
    equippableBy: [RUDO],
    twoHanded: true,
  },
};

export default WEAPONS;
