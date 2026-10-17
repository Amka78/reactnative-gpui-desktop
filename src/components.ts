import React from 'react';

export interface ViewProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onPress?: () => void;
}

export interface TextProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function View(props: ViewProps) {
  return React.createElement('view', props, props.children);
}

export function Text(props: TextProps) {
  return React.createElement('text', props, props.children);
}
