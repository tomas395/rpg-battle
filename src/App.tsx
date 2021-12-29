import { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import './Reset.css';
import './App.css';
import { AppStateContext } from './state';
import Title from './pages/Title';
import NewGame from './pages/NewGame';
import Battle from './pages/Battle';
import About from './pages/About';
import { actionCreators } from './actions';

const { setPixelMultiplier } = actionCreators;

const slideAnimation = (pixelMultiplier: number) => keyframes`
  0% {
    background-position: 0px;
  }
  100% {
    background-position: ${320 * pixelMultiplier}px;
  }
`;

const AppContainer = styled((props) => <main {...props} />)`
  color: #e5e4e2;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: url('./assets/star-bg.png');
  background-size: ${({ pixelMultiplier }) => 320 * pixelMultiplier}px
    ${({ pixelMultiplier }) => 240 * pixelMultiplier}px;
  background-repeat: repeat;
  font-size: ${({ pixelMultiplier }) => 8 * pixelMultiplier}px;
  animation: ${({ pixelMultiplier }) => slideAnimation(pixelMultiplier)} 60s
    linear infinite;
  animation-fill-mode: forwards;
`;

export default function App() {
  const [state, dispatch] = useContext(AppStateContext);
  const { pixelMultiplier } = state;

  useEffect(() => {
    const handleResize = () => {
      const multiplier =
        window.innerWidth / window.innerHeight >= 4 / 3
          ? window.innerHeight / 240
          : window.innerWidth / 320;
      dispatch(setPixelMultiplier(multiplier));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <Router>
      <AppContainer pixelMultiplier={pixelMultiplier}>
        <Switch>
          <Route exact path="/" component={Title} />
          <Route exact path="/new-game" component={NewGame} />
          <Route exact path="/battle" component={Battle} />
          <Route exact path="/about" component={About} />
          <Redirect to="/" />
        </Switch>
      </AppContainer>
    </Router>
  );
}
