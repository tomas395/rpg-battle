import { useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../../state';
import { EntityType } from '../../types';
import Window from '../Window';

const HeroContainer = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  const [state] = useContext(AppStateContext);
  const { pixelMultiplier } = state;

  const { hp, tp, name, queuedAction } = hero || {};

  return (
    <HeroContainer
      style={{ order: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : 3 }}
    >
      {Boolean(hero) ? (
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
          <div>HP {hp <= 0 ? '✞' : hp}</div>
          <div>TP {tp}</div>
          <div>{name}</div>
          {active ? '*' : ''}
          {Boolean(queuedAction) && queuedAction.type}
        </button>
      ) : (
        <img
          src="./assets/blank_hero_icon.png"
          alt="blank hero icon"
          style={{ width: 32 * pixelMultiplier, height: 32 * pixelMultiplier }}
        />
      )}
    </HeroContainer>
  );
};

export default Hero;
