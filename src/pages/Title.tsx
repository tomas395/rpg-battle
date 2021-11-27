import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  background: url('./assets/title.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  padding: 32px;
`;

const Title = () => (
  <TitleContainer>
    <Link to="staging">Start</Link>
  </TitleContainer>
);

export default Title;
