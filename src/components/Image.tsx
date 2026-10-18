import React from 'react';
import type { StyleDesc } from '@gpuix/react';

export interface ImageProps {
  source: { uri: string } | number;
  style?: StyleDesc;
  resizeMode?: 'cover' | 'contain' | 'fill' | 'scaleDown' | 'none';
  testID?: string;
}

export const Image: React.FC<ImageProps> = ({ source, style, resizeMode = 'cover', testID }) => {
  const src = typeof source === 'object' ? source.uri : '';
  
  return (
    <img
      src={src}
      objectFit={resizeMode}
      style={style}
      testId={testID}
    />
  );
};
