import { ROLF, RUDO, AMY } from '../constants';

const SHIELDS = {
  CARBON_EMEL: {
    name: 'CARBON_EMEL',
    defensePower: 7,
    equippableBy: [AMY],
  },
  CARBON_SHIELD: {
    name: 'CARBON_SHIELD',
    defensePower: 8,
    equippableBy: [ROLF, RUDO],
  },
};

export default SHIELDS;
