import { renderTree, createWindow } from '../dist/native.js';

const testTree = {
  node_type: 'view',
  props: { style: { padding: 20 } },
  children: [
    {
      node_type: 'text',
      props: { content: 'Hello from Rust!' },
      children: []
    }
  ]
};

console.log('Testing Rust binding...');
const result = renderTree(JSON.stringify(testTree));
console.log('Rendered:', result);

createWindow('Test Window', 800, 600);
