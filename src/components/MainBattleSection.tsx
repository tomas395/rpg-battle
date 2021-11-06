import { useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../state';
import {
  SPRITE_MULTIPLIER,
  INIT,
  PLAYER_INPUT,
  GAME_WON,
  GAME_LOST,
  DEAD,
  IDLE,
  DYING,
  HURT,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
  PLAYER_GROUP,
} from '../constants';
import Window from './Window';
import Dissolve from './Dissolve';
import NewGameMenu from './NewGameMenu';
import AnimatedSprite from './AnimatedSprite';

const BattleSection = styled.section`
  position: relative;
  flex: 0 1 100%;
`;

const MessageBox = styled(Window)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 14px;
`;

const MainBattleSection = () => {
  const [state] = useContext(AppStateContext);
  const { gameState, groups } = state;

  const combinedEnemies = [
    ...groups[LEFT_ENEMY_GROUP].entities,
    ...groups[RIGHT_ENEMY_GROUP].entities,
  ];

  return (
    <BattleSection>
      {combinedEnemies.map(
        ({
          id,
          name,
          type, // TODO: consider renaming this to entityType
          status,
          leftPosition,
          currentAnimation,
          animations,
        }) => {
          const animationType = currentAnimation.type;

          const { frames = 0, duration = 0 } = animationType
            ? animations[animationType]
            : {};

          return (
            <Dissolve
              key={id}
              reverse
              width={64}
              style={{
                position: 'absolute',
                top: 0,
                left: leftPosition,
                height: 64 * SPRITE_MULTIPLIER,
                width: 64 * SPRITE_MULTIPLIER,
                transform: `translateX(-50%)`,
              }}
            >
              <AnimatedSprite
                key={name}
                height={64}
                width={64}
                spriteImg={type ? String(type).toLowerCase() : 'froggy'}
                frames={frames}
                duration={duration}
                style={{
                  visibility: status === DEAD ? 'hidden' : undefined,
                  height: '100%',
                  width: '100%',
                  transformOrigin: 'bottom right',
                  animation:
                    animationType === HURT || animationType === DYING
                      ? 'shake 0.5s'
                      : undefined,
                  animationIterationCount:
                    animationType === HURT || animationType === DYING
                      ? 'infinite'
                      : undefined,
                }}
              />
            </Dissolve>
          );
        }
      )}

      {groups[PLAYER_GROUP].entities.map(
        (
          { id, name, status, leftPosition, currentAnimation, animations },
          index
        ) => {
          const animationType = currentAnimation.type;
          const left = currentAnimation.left;

          const {
            frames = 0,
            duration = 0,
            top = undefined,
            bottom = undefined,
          } = animationType ? animations[animationType] : {};

          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                top: top,
                bottom: `${bottom || 0}px`,
                left: left || leftPosition,
                height: 64 * SPRITE_MULTIPLIER,
                width: 64 * SPRITE_MULTIPLIER,
                transform: `translateX(-50%)`,
              }}
            >
              <AnimatedSprite
                key={name}
                height={64}
                width={64}
                spriteImg={
                  index === 0
                    ? 'rolf'
                    : index === 1
                    ? 'rudo'
                    : index === 2
                    ? 'nei'
                    : 'amy'
                }
                frames={frames}
                duration={duration}
                style={{
                  visibility:
                    status === DEAD ||
                    (gameState !== PLAYER_INPUT && animationType === IDLE)
                      ? 'hidden'
                      : undefined,
                  height: '100%',
                  width: '100%',
                  transformOrigin: 'bottom right',
                  transform: `rotate(${status === DEAD ? 90 : 0}deg)`,
                  animation:
                    animationType === HURT || animationType === DYING
                      ? 'shake 0.5s'
                      : undefined,
                  animationIterationCount:
                    animationType === HURT || animationType === DYING
                      ? 'infinite'
                      : undefined,
                }}
              />
            </div>
          );
        }
      )}

      {Boolean(groups[PLAYER_GROUP].message) && (
        <MessageBox>{groups[PLAYER_GROUP].message}</MessageBox>
      )}

      {(gameState === INIT ||
        gameState === GAME_WON ||
        gameState === GAME_LOST) && <NewGameMenu />}
    </BattleSection>
  );
};

export default MainBattleSection;
