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
  background-color: red;
  padding: 5%;
`;

const PlayerInfo = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, queueIndex, playerInterrupt, groups } = state;
  // TODO: looking like this will need to be global (need to access it in several places, and be able to reset, etc.)
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
        <div>FGHT</div>
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
        />
        <div>STGY</div>
        <PlayerButton
          disabled={
            playerInterrupt ||
            queueIndex === null ||
            (gameState !== EXECUTING && gameState !== POST_EXECUTION)
          }
          onClick={() => {
            dispatch(setPlayerInterrupt(true));
          }}
        />
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
