import { useState, useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../state';
import { actionCreators } from '../actions';
import { generateQueue } from '../utils';
import {
  INIT,
  PLAYER_INPUT,
  EXECUTING,
  GAME_WON,
  GAME_LOST,
  ATTACK,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
  NEW_GAME,
  POST_EXECUTION,
} from '../constants';
import Window from './Window';
import Hero from './Hero';

const {
  startNewRound: startNewRoundAction,
  setPlayerInterrupt,
  queueAction,
} = actionCreators;

const PlayerInfo = styled.section`
  display: flex;
  justify-content: center;
  flex: 0 0 30%;
  height: 30%;
`;

const PlayerMenu = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16%;
  order: 1;
`;

const PlayerButton = styled.button`
  background-color: red;
  padding: 10px;
`;

const PlayerInfoSection = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, queueIndex, playerInterrupt, groups } = state;
  // TODO: looking like this will need to be global (need to access it in several places, and be able to reset, etc.)
  const [activeHero, setActiveHero] = useState<number | undefined>();

  const startNewRound = () => {
    const newQueue = generateQueue([
      ...groups[PLAYER_GROUP].entities,
      ...groups[LEFT_ENEMY_GROUP].entities,
      ...groups[RIGHT_ENEMY_GROUP].entities,
    ]);

    dispatch(startNewRoundAction(newQueue));
  };

  const handleSelectHero = (index: number | undefined) => {
    setActiveHero(index);
  };

  return (
    <PlayerInfo>
      {groups[PLAYER_GROUP].entities.map((hero, index) => (
        <Hero
          key={hero.name}
          hero={hero}
          index={index}
          active={activeHero === index}
          handleSelect={
            gameState === INIT || gameState === PLAYER_INPUT
              ? handleSelectHero
              : undefined
          }
        />
      ))}

      {activeHero !== undefined && (
        <Window
          style={{
            position: 'absolute',
            bottom: 230,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={() => {
              dispatch(
                queueAction({
                  heroIndex: activeHero,
                  target: { group: LEFT_ENEMY_GROUP, index: 0 },
                  type: ATTACK,
                })
              );
              setActiveHero(undefined);
            }}
          >
            Left Enemy Group
          </button>
          <button
            onClick={() => {
              dispatch(
                queueAction({
                  heroIndex: activeHero,
                  target: { group: RIGHT_ENEMY_GROUP, index: 0 },
                  type: ATTACK,
                })
              );
              setActiveHero(undefined);
            }}
          >
            Right Enemy Group
          </button>
        </Window>
      )}

      <PlayerMenu>
        <div>ATTK</div>
        <PlayerButton
          disabled={
            queueIndex !== null ||
            gameState === INIT ||
            gameState === NEW_GAME ||
            gameState === GAME_WON ||
            gameState === GAME_LOST
          }
          onClick={startNewRound}
        />
        <div>ORDR</div>
        <PlayerButton disabled onClick={() => {}} />
        <button
          disabled={
            playerInterrupt ||
            queueIndex === null ||
            (gameState !== EXECUTING && gameState !== POST_EXECUTION)
          }
          onClick={() => {
            dispatch(setPlayerInterrupt(true));
          }}
        >
          Interrupt
        </button>
      </PlayerMenu>
    </PlayerInfo>
  );
};

export default PlayerInfoSection;
