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
- ✅ GPUI依存追加・ビルド成功（Zed gpui crate v0.2.2）
- ✅ GPUIレンダリング実装（div()ベースのView/Text変換）

### 課題

- ✅ WSL GUIテスト完了（WSLg + Wayland、ウィンドウ表示確認）
- ❌ イベントハンドリング動作未検証（GUIテスト環境必要）

## 次のステップ

1. **イベントハンドリング**
   - napi-rs ThreadsafeFunction で Rust → JS コールバック実装
   - onPress / onClick の GPUI → JS 伝達

2. **WSL環境でのGUIテスト**
   - Wayland/X11 設定
   - open_window 関数の動作検証

3. **追加機能**
   - レイアウト計算の拡張
   - アニメーション対応
   - 追加コンポーネント（TextInput, ScrollView等）

## 使い方

```bash
npm install
npm run build
node examples/counter.mjs
```

## ライセンス

MIT
