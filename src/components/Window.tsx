import React, { useContext } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../state';

const Container = styled((props) => <div {...props} />)`
  background: #000080;
  color: white;
  position: relative;
  padding: ${({ pixelMultiplier }) => 5 * pixelMultiplier}px
    ${({ pixelMultiplier }) => 8 * pixelMultiplier}px
    ${({ pixelMultiplier }) => 5 * pixelMultiplier}px
    ${({ pixelMultiplier }) => 8 * pixelMultiplier}px;
`;

const Corner = styled.div`
  position: absolute;
  background-size: cover;
  background-repeat: none;
`;

const Side = styled.div`
  position: absolute;
  height: 100%;
  background-size: 100%;
  background-repeat: repeat-y;
`;

const TopBottom = styled((props) => <div {...props} />)`
  position: absolute;
  height: ${({ pixelMultiplier }) => 3 * pixelMultiplier}px;
  width: 100%;
  background-size: ${({ pixelMultiplier }) => 5 * pixelMultiplier}px 100%;
  background-repeat: repeat-x;
`;

interface WindowProps {
  style?: object;
}

const Window: React.FunctionComponent<WindowProps> = (props) => {
  const { children } = props;
  const [state] = useContext(AppStateContext);
  const { pixelMultiplier } = state;

  return (
    <Container {...props} pixelMultiplier={pixelMultiplier}>
      {children}

      <Side
        style={{
          top: 0,
          left: 0,
          width: 5 * pixelMultiplier,
          backgroundImage: 'url(./assets/left.png)',
        }}
      />
      <Side
        style={{
          top: 0,
          right: 0,
          width: 5 * pixelMultiplier,
          backgroundImage: 'url(./assets/right.png)',
        }}
      />
      <TopBottom
        style={{ top: 0, left: 0, backgroundImage: 'url(./assets/top.png)' }}
        pixelMultiplier={pixelMultiplier}
      />
      <TopBottom
        style={{
          bottom: 0,
          left: 0,
          backgroundImage: 'url(./assets/bottom.png)',
        }}
        pixelMultiplier={pixelMultiplier}
      />
      <Corner
        style={{
          top: 0,
          left: 0,
          width: 5 * pixelMultiplier,
          height: 3 * pixelMultiplier,
          backgroundImage: 'url(./assets/top-left-corner.png)',
        }}
      />
      <Corner
        style={{
          top: 0,
          right: 0,
          width: 5 * pixelMultiplier,
          height: 3 * pixelMultiplier,
          backgroundImage: 'url(./assets/top-right-corner.png)',
        }}
      />
      <Corner
        style={{
          bottom: 0,
          left: 0,
          width: 5 * pixelMultiplier,
          height: 3 * pixelMultiplier,
          backgroundImage: 'url(./assets/bottom-left-corner.png)',
        }}
      />
      <Corner
        style={{
          bottom: 0,
          right: 0,
          width: 5 * pixelMultiplier,
          height: 3 * pixelMultiplier,
          backgroundImage: 'url(./assets/bottom-right-corner.png)',
        }}
      />
    </Container>
  );
};

export default Window;
