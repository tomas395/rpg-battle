import { useState, useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../state';
import { actionCreators } from '../actions';
import { GameStatesEnum, ATTACK } from '../constants';
import { sortEntitiesBySpeed } from '../utils';
import Window from './Window';
import Hero from './Hero';

const {
  startNewRound: startNewRoundAction,
  setPlayerInterrupt,
  queueAction,
  attackThunk,
} = actionCreators;
const { INIT, PLAYER_INPUT, EXECUTING, GAME_WON, GAME_LOST } = GameStatesEnum;

const PlayerInfo = styled.section`
  display: flex;
  justify-content: center;
  background-color: #000080;
  flex: 0 0 230px;
  height: 230px;
`;

const PlayerMenu = styled(Window)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1.1px;
  order: 1;
`;

const PlayerButton = styled.button`
  background-color: red;
  padding: 10px;
`;

const PlayerInfoSection = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState, queueIndex, groups } = state;
  // TODO: looking like this will need to be global (need to access it in several places, )
  const [activeHero, setActiveHero] = useState<number | undefined>();

  const startNewRound = () => {
    const newQueue = [
      ...groups.player.entities,
      ...groups.leftEnemies.entities,
      ...groups.rightEnemies.entities,
    ]
      .sort(sortEntitiesBySpeed)
      .map((entity) => entity.queuedActions)
      .reduce((prev, curr) => [...prev, ...curr], []);

    dispatch(startNewRoundAction(newQueue));
  };

  const handleSelectHero = (index: number | undefined) => {
    setActiveHero(index);
  };

  return (
    <PlayerInfo>
      {groups.player.entities.map((hero, index) => (
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
                  target: { group: 'leftEnemies', index: 0 },
                  actionCreator: attackThunk,
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
                  target: { group: 'rightEnemies', index: 0 },
                  actionCreator: attackThunk,
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
        <p>ATTK</p>
        <PlayerButton
          disabled={
            queueIndex !== null ||
            gameState === INIT ||
            gameState === GAME_WON ||
            gameState === GAME_LOST
          }
          onClick={startNewRound}
        ></PlayerButton>
        <p>ORDR</p>
        <PlayerButton
          disabled={queueIndex === null || gameState !== EXECUTING}
          onClick={() => {
            dispatch(setPlayerInterrupt(true));
          }}
        ></PlayerButton>
      </PlayerMenu>
    </PlayerInfo>
  );
};

export default PlayerInfoSection;
