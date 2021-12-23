import React, { useContext } from 'react';

import { AppStateContext } from '../state';

interface SpriteProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
}

const Sprite: React.FC<SpriteProps> = ({ src, alt, width, height }) => {
  const [{ pixelMultiplier }] = useContext(AppStateContext);

  return (
    <img
      src={src}
      alt={alt || ''}
      style={{
        width: width * pixelMultiplier,
        height: height * pixelMultiplier,
      }}
    />
  );
};

export default Sprite;
