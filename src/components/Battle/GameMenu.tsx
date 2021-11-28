import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AppStateContext } from '../../state';
import { actionCreators } from '../../actions';
import { NEW_GAME, GAME_WON, GAME_LOST } from '../../constants';
import Window from '../Window';

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

interface GameMenuProps {
  handleClose: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ handleClose }) => {
  const [state, dispatch] = useContext(AppStateContext);
  const { gameState } = state;

  const replayGame = () => {
    const newGameData = {
      ...state,
      gameState: NEW_GAME,
      queue: [],
      queueIndex: null,
      playerInterrupt: false,
    };

    dispatch(startNewGameAction(newGameData));
    handleClose();
  };

  return (
    <Window
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '2rem',
        zIndex: 10, // TODO: might be worth building a simple dialog controller for windows like this
      }}
    >
      <div>
        {gameState === GAME_WON
          ? 'You win! :)'
          : gameState === GAME_LOST
          ? 'You lose! :('
          : 'Had Enough?'}
      </div>
      --------------
      <Button disabled onClick={replayGame}>
        Replay
      </Button>
      {/* TODO: global link/button styles */}
      <Link to="/new-game">
        <Button>New Game</Button>
      </Link>
      <Link to="/">
        <Button>Quit</Button>
      </Link>
      --------------
      <Button onClick={handleClose}>Continue</Button>
    </Window>
  );
};

export default GameMenu;
