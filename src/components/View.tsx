import React from 'react';
import type { StyleDesc } from '@gpuix/react';

export interface ViewProps {
  children?: React.ReactNode;
  style?: StyleDesc;
  onClick?: () => void;
  testID?: string;
}

export const View: React.FC<ViewProps> = ({ children, style, onClick, testID }) => {
  return (
    <div style={style} onClick={onClick} testId={testID}>
      {children}
    </div>
  );
};
