import React, { useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { AppStateContext } from '../state';

// TODO: ts
const spriteAnimation = (
  width: number,
  frames: any,
  pixelMultiplier: number
) => keyframes`
  ${frames.map(
    (frame: number, index: number) => `
    ${(index * (100 / frames.length)).toFixed(2)}% {
      background-position: ${-width * pixelMultiplier * frame}px;
    }
  `
  )}
`;

// TODO: ts
const SpriteContainer: React.FC<any> = styled.div`
  background: url('./assets/${({ spriteImg }: any) => spriteImg}.png');
  background-size: ${({ height, pixelMultiplier }: any) =>
    `auto ${height * pixelMultiplier}px`};
  background-repeat: no-repeat;
  ${({ width, frames, duration, pixelMultiplier }: any) => {
    if (!Array.isArray(frames)) {
      return css`
        background-position: ${-width * pixelMultiplier * frames}px;
      `;
    } else if (frames.length === 1) {
      return css`
        background-position: ${-width * pixelMultiplier * frames[0]}px;
      `;
    } else {
      return css`
        animation: ${spriteAnimation(width, frames, pixelMultiplier)}
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
