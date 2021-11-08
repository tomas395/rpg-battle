import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import { SPRITE_MULTIPLIER } from '../constants';

// TODO: ts
const spriteAnimation = (frames: any) => keyframes`
  ${frames.map(
    (frame: number, index: number) => `
    ${(index * (100 / frames.length)).toFixed(2)}% {
      background-position: ${-64 * SPRITE_MULTIPLIER * frame}px;
    }
  `
  )}
`;

// TODO: ts
const SpriteContainer: React.FC<any> = styled.div`
  background: url('./assets/${({ spriteImg }: any) => spriteImg}.png');
  background-size: auto ${({ width }: any) => width * SPRITE_MULTIPLIER}px;
  background-repeat: no-repeat;
  ${({ frames, duration }: any) => {
    if (!Array.isArray(frames)) {
      return css`
        background-position: ${-64 * SPRITE_MULTIPLIER * frames}px;
      `;
    } else if (frames.length === 1) {
      return css`
        background-position: ${-64 * SPRITE_MULTIPLIER * frames[0]}px;
      `;
    } else {
      return css`
        animation: ${spriteAnimation(frames)} ${duration / 1000}s steps(1)
          infinite;
      `;
    }
  }}
`;

const AnimatedSprite: React.FC<any> = (props) => <SpriteContainer {...props} />;

export default AnimatedSprite;
