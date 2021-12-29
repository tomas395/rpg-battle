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
  ENTITY,
  GROUP,
  PLAYER_GROUP,
  ALL,
} from '../../constants';
import Window from '../Window';
import Sprite from '../Sprite';

const { queueAction } = actionCreators;

const ActiveHeroWindow = styled(Window)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
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
  width: 100%;
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
const TargetMenu = styled((props) => <Window {...props} />)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 58%;
  transform: translateY(-100%);
  width: 34%;
  height: ${({ height }: any) => `${height}`};
  padding-top: 1em;
`;
const Menu = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
const MenuItem = styled((props) => <li {...props} />)`
  margin: 0 0 0.75em;

  & button {
    text-align: left;
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
        `${active ? -14 * pixelMultiplier : 0}px`};
  }
`;

interface HeroMenuProps {
  activeHero: EntityType;
  handleClose: () => void;
}

const HeroMenu: React.FC<HeroMenuProps> = ({ activeHero, handleClose }) => {
  const [state, dispatch] = useContext(AppStateContext);
  const {
    groups: {
      [PLAYER_GROUP]: playerGroup,
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

  const {
    name,
    index: activeHeroIndex,
    equipment: { leftHand, rightHand },
    inventory,
    techniques,
  } = activeHero;
  const attackTargetType =
    leftHand && 'twoHanded' in leftHand && leftHand.twoHanded
      ? leftHand.targetType
      : leftHand && 'targetType' in leftHand
      ? leftHand.targetType
      : rightHand && 'targetType' in rightHand
      ? rightHand.targetType
      : undefined;
  const activeTech =
    techIndex !== undefined ? techniques[techIndex] : undefined;
  const activeItem = itemIndex !== undefined ? inventory[itemIndex] : undefined;

  const targetType =
    actionType === ATTACK
      ? attackTargetType
      : actionType === TECH
      ? activeTech?.targetType
      : actionType === ITEM
      ? activeItem?.itemTargetType
      : undefined;

  const targetAllies =
    actionType === TECH
      ? activeTech?.targetAllies
      : actionType === ITEM
      ? activeItem?.itemTargetAllies
      : undefined;

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

  useEffect(() => {
    if (!actionType || !targetType) return;

    // TODO: account for single hero
    if (
      targetType === ALL ||
      (actionType === ATTACK && !rightEnemyGroup?.entities?.length) ||
      ((actionType === TECH || actionType === ITEM) &&
        ((targetAllies && targetType === GROUP) ||
          (!targetAllies && !rightEnemyGroup?.entities?.length)))
    ) {
      const target = {
        group: targetAllies
          ? PLAYER_GROUP
          : targetType === ALL && rightEnemyGroup?.entities?.length
          ? [LEFT_ENEMY_GROUP, RIGHT_ENEMY_GROUP]
          : LEFT_ENEMY_GROUP,
        index: targetType === ENTITY ? 0 : undefined,
      };

      dispatch(
        queueAction({
          heroIndex: activeHeroIndex,
          target: target,
          type: actionType,
          techIndex,
          itemIndex,
        })
      );
      handleClose();
    }
  }, [
    activeHeroIndex,
    actionType,
    targetType,
    targetAllies,
    rightEnemyGroup,
    handleClose,
    dispatch,
    itemIndex,
    techIndex,
    inventory,
    techniques,
  ]);

  return (
    <>
      <ActiveHeroWindow>{name}</ActiveHeroWindow>

      <ActionMenu>
        {/* TODO: test this conditional (no equipped weapon) */}
        {attackTargetType && (
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
        )}
        <Button
          onClick={() => {
            if (techniques.length) {
              setActionType(TECH);
            } else {
              // TODO: display message
            }
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
            if (inventory.length) {
              setActionType(ITEM);
            } else {
              // TODO: display message
            }
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

      {actionType &&
      (targetType === ENTITY || targetType === GROUP) &&
      !targetAllies &&
      rightEnemyGroup?.entities?.length ? (
        <TargetMenu height="76%">
          <Menu>
            {/* TODO: only display groups with living entities */}
            <MenuItem pixelMultiplier={pixelMultiplier}>
              <Button
                onClick={() => {
                  dispatch(
                    queueAction({
                      heroIndex: activeHeroIndex,
                      target: { group: LEFT_ENEMY_GROUP, index: 0 },
                      type: actionType,
                      techIndex,
                      itemIndex,
                    })
                  );
                  handleClose();
                }}
              >
                {leftEnemyGroup?.type}
              </Button>
            </MenuItem>

            {/* TODO: only display groups with living entities */}
            {Boolean(rightEnemyGroup.entities) && (
              <MenuItem pixelMultiplier={pixelMultiplier}>
                <Button
                  onClick={() => {
                    dispatch(
                      queueAction({
                        heroIndex: activeHeroIndex,
                        target: { group: RIGHT_ENEMY_GROUP, index: 0 },
                        type: actionType,
                        techIndex,
                        itemIndex,
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
      ) : actionType && targetType === ENTITY && targetAllies ? (
        <TargetMenu height="133%">
          <Menu>
            {playerGroup.entities.map((hero, index) => (
              <MenuItem pixelMultiplier={pixelMultiplier}>
                <Button
                  onClick={() => {
                    dispatch(
                      queueAction({
                        heroIndex: activeHeroIndex,
                        target: { group: PLAYER_GROUP, index },
                        type: actionType,
                        techIndex,
                        itemIndex,
                      })
                    );
                    handleClose();
                  }}
                >
                  {hero.name}
                </Button>
              </MenuItem>
            ))}
          </Menu>
        </TargetMenu>
      ) : null}
    </>
  );
};

export default HeroMenu;
