import { HEAD, ROLF, RUDO, NEI, AMY } from '../constants';

const ARMOR = {
  HEADGEAR: {
    name: 'HEADGEAR',
    defensePower: 3,
    type: HEAD,
    equippableBy: [ROLF, RUDO, AMY],
  },
  RIBBON: {
    name: 'RIBBON',
    defensePower: 3,
    type: HEAD,
    equippableBy: [NEI],
  },
};

export default ARMOR;
