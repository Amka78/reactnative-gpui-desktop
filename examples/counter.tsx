import React, { useState } from 'react';
import { View, Text, render } from '../../dist/index.js';

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

function serializeNode(node: any): any {
  const { children: childContent, ...safeProps } = node.props || {};
  const serialized: any = { type: node.type, props: safeProps };
  if (typeof childContent === 'string' || typeof childContent === 'number') {
    serialized.props.content = String(childContent);
  }
  if (node.children.length > 0) {
    serialized.children = node.children.map(serializeNode);
  }
  return serialized;
}

console.log('Rendered tree:', JSON.stringify(serializeNode(container), null, 2));
