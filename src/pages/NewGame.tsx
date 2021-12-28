import { ChangeEvent, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AppStateContext } from '../state';
import { actionCreators } from '../actions';
import {
  NEW_GAME,
  PLAYER_GROUP,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
  HeroesEnum,
  EnemyTypesEnum,
  OK,
  ATTACK,
  IDLE,
  ROLF,
  FROGGY,
  WRESTLER,
  NEI,
} from '../constants';
import HEROES from '../data/heroes';
import ENEMIES from '../data/enemies';
import Window from '../components/Window';

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
  const history = useHistory();
  const [, dispatch] = useContext(AppStateContext);

  const [heroes, setHeroes] = useState<HeroesEnum[]>([ROLF, NEI]);
  const [leftEnemyType, setLeftEnemyType] = useState<
    EnemyTypesEnum | undefined
  >(FROGGY);
  const [leftEnemyCount, setLeftEnemyCount] = useState<number>(3);
  const [rightEnemyType, setRightEnemyType] = useState<
    EnemyTypesEnum | undefined
  >(WRESTLER);
  const [rightEnemyCount, setRightEnemyCount] = useState<number>(1);

  const totalEnemyCount = leftEnemyCount + rightEnemyCount;

  const leftSlots = leftEnemyType
    ? leftEnemyCount * ENEMIES[leftEnemyType].size
    : 0;
  const rightSlots = rightEnemyType
    ? rightEnemyCount * ENEMIES[rightEnemyType].size
    : 0;
  const totalSlots = 4;
  const freeSlots = totalSlots - leftSlots - rightSlots;

  const startNewGame = () => {
    const newGameData = {
      gameState: NEW_GAME,
      queue: [],
      queueIndex: null,
      playerInterrupt: false,
      groups: {
        [PLAYER_GROUP]: {
          message: '',
          entities: heroes.map((heroName: HeroesEnum, index) => ({
            ...HEROES[heroName],
            id: uuid(),
            index,
            status: OK,
            group: PLAYER_GROUP,
            leftPosition: `${
              index === 0 ? 40 : index === 1 ? 60 : index === 2 ? 20 : 80
            }%`,
            queuedAction: {
              type: ATTACK,
              target: {
                group: LEFT_ENEMY_GROUP,
                index: 0,
              },
            },
            currentAnimation: { type: IDLE },
          })),
        },
        [LEFT_ENEMY_GROUP]: {
          type: leftEnemyType,
          message: '',
          entities:
            leftEnemyType && leftEnemyCount
              ? Array.from(Array(leftEnemyCount)).map((el, index) => ({
                  ...ENEMIES[leftEnemyType],
                  id: uuid(),
                  index,
                  group: LEFT_ENEMY_GROUP,
                  status: OK,
                  leftPosition: `${
                    (index + 1) * (100 / (leftSlots + rightSlots + 1))
                  }%`,
                  queuedAction: {
                    type: ATTACK,
                    target: {
                      group: PLAYER_GROUP,
                      index: 0,
                    },
                  },
                  currentAnimation: { type: IDLE },
                }))
              : [],
        },
        [RIGHT_ENEMY_GROUP]: {
          type: rightEnemyType,
          message: '',
          entities:
            rightEnemyType && rightEnemyCount
              ? Array.from(Array(rightEnemyCount)).map((el, index) => ({
                  ...ENEMIES[rightEnemyType],
                  id: uuid(),
                  index,
                  group: RIGHT_ENEMY_GROUP,
                  status: OK,
                  leftPosition: `${
                    (leftEnemyCount + index + 1) *
                    (100 / (leftSlots + rightSlots + 1))
                  }%`,
                  queuedAction: {
                    type: ATTACK,
                    target: {
                      group: PLAYER_GROUP,
                      index: 0,
                    },
                  },
                  currentAnimation: { type: IDLE },
                }))
              : [],
        },
      },
    };
    dispatch(startNewGameAction(newGameData));
    history.push('/battle');
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
      <h3>Let's go!</h3>
      --------------
      <br />
      <h4>Heroes: </h4>
      <select
        onClick={({ target: { value } }: any) => {
          // TODO: ts
          console.log(value);
          const newHeroes = [...heroes];
          newHeroes.push(value as HeroesEnum);
          setHeroes(newHeroes);
        }}
        size={4}
        style={{ minWidth: 100 }}
      >
        {Object.values(HeroesEnum)
          .filter((heroName: HeroesEnum) => heroes.indexOf(heroName) === -1)
          .map((heroName: HeroesEnum) => (
            <option value={heroName}>{heroName}</option>
          ))}
      </select>
      <select
        onClick={({ target: { value } }: any) => {
          // TODO: ts
          console.log(value);
          console.log(heroes.indexOf(value as HeroesEnum));
          const newHeroes = [...heroes];
          newHeroes.splice(heroes.indexOf(value as HeroesEnum), 1);
          setHeroes(newHeroes);
        }}
        size={4}
        style={{ minWidth: 100 }}
      >
        {heroes.map((heroName: HeroesEnum) => (
          <option value={heroName}>{heroName}</option>
        ))}
      </select>
      <br />
      --------------
      <h4>Enemies: </h4>
      <select
        onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) =>
          setLeftEnemyType(
            value === 'None' ? undefined : (value as EnemyTypesEnum)
          )
        }
      >
        <option>None</option>
        {Object.values(EnemyTypesEnum)
          .filter((enemyType) => enemyType !== rightEnemyType)
          .map((enemyType) => (
            <option key={enemyType} value={enemyType}>
              {enemyType}
            </option>
          ))}
      </select>
      <input
        type="number"
        id="leftEnemyCount"
        name="leftEnemyCount"
        value={leftEnemyCount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLeftEnemyCount(Number(e.target.value));
        }}
        min={0}
        max={
          leftEnemyType
            ? (totalSlots - rightSlots) / ENEMIES[leftEnemyType].size
            : 4
        }
        disabled={!leftEnemyType}
      />
      <br />
      <select
        onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) =>
          setRightEnemyType(
            value === 'None' ? undefined : (value as EnemyTypesEnum)
          )
        }
        disabled={
          !leftEnemyType ||
          !leftEnemyCount ||
          (!!leftSlots && !rightSlots && !freeSlots)
        }
      >
        <option>None</option>
        {Object.values(EnemyTypesEnum)
          .filter((enemyType) => enemyType !== leftEnemyType)
          .map((enemyType) => (
            <option key={enemyType} value={enemyType}>
              {enemyType}
            </option>
          ))}
      </select>
      <input
        type="number"
        id="rightEnemyCount"
        name="rightEnemyCount"
        value={rightEnemyCount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRightEnemyCount(Number(e.target.value));
        }}
        min={0}
        max={
          rightEnemyType
            ? (totalSlots - leftSlots) / ENEMIES[rightEnemyType].size
            : 4
        }
        disabled={!rightEnemyType}
      />
      <br />
      --------------
      <Button
        onClick={startNewGame}
        disabled={!heroes.length || totalEnemyCount <= 0}
      >
        Start
      </Button>
      <Link to="/">
        <Button>Cancel</Button>
      </Link>
    </Window>
  );
};

export default NewGameMenu;
