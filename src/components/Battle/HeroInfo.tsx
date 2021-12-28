import { useState, useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../../state';
import { actionCreators } from '../../actions';
import { generateQueue } from '../../utils';
import {
  INIT,
  PLAYER_INPUT,
  EXECUTING,
  GAME_WON,
  GAME_LOST,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
  NEW_GAME,
  POST_EXECUTION,
} from '../../constants';
import GameMenu from './GameMenu';
import HeroMenu from './HeroMenu';
import Window from '../Window';
import HeroCard from './HeroCard';
import AnimatedSprite from '../AnimatedSprite';

const { startNewRound: startNewRoundAction, setPlayerInterrupt } =
  actionCreators;

const HeroInfoContainer = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  flex: 0 0 22%;
  height: 22%;
`;

const PlayerButtons = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16%;
  order: 1;
`;

const PlayerButton = styled.button`
  background: none;
  border: none;
  outline: none;
  padding: 0;
  color: white;
`;

const PlayerInfo = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, queueIndex, playerInterrupt, groups, pixelMultiplier } =
    state;
  const [activeHeroIndex, setActiveHeroIndex] = useState<number | undefined>();
  const [gameMenuOpen, setGameMenuOpen] = useState<boolean>(false);

  const startNewRound = () => {
    const newQueue = generateQueue([
      ...groups[PLAYER_GROUP].entities,
      ...groups[LEFT_ENEMY_GROUP].entities,
      ...groups[RIGHT_ENEMY_GROUP].entities,
    ]);

    dispatch(startNewRoundAction(newQueue));
  };

  const handleSelectHero = (index: number | undefined) => {
    setActiveHeroIndex(activeHeroIndex === index ? undefined : index);
  };

  return (
    <HeroInfoContainer>
      {Array.from(Array(4)).map((el, index) => {
        const hero = groups[PLAYER_GROUP].entities[index];

        return (
          <HeroCard
            key={hero?.name || `blank-hero-${index}`}
            hero={hero}
            index={index}
            handleSelect={
              gameState === INIT || gameState === PLAYER_INPUT
                ? handleSelectHero
                : undefined
            }
          />
        );
      })}

      {activeHeroIndex !== undefined && (
        <HeroMenu
          activeHero={groups[PLAYER_GROUP].entities[activeHeroIndex]}
          handleClose={() => {
            setActiveHeroIndex(undefined);
          }}
        />
      )}

      <PlayerButtons>
        <PlayerButton
          disabled={
            activeHeroIndex !== undefined ||
            queueIndex !== null ||
            gameState === INIT ||
            gameState === NEW_GAME ||
            gameState === GAME_WON ||
            gameState === GAME_LOST
          }
          onClick={startNewRound}
        >
          <div
            style={{
              height: 8 * pixelMultiplier,
              width: 14 * pixelMultiplier,
              margin: '0 auto',
            }}
          >
            <AnimatedSprite
              height={8}
              width={14}
              spriteImg={'button-light'}
              frames={
                queueIndex !== null ||
                gameState === GAME_WON ||
                gameState === GAME_LOST
                  ? [1]
                  : [0]
              }
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </div>
          <div>FGHT</div>
        </PlayerButton>
        <PlayerButton
          disabled={
            playerInterrupt ||
            queueIndex === null ||
            (gameState !== EXECUTING && gameState !== POST_EXECUTION)
          }
          onClick={() => {
            dispatch(setPlayerInterrupt(true));
          }}
        >
          <div
            style={{
              height: 8 * pixelMultiplier,
              width: 14 * pixelMultiplier,
              margin: '0 auto',
            }}
          >
            <AnimatedSprite
              height={8}
              width={14}
              spriteImg={'button-light'}
              frames={
                playerInterrupt ||
                queueIndex === null ||
                (gameState !== EXECUTING && gameState !== POST_EXECUTION)
                  ? [1]
                  : [0]
              }
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </div>
          <div>STGY</div>
        </PlayerButton>
        <button
          onClick={() => {
            dispatch(setPlayerInterrupt(true));
            setGameMenuOpen(true);
          }}
        >
          Exit
        </button>
      </PlayerButtons>

      {(gameMenuOpen ||
        gameState === INIT ||
        gameState === GAME_WON ||
        gameState === GAME_LOST) && (
        <GameMenu
          handleClose={() => {
            setGameMenuOpen(false);
          }}
        />
      )}
    </HeroInfoContainer>
  );
};

export default PlayerInfo;
