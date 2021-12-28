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
const Button = styled((props) => <button {...props} />)`
  padding: 0;
  border: none;
  outline: none;
  background: none;
  color: white;
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
  transform: translateY(-55%);
  width: 34%;
  height: 160%;
  padding-top: 1em;
`;
const TargetMenu = styled(Window)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 58%;
  transform: translateY(-100%);
  width: 34%;
  height: 73%;
  padding-top: 1em;
`;
const Menu = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: left;
`;
const MenuItem = styled((props) => <li {...props} />)`
  margin: 0 0 0.75em;

  &:before {
    content: '';
    display: inline-block;
    width: ${({ pixelMultiplier }: any) => `${14 * pixelMultiplier}px`};
    height: ${({ pixelMultiplier }: any) => `${8 * pixelMultiplier}px`};
    margin-right: 0.25em;
    margin-bottom: 0.1em;
    background: orange;
    background: url('./assets/button-light.png');
    background-size: ${({ pixelMultiplier }: any) =>
      `auto ${8 * pixelMultiplier}px`};
    background-repeat: no-repeat;
    background-position: ${({ active, pixelMultiplier }: any) =>
      `${active ? -14 * pixelMultiplier : 0}px`}
`;

interface HeroMenuProps {
  activeHero: EntityType;
  handleClose: () => void;
}

const HeroMenu: React.FC<HeroMenuProps> = ({ activeHero, handleClose }) => {
  const [state, dispatch] = useContext(AppStateContext);
  const {
    groups: {
      [LEFT_ENEMY_GROUP]: leftEnemyGroup,
      [RIGHT_ENEMY_GROUP]: rightEnemyGroup,
    },
    pixelMultiplier,
  } = state;
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

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (techIndex !== undefined) {
          setTechIndex(undefined);
        } else if (itemIndex !== undefined) {
          setItemIndex(undefined);
        } else if (actionType !== undefined) {
          setActionType(undefined);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [techIndex, itemIndex, actionType, handleClose]);

  return (
    <>
      <ActiveHeroWindow>{name}</ActiveHeroWindow>

      <ActionMenu>
        <Button
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
        </Button>
        <Button
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
        </Button>
        <Button
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
        </Button>
        <Button
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
        </Button>
      </ActionMenu>

      {actionType === TECH && (
        <TechMenu>
          <Menu>
            {techniques.map((technique, index) => (
              <MenuItem
                key={index}
                pixelMultiplier={pixelMultiplier}
                active={techIndex === index}
              >
                <Button
                  onClick={() => {
                    setTechIndex(index);
                  }}
                >
                  {technique.name}
                </Button>
              </MenuItem>
            ))}
          </Menu>
        </TechMenu>
      )}

      {actionType === ITEM && (
        <ItemMenu>
          <Menu>
            {inventory.map((item, index) => (
              <MenuItem
                key={index}
                pixelMultiplier={pixelMultiplier}
                active={itemIndex === index}
              >
                <Button
                  key={index}
                  onClick={() => {
                    setItemIndex(index);
                  }}
                >
                  {item.name}
                </Button>
              </MenuItem>
            ))}
          </Menu>
        </ItemMenu>
      )}

      {(actionType === ATTACK ||
        (actionType === TECH && techIndex !== undefined) ||
        (actionType === ITEM && itemIndex !== undefined)) && (
        <TargetMenu style={{}}>
          {/* TODO: need to use currently selected item/tech, as well as number of enemy groups, etc., to determine target type */}
          <Menu>
            <MenuItem pixelMultiplier={pixelMultiplier} active={true}>
              <Button
                onClick={() => {
                  dispatch(
                    queueAction({
                      heroIndex: activeHeroIndex,
                      target: { group: LEFT_ENEMY_GROUP, index: 0 },
                      type: actionType,
                      item:
                        itemIndex !== undefined
                          ? inventory[itemIndex]
                          : undefined,
                      tech:
                        techIndex !== undefined
                          ? techniques[techIndex]
                          : undefined,
                    })
                  );
                  handleClose();
                }}
              >
                {leftEnemyGroup?.type}
              </Button>
            </MenuItem>

            {Boolean(rightEnemyGroup.entities) && (
              <MenuItem pixelMultiplier={pixelMultiplier} active={true}>
                <Button
                  onClick={() => {
                    dispatch(
                      queueAction({
                        heroIndex: activeHeroIndex,
                        target: { group: RIGHT_ENEMY_GROUP, index: 0 },
                        type: actionType,
                        item:
                          itemIndex !== undefined
                            ? inventory[itemIndex]
                            : undefined,
                        tech:
                          techIndex !== undefined
                            ? techniques[techIndex]
                            : undefined,
                      })
                    );
                    handleClose();
                  }}
                >
                  {rightEnemyGroup?.type}
                </Button>
              </MenuItem>
            )}
          </Menu>
        </TargetMenu>
      )}
    </>
  );
};

export default HeroMenu;
