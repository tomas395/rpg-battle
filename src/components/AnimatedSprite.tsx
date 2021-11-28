import React, { useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { AppStateContext } from '../state';

// TODO: ts
const spriteAnimation = (frames: any, pixelMultiplier: number) => keyframes`
  ${frames.map(
    (frame: number, index: number) => `
    ${(index * (100 / frames.length)).toFixed(2)}% {
      background-position: ${-64 * pixelMultiplier * frame}px;
    }
  `
  )}
`;

// TODO: ts
const SpriteContainer: React.FC<any> = styled.div`
  background: url('./assets/${({ spriteImg }: any) => spriteImg}.png');
  background-size: auto
    ${({ width, pixelMultiplier }: any) => width * pixelMultiplier}px;
  background-repeat: no-repeat;
  ${({ frames, duration, pixelMultiplier }: any) => {
    if (!Array.isArray(frames)) {
      return css`
        background-position: ${-64 * pixelMultiplier * frames}px;
      `;
    } else if (frames.length === 1) {
      return css`
        background-position: ${-64 * pixelMultiplier * frames[0]}px;
      `;
    } else {
      return css`
        animation: ${spriteAnimation(frames, pixelMultiplier)}
          ${duration / 1000}s steps(1) infinite;
      `;
    }
  }}
`;

const AnimatedSprite: React.FC<any> = (props) => {
  const [state] = useContext(AppStateContext);
  const { pixelMultiplier } = state;

  return <SpriteContainer {...props} pixelMultiplier={pixelMultiplier} />;
};

export default AnimatedSprite;
