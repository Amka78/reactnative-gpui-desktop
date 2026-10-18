# react-native-gpuix

React Nativeの記法を、アプリ実行時にgpuixの描画形式へコンパイルして動かすDesktopアプリ用ランタイム。

## 概要

React Nativeに似たコンポーネント（`View`、`Text`、`Image`、`StyleSheet`）で書いたReactツリーを、**アプリの実行時**にgpuixのホスト要素（`div`、`text`、`img`）と`StyleDesc`へ変換し、GPUIでGPU描画する。

ここでいう「コンパイル」は、ビルド時にソースコードを書き換えるBabelプラグインやコード生成ではない。JSXはそのままBun/Nodeで実行され、Reactのレンダリング時に変換層がReact Native記法の要素・props・styleをgpuix形式へ変換する。

## 設計方針: 実行時コンパイル

### なぜ実行時か

- React Native記法のアプリコードをそのまま実行できる
- ビルド工程を増やさず、`bun --hot` のホットリロードと両立できる
- propsやstyleが動的に変わっても、レンダリングのたびに正しく変換できる
- gpuix側のAPI変更を変換層に閉じ込められる

### パイプライン

```text
React Native記法のアプリ
  View / Text / Image / StyleSheet
              │
              │ Reactレンダリング
              ▼
実行時コンパイラ（このパッケージ）
  コンポーネント解決 + props変換 + style変換
              │
              │ gpuixホスト要素 + gpuix Props / StyleDesc
              ▼
@gpuix/react（reconciler）
              │
              │ napi-rs
              ▼
@gpuix/native → GPUI（Rust / GPU描画）
```

### 変換の責務

| 変換 | 入力 | 出力 | 現状 |
| --- | --- | --- | --- |
| コンポーネント | `View` | `div` | 対応 |
| コンポーネント | `Text` | `text` | 対応（`color`必須） |
| コンポーネント | `Image` | `img` | 対応 |
| props | `testID` | `testId` | 対応 |
| props | `resizeMode` | `objectFit` | 対応 |
| props | `source={{ uri }}` | `src` | 対応（URIのみ） |
| イベント | `onClick` | `onClick` | 対応 |
| style | RN style object | `StyleDesc` | gpuix名でパススルー |
| イベント | `onPress` | `onClick` | 未対応（ロードマップ） |
| style | `paddingHorizontal`など | `StyleDesc` | 未対応（ロードマップ） |

変換は現在、`View` / `Text` / `Image` の各アダプタで行っている。変換ルールが増えた段階で `src/runtime/` に集約する方針。

## 設計上の判断

### React Nativeのソースを解析しない

本ライブラリはReact Nativeのソースコードを解析するトランスパイラではない。React Native互換のコンポーネントを提供し、Reactが生成した要素を実行時にgpuixへ変換する。したがって、`react-native`パッケージの全APIがそのまま動くわけではない。未対応のコンポーネントやpropsは、アダプタを追加して対応する。

### ビルド時ではなく実行時に変換する

変換は要素の種類・props・styleに対する純粋なマッピングであり、ソースコードの解析を必要としない。そのためビルド時のコード生成を挟まず、実行時のレンダリングで変換できる。ホットリロードや動的なprops変更とも相性がよい。

代わりに、レンダリングのたびに変換コストが発生する。現状のUIツリー規模では問題にならないが、変換ルールが増えたら `StyleSheet.create` での正規化やメモ化で抑える。

### StyleSheet.createの位置づけ

`StyleSheet.create` は現在、渡されたスタイルをそのまま返す。将来的にはここでReact Native固有のstyle（`paddingHorizontal`、`marginVertical`、`shadow*`、`elevation` など）をgpuixの`StyleDesc`へ正規化し、一度だけ変換した結果を再利用する入口にする。

## 実装状況（2026-10-18）

### 対応済み

- `View` / `Text` / `Image` / `StyleSheet` の実行時変換
- `testID` → `testId`
- `Image` の `resizeMode` → `objectFit`
- `onClick` イベント（カウンターで `Count: 0` → `Count: 1` を確認）
- TypeScriptビルド
- WSL（GLIBC 2.35）での起動回避策

### 未対応

- `onPress` → `onClick` の変換
- `accessibilityLabel` などのアクセシビリティpropsの変換
- React Native固有のstyleエイリアス（`paddingHorizontal`、`marginVertical`、`shadow*`、`elevation` など）
- `Pressable`、`ScrollView`、`TextInput`、`FlatList` などのコンポーネント
- `Image` のローカル画像（`require` / 数値source）
- React Nativeの`SyntheticEvent`互換

## 使い方

```bash
npm install
npm run build
npm run example
```

`npm run example` は `bun --hot` でカウンターを起動する。ホットリロードなしで一度だけ実行する場合は `npm run example:once` を使う。

### アプリの書き方

```tsx
import { useState } from 'react';
import { View, Text, StyleSheet, render } from 'react-native-gpuix';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <View
        style={styles.button}
        onClick={() => setCount((c) => c + 1)}
      >
        <Text style={styles.buttonText}>Count: {count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#1a1a1a',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#e2e2e2',
    fontSize: 32,
    marginBottom: 24,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#232323',
    cursor: 'pointer',
  },
  buttonText: {
    color: '#e2e2e2',
    fontSize: 18,
  },
});

render(<App />, { title: 'Counter Example', width: 400, height: 300 });
```

このリポジトリ内のサンプルは `../src/index` からimportしている。`examples/counter.tsx` を参照。

`onPress` は未対応のため、現在は `onClick` を使用する。`onPress` の変換はロードマップに含めている。

### 実行環境（GLIBC 2.38未満）

`@gpuix/native` のLinuxバイナリはGLIBC 2.38以上を要求する。WSL Ubuntu 22.04などのGLIBC 2.35環境では直接ロードできないため、`scripts/run-gpuix.sh` がUbuntu 24.04のglibc 2.39を `~/.cache/gpuix-glibc-2.39` に展開し、そのローダー経由でbunを起動する。システムのglibcは変更しない。初回のみ約3MBのダウンロードが発生する。

## プロジェクト構成

```text
src/
  components/
    View.tsx      # View → div
    Text.tsx      # Text → text
    Image.tsx     # Image → img
  StyleSheet.ts   # 現状は入力をそのまま返す
  index.ts        # 公開API
examples/
  counter.tsx     # カウンターサンプル
scripts/
  run-gpuix.sh    # GLIBC回避を含む起動ラッパー
```

## 制約

- React Nativeの完全互換ではない。未対応のコンポーネント・props・styleは変換されない。
- `<text>` には常に `color` を指定する。gpuixは親から`color`を継承しないため、未指定だと暗い背景上で文字が見えなくなる。
- イベントはgpuixのイベントモデルで渡される。React Nativeの`SyntheticEvent`とは互換ではない。
- `Image` は `source={{ uri: string }}` のみ対応。数値source（`require`）は未対応。
- GPU描画には対応するウィンドウ環境（WSLg、Wayland、X11など）が必要。

## ロードマップ

1. **変換層の集約**
   - `src/runtime/` にコンポーネント解決・props変換・style変換を集約する

2. **React Native propsの対応**
   - `onPress` → `onClick`
   - `accessibilityLabel` → `aria-label`
   - `accessibilityHint` / `accessibilityRole` の変換

3. **style正規化**
   - `paddingHorizontal` / `marginVertical` の展開
   - `shadow*` / `elevation` のgpuix表現への変換
   - `StyleSheet.create` での一度きりの正規化

4. **コンポーネント追加**
   - `Pressable`、`ScrollView`、`TextInput`、`FlatList`（gpuixの`virtual-list`対応）

5. **イベント互換**
   - React Nativeのイベントオブジェクトに近いラッパーの提供

## ライセンス

MIT
