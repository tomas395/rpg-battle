import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AppStateContext } from '../../state';
import { actionCreators } from '../../actions';
import { EntityType } from '../../types';
import {
  EntityActionTypesEnum,
  ATTACK,
  TECH,
  ITEM,
  DEFEND,
  LEFT_ENEMY_GROUP,
  RIGHT_ENEMY_GROUP,
} from '../../constants';
import Window from '../Window';
import Sprite from '../Sprite';

const { queueAction } = actionCreators;

const ActiveHeroWindow = styled(Window)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 16%;
  height: 50%;
`;

const ActionMenu = styled(Window)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: absolute;
  top: 0;
  right: 58%;
  transform: translateY(-100%);
  width: 34%;
  height: 73%;
  padding-top: 1em;
`;

const ActionButton = styled((props) => <button {...props} />)`
  padding: 0;
  border: none;
  outline: none;
  background: none;
`;

const TechMenu = styled(Window)`
  position: absolute;
  top: 0;
  right: 58%;
  transform: translateY(-55%);
  width: 25%;
  height: 160%;
  padding-top: 1em;
`;

const ItemMenu = styled(Window)`
  position: absolute;
  top: 0;
  right: 58%;
  transform: translateY(-100%);
  width: 34%;
  height: 73%;
  padding-top: 1em;
`;

const TargetMenu = styled(Window)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 16%;
  height: 50%;
`;

interface HeroMenuProps {
  activeHero: EntityType;
  handleClose: () => void;
}

const HeroMenu: React.FC<HeroMenuProps> = ({ activeHero, handleClose }) => {
  const [, dispatch] = useContext(AppStateContext);
  const [actionType, setActionType] = useState<
    EntityActionTypesEnum | undefined
  >();
  const [itemIndex, setItemIndex] = useState<number | undefined>();
  const [techIndex, setTechIndex] = useState<number | undefined>();

  const { name, index: activeHeroIndex, inventory, techniques } = activeHero;

  useEffect(() => {
    setActionType(undefined);
    setTechIndex(undefined);
    setItemIndex(undefined);
  }, [activeHero]);

  return (
    <>
      <ActiveHeroWindow>{name}</ActiveHeroWindow>

      <ActionMenu>
        <ActionButton
          onClick={() => {
            setActionType(ATTACK);
          }}
        >
          <Sprite
            src="./assets/attack-icon.png"
            width={16}
            height={16}
            alt="attack icon"
          />
        </ActionButton>
        <ActionButton
          onClick={() => {
            setActionType(TECH);
          }}
        >
          <Sprite
            src="./assets/tech-icon.png"
            width={16}
            height={16}
            alt="technique icon"
          />
        </ActionButton>
        <ActionButton
          onClick={() => {
            setActionType(ITEM);
          }}
        >
          <Sprite
            src="./assets/item-icon.png"
            width={16}
            height={16}
            alt="item icon"
          />
        </ActionButton>
        <ActionButton
          onClick={() => {
            dispatch(
              queueAction({
                heroIndex: activeHeroIndex,
                type: DEFEND,
              })
            );
            handleClose();
          }}
        >
          <Sprite
            src="./assets/defend-icon.png"
            width={16}
            height={16}
            alt="defend icon"
          />
        </ActionButton>
      </ActionMenu>

      {actionType === TECH && (
        <TechMenu>
          {techniques.map((technique, index) => (
            <button
              key={index}
              onClick={() => {
                setTechIndex(index);
              }}
            >
              {technique.name}
            </button>
          ))}
        </TechMenu>
      )}

      {actionType === ITEM && (
        <ItemMenu>
          {inventory.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setItemIndex(index);
              }}
            >
              {item.name}
            </button>
          ))}
        </ItemMenu>
      )}

      {(actionType === ATTACK ||
        (actionType === TECH && techIndex !== undefined) ||
        (actionType === ITEM && itemIndex !== undefined)) && (
        <TargetMenu style={{}}>
          {/* TODO: need to use currently selected item/tech, as well as number of enemy groups, etc., to determine target type */}
          <button
            onClick={() => {
              dispatch(
                queueAction({
                  heroIndex: activeHeroIndex,
                  target: { group: LEFT_ENEMY_GROUP, index: 0 },
                  type: actionType,
                  item:
                    itemIndex !== undefined ? inventory[itemIndex] : undefined,
                  tech:
                    techIndex !== undefined ? techniques[techIndex] : undefined,
                })
              );
              handleClose();
            }}
          >
            Left Enemy Group
          </button>
          <button
            onClick={() => {
              dispatch(
                queueAction({
                  heroIndex: activeHeroIndex,
                  target: { group: RIGHT_ENEMY_GROUP, index: 0 },
                  type: actionType,
                  item:
                    itemIndex !== undefined ? inventory[itemIndex] : undefined,
                  tech:
                    techIndex !== undefined ? techniques[techIndex] : undefined,
                })
              );
              handleClose();
            }}
          >
            Right Enemy Group
          </button>
        </TargetMenu>
      )}
    </>
  );
};

export default HeroMenu;
