import styled from 'styled-components';

import { EnemyTypesEnum } from '../../constants';
import Window from '../Window';

const EnemyGroupContainer = styled.div`
  width: 45%;
  display: flex;
  justify-content: flex-end;
`;
const EnemyGroupName = styled(Window)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex: 0 0 70%;
`;
const EnemyMessage = styled(Window)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex: 0 0 30%;
`;

interface EnemyGroupProps {
  type?: EnemyTypesEnum;
  message: string | number;
}

const EnemyGroup = (props: EnemyGroupProps) => {
  const { type, message } = props;

  return (
    <EnemyGroupContainer>
      <EnemyGroupName>{type}</EnemyGroupName>
      <EnemyMessage>{message}</EnemyMessage>
    </EnemyGroupContainer>
  );
};

export default EnemyGroup;
