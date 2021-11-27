import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TitleContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: url('./assets/title.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const TitleMenu = styled((props: any) => <div {...props} />)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  aspect-ratio: 4 / 3;
  width: 133.33vmin;
  overflow: hidden;
  padding: 0.75em;
`;

const Title = () => (
  <TitleContainer>
    <TitleMenu>
      <Link to="new-game">Start</Link>
      <Link to="about">About</Link>
    </TitleMenu>
  </TitleContainer>
);

export default Title;
