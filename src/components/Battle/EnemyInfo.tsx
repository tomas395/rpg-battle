import { useContext } from 'react';
import styled from 'styled-components';

import EnemyGroup from './EnemyGroup';
import { AppStateContext } from '../../state';
import {
  DARKFORCE,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
} from '../../constants';

const EnemyInfoContainer = styled.section`
  flex: 0 1 20%;
  display: flex;
  top: 0;
  justify-content: space-between;
`;

const EnemyInfo = () => {
  const [state] = useContext(AppStateContext);
  const {
    groups: {
      [LEFT_ENEMY_GROUP]: leftEnemyGroup,
      [RIGHT_ENEMY_GROUP]: rightEnemyGroup,
    },
  } = state;

  return (
    <EnemyInfoContainer>
      {leftEnemyGroup.type !== DARKFORCE && (
        <>
          <EnemyGroup
            type={leftEnemyGroup.type}
            message={leftEnemyGroup.message}
          />
          <EnemyGroup
            type={rightEnemyGroup.type}
            message={rightEnemyGroup.message}
          />
        </>
      )}
    </EnemyInfoContainer>
  );
};

export default EnemyInfo;
