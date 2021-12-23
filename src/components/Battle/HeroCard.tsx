import styled from 'styled-components';

import { EntityType } from '../../types';
import Window from '../Window';
import Sprite from '../Sprite';

const HeroCardContainer = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  width: 21%;
`;

const HeroButton = styled((props) => <button {...props} />)`
  background: none;
  width: 100%;
  height: 100%;
  border: none;
  color: inherit;
  text-align: left;
`;

interface HeroCardProps {
  hero: EntityType;
  index: number;
  handleSelect?: (index: number | undefined) => void;
}

const HeroCard = ({ hero, index, handleSelect }: HeroCardProps) => {
  const { hp, tp, name, queuedAction } = hero || {};

  return (
    <HeroCardContainer
      style={{ order: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : 3 }}
    >
      {Boolean(hero) ? (
        <HeroButton
          onClick={() => {
            if (typeof handleSelect === 'function') {
              handleSelect(index);
            }
          }}
        >
          <div style={{ width: '100%', textAlign: 'left' }}>
            HP <span style={{ float: 'right' }}>{hp <= 0 ? '✞' : hp}</span>
          </div>
          <div style={{ width: '100%', textAlign: 'left' }}>
            TP <span style={{ float: 'right' }}>{tp}</span>
          </div>
          <div>
            <Sprite
              src={`./assets/${String(
                queuedAction.type
              ).toLowerCase()}-icon.png`}
              width={16}
              height={16}
              alt="action icon"
            />
            {name}
          </div>
        </HeroButton>
      ) : (
        <Sprite
          src="./assets/blank-hero-icon.png"
          width={32}
          height={32}
          alt="blank hero icon"
        />
      )}
    </HeroCardContainer>
  );
};

export default HeroCard;
