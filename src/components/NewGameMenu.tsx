import { useContext, useState } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../state';
import { actionCreators } from '../actions';
import {
  EXECUTING,
  GAME_WON,
  GAME_LOST,
  FROGGY,
  SAKOFF,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
} from '../constants';
import { generateHeroes, generateEnemies } from '../utils';
import Window from './Window';

const { startNewGame: startNewGameAction } = actionCreators;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  border: 1px solid;
  border-radius: 8px;
  margin: 0 auto;
`;

const NewGameMenu = () => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState } = state;
  const [numHeroes, setNumHeroes] = useState(4);
  const [leftEnemyCount, setLeftEnemyCount] = useState(2);
  const [rightEnemyCount, setRightEnemyCount] = useState(1);
  const totalEnemyCount = leftEnemyCount + rightEnemyCount;

  const startNewGame = () => {
    const newGameData = {
      gameState: EXECUTING,
      queue: [],
      queueIndex: null,
      playerInterrupt: false,
      groups: {
        [PLAYER_GROUP]: {
          entities: generateHeroes(numHeroes),
          message: '',
        },
        [LEFT_ENEMY_GROUP]: {
          type: FROGGY,
          message: '',
          entities: generateEnemies(
            leftEnemyCount,
            FROGGY,
            LEFT_ENEMY_GROUP,
            totalEnemyCount
          ),
        },
        [RIGHT_ENEMY_GROUP]: {
          type: SAKOFF,
          message: '',
          entities: generateEnemies(
            rightEnemyCount,
            SAKOFF,
            RIGHT_ENEMY_GROUP,
            totalEnemyCount,
            leftEnemyCount
          ),
        },
      },
    };

    dispatch(startNewGameAction(newGameData));
  };

  return (
    <Window
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 200,
        padding: '1.5rem 0 0',
        zIndex: 10, // TODO: might be worth building a simple dialog controller for windows like this
      }}
    >
      <div>
        {gameState === GAME_WON
          ? 'You win! :)'
          : gameState === GAME_LOST
          ? 'You lose! :('
          : "Let's go!"}
      </div>
      <label htmlFor="numHeroes">Heroes: </label>
      <input
        type="number"
        id="numHeroes"
        name="numHeroes"
        value={numHeroes}
        onChange={(e: any) => {
          setNumHeroes(e.target.value);
        }}
        min="1"
        max="4"
      />
      <br />
      <label htmlFor="leftEnemyCount">Froggys: </label>
      <input
        type="number"
        id="leftEnemyCount"
        name="leftEnemyCount"
        value={leftEnemyCount}
        onChange={(e: any) => {
          setLeftEnemyCount(Number(e.target.value));
        }}
        min={rightEnemyCount === 0 ? 1 : 0}
        max={rightEnemyCount === 3 ? 1 : rightEnemyCount === 2 ? 2 : 3}
      />
      <br />
      <label htmlFor="rightEnemyCount">Sakoffs: </label>
      <input
        type="number"
        id="rightEnemyCount"
        name="rightEnemyCount"
        value={rightEnemyCount}
        onChange={(e: any) => {
          setRightEnemyCount(Number(e.target.value));
        }}
        min={leftEnemyCount === 0 ? 1 : 0}
        max={leftEnemyCount === 3 ? 1 : leftEnemyCount === 2 ? 2 : 3}
      />
      <br />
      <Button
        onClick={startNewGame}
        disabled={leftEnemyCount + rightEnemyCount <= 0}
      >
        Start Game
      </Button>
    </Window>
  );
};

export default NewGameMenu;
