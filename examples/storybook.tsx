import { useState } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Image, StyleSheet, render } from '../src/index';
import { CATALOG } from './catalog';
import type { CatalogEntry, PortStatus } from './catalog';

type Status = PortStatus;

const IMAGE_BLUE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGOwqv1AEmIY1TCqYfhqAAAq+acQ9vupvwAAAABJRU5ErkJggg==';
const IMAGE_RED =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGN4kJZGEmIY1TCqYfhqAAADgKwQuTPhtQAAAABJRU5ErkJggg==';
const IMAGE_GREEN =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGPIWuFPEmIY1TCqYfhqAADFtGEQh8rO5gAAAABJRU5ErkJggg==';

const STATUS_LABEL: Record<Status, string> = {
  done: '対応済み',
  partial: '一部対応',
  todo: '未対応',
};

const STATUS_COLOR: Record<Status, string> = {
  done: '#6aa84f',
  partial: '#e6b800',
  todo: '#8a8a8a',
};

// ── デモ（実装済み props を state で保持し、リアルタイムに反映） ──

const PALETTE = ['#3a7df0', '#e06666', '#6aa84f', '#2a2a2a', '#e6b800'];

function ViewDemo() {
  const [backgroundColor, setBackgroundColor] = useState('#3a7df0');
  const [padding, setPadding] = useState(24);
  const [borderRadius, setBorderRadius] = useState(8);
  const [flexDirection, setFlexDirection] = useState('row');

  return (
    <View style={demoStyles.stack}>
      <View style={ctrl.panel}>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>backgroundColor</Text>
          <View style={ctrl.chip} onClick={() => {
            const idx = PALETTE.indexOf(backgroundColor);
            setBackgroundColor(PALETTE[(idx + 1) % PALETTE.length]);
          }}>
            <Text style={ctrl.chipText}>{backgroundColor}</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>padding</Text>
          <View style={ctrl.btn} onClick={() => setPadding(Math.max(0, padding - 4))}>
            <Text style={ctrl.btnText}>−</Text>
          </View>
          <Text style={ctrl.value}>{padding}</Text>
          <View style={ctrl.btn} onClick={() => setPadding(Math.min(80, padding + 4))}>
            <Text style={ctrl.btnText}>+</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>borderRadius</Text>
          <View style={ctrl.btn} onClick={() => setBorderRadius(Math.max(0, borderRadius - 2))}>
            <Text style={ctrl.btnText}>−</Text>
          </View>
          <Text style={ctrl.value}>{borderRadius}</Text>
          <View style={ctrl.btn} onClick={() => setBorderRadius(Math.min(40, borderRadius + 2))}>
            <Text style={ctrl.btnText}>+</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>flexDirection</Text>
          <View style={ctrl.chip} onClick={() => setFlexDirection(flexDirection === 'row' ? 'column' : 'row')}>
            <Text style={ctrl.chipText}>{flexDirection}</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: 220,
          height: 120,
          backgroundColor,
          padding,
          borderRadius,
          flexDirection,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Text style={demoStyles.previewText}>A</Text>
        <Text style={demoStyles.previewText}>B</Text>
      </View>
    </View>
  );
}

function TextDemo() {
  const [children, setChildren] = useState('Hello, gpuix');
  const [color, setColor] = useState('#e2e2e2');
  const [fontSize, setFontSize] = useState(24);

  const textOptions = ['Hello, gpuix', 'OpenBookShelf', 'Counter', 'こんにちは'];
  const colorOptions = ['#e2e2e2', '#e06666', '#6aa84f', '#3a7df0'];

  return (
    <View style={demoStyles.stack}>
      <View style={ctrl.panel}>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>children</Text>
          <View style={ctrl.chip} onClick={() => {
            const idx = textOptions.indexOf(children);
            setChildren(textOptions[(idx + 1) % textOptions.length]);
          }}>
            <Text style={ctrl.chipText}>{children}</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>color</Text>
          <View style={ctrl.chip} onClick={() => {
            const idx = colorOptions.indexOf(color);
            setColor(colorOptions[(idx + 1) % colorOptions.length]);
          }}>
            <Text style={ctrl.chipText}>{color}</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>fontSize</Text>
          <View style={ctrl.btn} onClick={() => setFontSize(Math.max(8, fontSize - 2))}>
            <Text style={ctrl.btnText}>−</Text>
          </View>
          <Text style={ctrl.value}>{fontSize}</Text>
          <View style={ctrl.btn} onClick={() => setFontSize(Math.min(64, fontSize + 2))}>
            <Text style={ctrl.btnText}>+</Text>
          </View>
        </View>
      </View>

      <Text style={{ color, fontSize }}>{children}</Text>
    </View>
  );
}

function ImageDemo() {
  const [source, setSource] = useState(IMAGE_BLUE);
  const [resizeMode, setResizeMode] = useState('fill');
  const [size, setSize] = useState(96);

  const sourceOptions = [IMAGE_BLUE, IMAGE_RED, IMAGE_GREEN];
  const resizeModeOptions = ['cover', 'contain', 'fill', 'scaleDown', 'none'];

  const sourceLabel = (value: string) =>
    value === IMAGE_BLUE ? 'blue' : value === IMAGE_RED ? 'red' : 'green';

  return (
    <View style={demoStyles.stack}>
      <View style={ctrl.panel}>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>source</Text>
          <View style={ctrl.chip} onClick={() => {
            const idx = sourceOptions.indexOf(source);
            setSource(sourceOptions[(idx + 1) % sourceOptions.length]);
          }}>
            <Text style={ctrl.chipText}>{sourceLabel(source)}</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>resizeMode</Text>
          <View style={ctrl.chip} onClick={() => {
            const idx = resizeModeOptions.indexOf(resizeMode);
            setResizeMode(resizeModeOptions[(idx + 1) % resizeModeOptions.length]);
          }}>
            <Text style={ctrl.chipText}>{resizeMode}</Text>
          </View>
        </View>
        <View style={ctrl.row}>
          <Text style={ctrl.label}>size</Text>
          <View style={ctrl.btn} onClick={() => setSize(Math.max(32, size - 8))}>
            <Text style={ctrl.btnText}>−</Text>
          </View>
          <Text style={ctrl.value}>{size}</Text>
          <View style={ctrl.btn} onClick={() => setSize(Math.min(240, size + 8))}>
            <Text style={ctrl.btnText}>+</Text>
          </View>
        </View>
      </View>

      <Image source={{ uri: source }} resizeMode={resizeMode} style={{ width: size, height: size, borderRadius: 8 }} />
    </View>
  );
}

function StyleSheetDemo() {
  return (
    <View style={demoStyles.stack}>
      <View style={ctrl.panel}>
        <Text style={demoStyles.code}>StyleSheet.create は現状 identity</Text>
        <Text style={demoStyles.code}>RN の paddingHorizontal / shadow 等は未対応</Text>
      </View>
    </View>
  );
}

const DEMOS: Record<string, () => ReactNode> = {
  View: ViewDemo,
  Text: TextDemo,
  Image: ImageDemo,
  StyleSheet: StyleSheetDemo,
};

function findEntry(name: string): { groupId: string; entry: CatalogEntry } | null {
  for (const group of CATALOG) {
    const entry = group.entries.find((item) => item.name === name);
    if (entry) return { groupId: group.id, entry };
  }
  return null;
}

function EntryRow(props: { entry: CatalogEntry; active: boolean; onSelect: () => void }) {
  const { entry, active, onSelect } = props;
  return (
    <View style={active ? styles.navItemActive : styles.navItem} onClick={onSelect} testID={`nav-${entry.name}`}>
      <Text style={{ fontSize: 13, marginRight: 8, color: STATUS_COLOR[entry.status] }}>
        {entry.status === 'todo' ? '✗' : entry.status === 'partial' ? '△' : '✓'}
      </Text>
      <Text style={styles.navName}>{entry.name}</Text>
    </View>
  );
}

export function Storybook() {
  const [selected, setSelected] = useState('View');
  const [selectedGroup, setSelectedGroup] = useState<'components' | 'apis' | 'hooks' | 'types'>('components');
  const found = findEntry(selected);
  const entry = found?.entry;
  const Demo = entry ? DEMOS[entry.name] : undefined;

  const currentGroup = CATALOG.find((g) => g.id === selectedGroup);

  return (
    <View style={styles.shell}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>react-native-gpuix</Text>
        <Text style={styles.sidebarSubtitle}>React Native API Catalog</Text>
        
        <View style={styles.groupTabs}>
          {CATALOG.map((group) => (
            <View
              key={group.id}
              style={selectedGroup === group.id ? styles.groupTabActive : styles.groupTab}
              onClick={() => setSelectedGroup(group.id)}
            >
              <Text style={styles.groupTabText}>{group.title}</Text>
            </View>
          ))}
        </View>

        {currentGroup && currentGroup.entries.map((item) => (
          <EntryRow key={item.name} entry={item} active={item.name === selected} onSelect={() => setSelected(item.name)} />
        ))}
      </View>

      <View style={styles.content}>
        {entry ? (
          <>
            <Text style={styles.contentTitle}>{entry.name}</Text>
            <View style={styles.statusRow}>
              <Text style={{ fontSize: 14, marginRight: 12, color: STATUS_COLOR[entry.status] }}>
                {STATUS_LABEL[entry.status]}
              </Text>
              {entry.props ? <Text style={styles.priority}>{entry.props.length} props</Text> : null}
            </View>
            <Text style={styles.note}>{entry.note}</Text>

            {entry.props ? (
              <View style={styles.propsPanel}>
                <Text style={styles.panelTitle}>props / members</Text>
                <View style={styles.propsGrid}>
                  {entry.props.map((prop) => (
                    <View key={prop.name} style={styles.propRow}>
                      <Text style={{ fontSize: 12, marginRight: 6, color: STATUS_COLOR[prop.status] }}>
                        {prop.status === 'todo' ? '✗' : prop.status === 'partial' ? '△' : '✓'}
                      </Text>
                      <Text style={styles.propName}>{prop.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.demoArea}>
              {Demo ? <Demo /> : <Text style={styles.note}>未対応 — 移植後にデモを追加します。</Text>}
            </View>
          </>
        ) : (
          <Text style={styles.note}>項目が見つかりません。</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  sidebar: {
    width: 240,
    padding: 12,
    borderRightWidth: 1,
    borderColor: '#2a2a2a',
    overflowY: 'auto',
  },
  sidebarTitle: {
    color: '#e2e2e2',
    fontSize: 16,
  },
  sidebarSubtitle: {
    color: '#8a8a8a',
    fontSize: 11,
    marginBottom: 8,
  },
  groupTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  groupTab: {
    padding: 6,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#1a1a1a',
  },
  groupTabActive: {
    padding: 6,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#2a2a2a',
  },
  groupTabText: {
    color: '#e2e2e2',
    fontSize: 11,
  },
  groupTitle: {
    color: '#8a8a8a',
    fontSize: 10,
    marginTop: 8,
    marginBottom: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
    marginBottom: 1,
  },
  navItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
    marginBottom: 1,
    backgroundColor: '#232323',
  },
  navName: {
    color: '#e2e2e2',
    fontSize: 12,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    overflowY: 'auto',
  },
  contentTitle: {
    color: '#e2e2e2',
    fontSize: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priority: {
    color: '#8a8a8a',
    fontSize: 11,
  },
  note: {
    color: '#9a9a9a',
    fontSize: 12,
    marginTop: 4,
  },
  propsPanel: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    maxHeight: 120,
    overflowY: 'auto',
  },
  panelTitle: {
    color: '#8a8a8a',
    fontSize: 10,
    marginBottom: 4,
  },
  propsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginRight: 8,
    marginBottom: 2,
  },
  propName: {
    color: '#c0c0c0',
    fontSize: 11,
  },
  demoArea: {
    marginTop: 8,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
});

const ctrl = StyleSheet.create({
  panel: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0f0f0f',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#8a8a8a',
    fontSize: 13,
    width: 140,
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#e2e2e2',
    fontSize: 16,
  },
  value: {
    color: '#e2e2e2',
    fontSize: 13,
    width: 48,
    textAlign: 'center',
  },
  chip: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#232323',
  },
  chipText: {
    color: '#e2e2e2',
    fontSize: 13,
  },
});

const demoStyles = StyleSheet.create({
  stack: {
    alignItems: 'flex-start',
  },
  previewText: {
    color: '#ffffff',
    fontSize: 18,
  },
  code: {
    color: '#c0c0c0',
    fontSize: 13,
  },
});

if (import.meta.main) {
  render(<Storybook />, { title: 'react-native-gpuix — React Native API Catalog', width: 900, height: 640 });
}
