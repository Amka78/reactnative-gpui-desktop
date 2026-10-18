import type { StyleDesc } from '@gpuix/react';

export const StyleSheet = {
  create<T extends { [key: string]: StyleDesc }>(styles: T): T {
    return styles;
  },
};
