import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Window from '../components/Window';

const StagingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Staging = () => (
  <StagingContainer>
    <h1>New Game</h1>
    <Window
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translate(0,-50%)',
      }}
    >
      <ul>
        <li>
          <Link to="battle">Battle</Link>
        </li>
        <li>
          <Link to="/">Cancel</Link>
        </li>
      </ul>
    </Window>
  </StagingContainer>
);

export default Staging;
