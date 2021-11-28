import styled from 'styled-components';

import { EntityTypesEnum } from '../../constants';
import Window from '../Window';

const EnemyGroupContainer = styled.div`
  width: 35%;
  display: flex;
  justify-content: flex-end;
`;

const EnemyMessage = styled(Window)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
`;

const EnemyName = styled(Window)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
`;

interface EnemyGroupProps {
  type?: EntityTypesEnum;
  message: string | number;
}

const EnemyGroup = (props: EnemyGroupProps) => {
  const { type, message } = props;

  return (
    <EnemyGroupContainer>
      <EnemyName>{type}</EnemyName>
      <EnemyMessage>{message}</EnemyMessage>
    </EnemyGroupContainer>
  );
};

export default EnemyGroup;
