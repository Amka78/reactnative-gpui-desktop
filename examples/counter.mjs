import React, { useState } from 'react';
import { View, Text, render } from '../dist/index.js';
import { renderTree, createWindow } from '../dist/native.js';

function Counter() {
  const [count, setCount] = useState(0);

  return React.createElement(View, { style: { padding: 20 } },
    React.createElement(Text, { style: { fontSize: 24 } }, `Count: ${count}`),
    React.createElement(View, {
      onPress: () => setCount(count + 1),
      style: { padding: 10, backgroundColor: '#007bff' }
    },
      React.createElement(Text, { style: { color: 'white' } }, 'Increment')
    )
  );
}

// GPUIコンテナ（モック）
const container = {
  type: 'root',
  props: {},
  children: [],
  parent: null,
};

render(React.createElement(Counter), container);

function serializeNode(node) {
  const { children: childContent, ...safeProps } = node.props || {};
  const serialized = { node_type: node.type, props: safeProps, children: [] };
  if (typeof childContent === 'string' || typeof childContent === 'number') {
    serialized.props.content = String(childContent);
  }
  serialized.children = node.children.map(serializeNode);
  return serialized;
}

const serialized = serializeNode(container);
console.log('JS tree:', JSON.stringify(serialized, null, 2));

console.log('\n--- Rust binding test ---');
const rustResult = renderTree(JSON.stringify(serialized));
console.log('Rust result:', rustResult);
