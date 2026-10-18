import React from 'react';
import type { StyleDesc } from '@gpuix/react';

export interface TextProps {
  children?: React.ReactNode;
  style?: StyleDesc;
  onClick?: () => void;
  testID?: string;
}

export const Text: React.FC<TextProps> = ({ children, style, onClick, testID }) => {
  return (
    <text style={style} onClick={onClick} testId={testID}>
      {children}
    </text>
  );
};
