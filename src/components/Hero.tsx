import styled from 'styled-components';

import { EntityType } from '../types';
import Window from './Window';

const HeroContainer = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 1 auto;
  width: 21%;
`;

interface HeroProps {
  hero: EntityType;
  index: number;
  active: boolean;
  handleSelect?: (index: number | undefined) => void;
}

const Hero = ({ hero, index, active, handleSelect }: HeroProps) => {
  const { hp, tp, name, queuedAction } = hero;

  return (
    <HeroContainer
      style={{ order: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : 3 }}
    >
      <button
        onClick={() => {
          if (typeof handleSelect === 'function') {
            handleSelect(index);
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          width: '100%',
          height: '100%',
        }}
      >
        <div>HP: {hp <= 0 ? '✞' : hp}</div>
        <div>TP: {tp}</div>
        <div>{name}</div>
        {active ? '*' : ''}
        {Boolean(queuedAction) && queuedAction.type}
      </button>
    </HeroContainer>
  );
};

export default Hero;
