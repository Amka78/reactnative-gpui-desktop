import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nativeModule = require(join(__dirname, 'react_gpui_desktop.node'));

export function renderTree(treeJson: string): string {
  return nativeModule.renderTree(treeJson);
}

export function createWindow(title: string, width: number, height: number): void {
  nativeModule.createWindow(title, width, height);
}

export function open_window_with_events(
  title: string,
  width: number,
  height: number,
  treeJson: string,
  onEvent: (eventId: string) => void
): void {
  nativeModule.openWindowWithEvents(title, width, height, treeJson, onEvent);
}
