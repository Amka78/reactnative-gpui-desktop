import { open_window_with_events } from '../dist/native.js';

const testTree = {
  node_type: 'view',
  props: { style: { padding: 20, backgroundColor: '#333333' } },
  children: [
    {
      node_type: 'text',
      props: { style: { fontSize: 24, color: '#ffffff' }, content: 'Hello GPUI!' },
      children: []
    },
    {
      node_type: 'view',
      props: {
        style: { padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
        onPress: 'btn1'
      },
      children: [
        {
          node_type: 'text',
          props: { style: { color: '#ffffff' }, content: 'Click Me' },
          children: []
        }
      ]
    }
  ]
};

console.log('Opening GPUI window...');
try {
  open_window_with_events('React GPUI Desktop', 400, 300, JSON.stringify(testTree), (eventId) => {
    console.log('Event received:', eventId);
  });
} catch (e) {
  console.error('Error:', e.message);
}
