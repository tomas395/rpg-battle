import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';

import { AppStateContext } from '../state';

const dissolveAnimation = (pixelMultiplier: number) => keyframes`
  from {
    mask-position: 0 0px;
  }
  to {
    mask-position: 0 -${1216 * pixelMultiplier}px;
  }
`;

const DissolveContainer = styled((props) => <div {...props} />)`
  width: ${({ width, pixelMultiplier }) => width * pixelMultiplier}px;
  mask: ${({ dissolving }) =>
    dissolving ? 'url(./assets/gradient-mask.png)' : 'none'};
  mask-size: ${({ pixelMultiplier }) => 128 * pixelMultiplier}px auto;
  mask-position: 0 -${({ pixelMultiplier }) => 1216 * pixelMultiplier}px;
  animation: ${({ pixelMultiplier }) => dissolveAnimation(pixelMultiplier)} 3s
    steps(20) forwards 1 ${({ reverse }) => (reverse ? '' : ' reverse')};
  animation-name: ${({ dissolving, pixelMultiplier }) =>
    dissolving ? dissolveAnimation(pixelMultiplier) : 'none'};
`;

interface DissolveProps {
  dissolving: boolean;
  reverse?: boolean;
  width?: number;
  style?: object;
}

const Dissolve: React.FC<DissolveProps> = ({
  dissolving,
  children,
  reverse,
  width,
  style,
}) => {
  const [state] = useContext(AppStateContext);
  const { pixelMultiplier } = state;

  return (
    <DissolveContainer
      dissolving={dissolving}
      reverse={reverse}
      width={width}
      style={style}
      pixelMultiplier={pixelMultiplier}
    >
      {children}
    </DissolveContainer>
  );
};

export default Dissolve;
