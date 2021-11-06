import { useContext } from 'react';
import styled from 'styled-components';

import EnemyGroup from './EnemyGroup';
import { AppStateContext } from '../state';
import { LEFT_ENEMY_GROUP, RIGHT_ENEMY_GROUP } from '../constants';

const EnemySection = styled.section`
  flex: 0 1 200px;
  height: 100%;
  display: flex;
  top: 0;
  justify-content: space-between;
`;

const EnemyGroupSection = () => {
  const [state] = useContext(AppStateContext);
  const {
    groups: {
      [LEFT_ENEMY_GROUP]: leftEnemyGroup,
      [RIGHT_ENEMY_GROUP]: rightEnemyGroup,
    },
  } = state;

  return (
    <EnemySection>
      <EnemyGroup type={leftEnemyGroup.type} message={leftEnemyGroup.message} />
      <EnemyGroup
        type={rightEnemyGroup.type}
        message={rightEnemyGroup.message}
      />
    </EnemySection>
  );
};

export default EnemyGroupSection;
