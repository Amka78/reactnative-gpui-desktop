# react-gpui-desktop

React + GPUI Desktop rendering engine

## 概要

React Native記法でDesktopアプリを作成するためのライブラリ。Reactのjsxをreact-reconcilerでGPUIにレンダリングする。

## 技術スタック

- React 19 + TypeScript
- react-reconciler 0.31.0
- GPUI-CE (Rust, 将来統合)
- Tauri (FFI、将来統合)

## 現状（2026-10-18）

### 実装済み

- ✅ react-reconciler のHostConfig実装
- ✅ View, Text コンポーネント
- ✅ ビルド成功（TypeScript）
- ✅ サンプルアプリ実行（examples/counter.mjs）
- ✅ 非同期レンダリングの修正（flushSyncFromReconciler + updateContainerSync）
- ✅ ConcurrentRoot（tag=1）対応
- ✅ clearContainer 実装
- ✅ テキストノード最適化（shouldSetTextContent で二重ネスト解消）
- ✅ Rust 1.99.1 アップグレード（rustup-init手動DL）
- ✅ Rustバインディング基礎実装（napi-rs、View/Textノード受渡）
- ✅ JS ↔ Rust FFI統合テスト成功

### 課題

- ❌ GPUI-CE実際の統合（レンダリングパイプライン未実装）
- ❌ ウィンドウ作成・イベントループ未実装

## 次のステップ

1. **GPUI-CE統合**
   - GPUI-CEリポジトリのクローンとAPI調査
   - Rust側でView/TextのGPUIレンダリング実装
   - ウィンドウ作成・イベントループ実装

2. **機能拡張**
   - スタイルプロパティの実装
   - イベントハンドリング
   - レイアウト計算

## 使い方

```bash
npm install
npm run build
node examples/counter.mjs
```

## ライセンス

MIT
