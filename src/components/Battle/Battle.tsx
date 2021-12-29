import { useContext, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import { AppStateContext } from '../../state';
import EnemyInfo from './EnemyInfo';
import BattleAnimation from './BattleAnimation';
import HeroInfo from './HeroInfo';
import { HURT, PLAYER_GROUP } from '../../constants';

const BattleContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const flashAnimation = keyframes`
  0% {
    background-position: 0%;
  }
  50% {
    background-position: -100%;
  }
`;

const BattleWindow = styled((props: any) => <div {...props} />)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  aspect-ratio: 4 / 3;
  width: 133.33vmin;
  overflow: hidden;
  outline: 4px solid #000088;
  background: url('/assets/battle-bg.png');
  background-size: auto 100%;
  ${({ bgFlash }: any) => {
    if (bgFlash) {
      return css`
        animation: ${flashAnimation} 0.35s steps(1) infinite;
      `;
    }
  }}
`;

const Battle = () => {
  const [state] = useContext(AppStateContext);
  const {
    groups: {
      [PLAYER_GROUP]: { entities: heroes },
    },
  } = state;

  const [bgFlash, setBgFlash] = useState(false);

  useEffect(() => {
    if (heroes.find((entity) => entity.currentAnimation.type === HURT)) {
      setBgFlash(true);
    } else {
      setBgFlash(false);
    }
  }, [heroes]);

  return (
    <BattleContainer>
      <BattleWindow bgFlash={bgFlash}>
        <EnemyInfo />
        <BattleAnimation />
        <HeroInfo />
      </BattleWindow>
    </BattleContainer>
  );
};

export default Battle;
