// React Native の公開 API を網羅した移植状況カタログ。
// 出典: react-native 0.86.3 の型定義（open-bookshelf が参照するバージョン）。
// ステータス: done = 対応済み / partial = 一部対応 / todo = 未対応。

export type PortStatus = 'done' | 'partial' | 'todo';

export interface PropEntry {
  name: string;
  status: PortStatus;
}

export interface CatalogEntry {
  name: string;
  status: PortStatus;
  note: string;
  props?: PropEntry[];
}

export interface CatalogGroup {
  id: 'components' | 'apis' | 'hooks' | 'types';
  title: string;
  entries: CatalogEntry[];
}

const todo = (...names: string[]): PropEntry[] =>
  names.map((name) => ({ name, status: 'todo' as PortStatus }));

const done = (...names: string[]): PropEntry[] =>
  names.map((name) => ({ name, status: 'done' as PortStatus }));

// ── Components ──────────────────────────────────────────────────────────────

const COMPONENTS: CatalogEntry[] = [
  {
    name: 'View',
    status: 'partial',
    note: '基本レイアウト（gluestack Box の土台）。children/style/testID を対応。イベント・計測は未対応。',
    props: [...done('children', 'style', 'testID'), ...todo('hitSlop', 'id', 'needsOffscreenAlphaCompositing', 'onLayout', 'pointerEvents', 'removeClippedSubviews', 'nativeID', 'collapsable', 'collapsableChildren')],
  },
  {
    name: 'Text',
    status: 'partial',
    note: 'テキスト。color 指定が必須（gpuix は親から継承しない）。children/style/testID を対応。',
    props: [...done('children', 'style', 'testID'), ...todo('allowFontScaling', 'ellipsizeMode', 'id', 'lineBreakMode', 'numberOfLines', 'onLayout', 'onTextLayout', 'onPress', 'onPressIn', 'onPressOut', 'onLongPress', 'nativeID', 'maxFontSizeMultiplier', 'minimumFontScale', 'pointerEvents', 'pressRetentionOffset')],
  },
  {
    name: 'Image',
    status: 'partial',
    note: 'source→src / resizeMode→objectFit。ViewProps も継承。読み込みイベント等は未対応。',
    props: [...done('source', 'style', 'resizeMode', 'testID'), ...todo('onLoad', 'onError', 'onLoadStart', 'onLoadEnd', 'onProgress', 'fadeDuration', 'resizeMethod', 'blurRadius', 'capInsets', 'defaultSource', 'loadingIndicatorSource', 'accessibilityLabel')],
  },
  {
    name: 'ImageBackground',
    status: 'todo',
    note: 'Image を土台にする背景付きコンテナ。Image 移植後に実装予定。',
    props: [...todo('children', 'style', 'source', 'resizeMode', 'imageStyle', 'imageRef')],
  },
  {
    name: 'Pressable',
    status: 'todo',
    note: 'クリックの主経路。onPress を gpuix の onClick へ変換する必要あり。',
    props: todo('children', 'onPress', 'onPressIn', 'onPressOut', 'onLongPress', 'onHoverIn', 'onHoverOut', 'onFocus', 'onBlur', 'disabled', 'hitSlop', 'delayLongPress', 'delayHoverIn', 'delayHoverOut', 'cancelable', 'pressRetentionOffset', 'style', 'android_disableSound', 'android_ripple', 'testOnly_pressed', 'unstable_pressDelay'),
  },
  {
    name: 'TextInput',
    status: 'todo',
    note: '入力（gluestack Input の土台）。value/onChangeText の双方向同期が必要。',
    props: todo('value', 'defaultValue', 'onChangeText', 'onChange', 'onFocus', 'onBlur', 'onSubmitEditing', 'onKeyPress', 'onSelectionChange', 'onEndEditing', 'placeholder', 'placeholderTextColor', 'autoFocus', 'autoCapitalize', 'autoCorrect', 'autoComplete', 'editable', 'readOnly', 'keyboardType', 'inputMode', 'returnKeyType', 'enterKeyHint', 'maxLength', 'multiline', 'numberOfLines', 'secureTextEntry', 'selectTextOnFocus', 'selection', 'selectionColor', 'textAlign', 'caretHidden', 'contextMenuHidden', 'blurOnSubmit', 'submitBehavior', 'style', 'testID', 'allowFontScaling', 'maxFontSizeMultiplier', 'inputAccessoryViewID'),
  },
  {
    name: 'ScrollView',
    status: 'todo',
    note: 'スクロールコンテナ。gpuix の overflow/スクロールとの対応付けが必要。',
    props: todo('contentContainerStyle', 'horizontal', 'pagingEnabled', 'scrollEnabled', 'showsVerticalScrollIndicator', 'showsHorizontalScrollIndicator', 'keyboardDismissMode', 'keyboardShouldPersistTaps', 'decelerationRate', 'snapToInterval', 'snapToOffsets', 'onScroll', 'onContentSizeChange', 'onScrollBeginDrag', 'onScrollEndDrag', 'onMomentumScrollBegin', 'onMomentumScrollEnd', 'refreshControl', 'stickyHeaderIndices', 'removeClippedSubviews', 'style', 'testID'),
  },
  {
    name: 'FlatList',
    status: 'todo',
    note: '仮想化リスト。gpuix の virtual-list との対応が候補。',
    props: todo('data', 'renderItem', 'keyExtractor', 'getItemLayout', 'numColumns', 'horizontal', 'initialNumToRender', 'initialScrollIndex', 'onRefresh', 'refreshing', 'onViewableItemsChanged', 'viewabilityConfig', 'removeClippedSubviews', 'columnWrapperStyle', 'extraData', 'legacyImplementation'),
  },
  {
    name: 'SectionList',
    status: 'todo',
    note: 'セクション付きリスト。FlatList 移植後に実装予定。',
    props: todo('sections', 'renderItem', 'renderSectionHeader', 'renderSectionFooter', 'keyExtractor', 'getItemLayout', 'initialNumToRender', 'onRefresh', 'refreshing', 'onEndReached', 'onEndReachedThreshold', 'stickySectionHeadersEnabled', 'SectionSeparatorComponent', 'renderScrollComponent', 'removeClippedSubviews'),
  },
  {
    name: 'VirtualizedList',
    status: 'todo',
    note: 'FlatList/SectionList の基底。直接使うことは稀。',
    props: todo('data', 'renderItem', 'keyExtractor', 'getItem', 'getItemCount', 'getItemLayout', 'initialNumToRender', 'maxToRenderPerBatch', 'onEndReached', 'onEndReachedThreshold', 'onViewableItemsChanged', 'windowSize', 'removeClippedSubviews'),
  },
  {
    name: 'Modal',
    status: 'todo',
    note: 'オーバーレイ。gpuix のウィンドウ/レイヤー機構との対応が必要。',
    props: todo('visible', 'transparent', 'animationType', 'animated', 'onRequestClose', 'onShow', 'backdropColor', 'children', 'style'),
  },
  {
    name: 'Switch',
    status: 'todo',
    note: 'トグル。value/onValueChange の双方向同期が必要。',
    props: todo('value', 'onValueChange', 'disabled', 'trackColor', 'thumbColor', 'ios_backgroundColor', 'style', 'testID'),
  },
  {
    name: 'ActivityIndicator',
    status: 'todo',
    note: 'ローディング表示。gpuix のアニメーション機構で実装予定。',
    props: todo('animating', 'color', 'size', 'hidesWhenStopped', 'style'),
  },
  {
    name: 'Button',
    status: 'todo',
    note: '簡易ボタン。Pressable 移植後に内包して実装可能。',
    props: todo('title', 'onPress', 'color', 'disabled', 'accessibilityLabel', 'testID'),
  },
  {
    name: 'TouchableOpacity',
    status: 'todo',
    note: '押下時の透明度変化。Pressable に集約して実装予定。',
    props: todo('activeOpacity', 'children', 'style'),
  },
  {
    name: 'TouchableHighlight',
    status: 'todo',
    note: '押下時の背景ハイライト。Pressable に集約して実装予定。',
    props: todo('activeOpacity', 'underlayColor', 'onShowUnderlay', 'onHideUnderlay', 'style'),
  },
  {
    name: 'TouchableWithoutFeedback',
    status: 'todo',
    note: 'フィードバック無しのタッチ領域。Pressable に集約して実装予定。',
    props: todo('children', 'onPress', 'onPressIn', 'onPressOut', 'onLongPress', 'onLayout', 'disabled', 'hitSlop', 'delayLongPress', 'delayPressIn', 'delayPressOut', 'pressRetentionOffset', 'style', 'testID'),
  },
  {
    name: 'TouchableNativeFeedback',
    status: 'todo',
    note: 'Android 専用。Desktop では no-op / Pressable 相当にフォールバック。',
    props: todo('onPress', 'useForeground', 'background', 'children'),
  },
  {
    name: 'RefreshControl',
    status: 'todo',
    note: 'プルリフレッシュ。ScrollView 移植後に実装予定。',
    props: todo('refreshing', 'onRefresh', 'colors', 'enabled', 'progressBackgroundColor', 'progressViewOffset', 'size', 'tintColor', 'title', 'titleColor'),
  },
  {
    name: 'KeyboardAvoidingView',
    status: 'todo',
    note: 'キーボード回避。Desktop では影響が小さいため優先度低。',
    props: todo('behavior', 'keyboardVerticalOffset', 'enabled', 'contentContainerStyle', 'style'),
  },
  {
    name: 'StatusBar',
    status: 'todo',
    note: 'ステータスバー制御。Desktop では no-op 相当になる見込み。',
    props: todo('animated', 'barStyle', 'hidden', 'backgroundColor', 'translucent', 'showHideTransition'),
  },
  {
    name: 'SafeAreaView',
    status: 'todo',
    note: 'セーフエリア。現状は react-native-safe-area-context が主流。',
    props: todo('children', 'style', 'testID'),
  },
  {
    name: 'DrawerLayoutAndroid',
    status: 'todo',
    note: 'Android 専用。Desktop では不要の見込み。',
    props: todo('renderNavigationView', 'drawerPosition', 'drawerWidth', 'drawerLockMode', 'drawerBackgroundColor', 'keyboardDismissMode', 'onDrawerOpen', 'onDrawerClose', 'onDrawerSlide', 'onDrawerStateChanged', 'statusBarBackgroundColor'),
  },
  {
    name: 'InputAccessoryView',
    status: 'todo',
    note: 'iOS 専用。Desktop では不要の見込み。',
    props: todo('children', 'style', 'backgroundColor', 'nativeID'),
  },
];

// ── APIs ────────────────────────────────────────────────────────────────────

const APIS: CatalogEntry[] = [
  {
    name: 'StyleSheet',
    status: 'partial',
    note: 'create は identity。RN エイリアス展開（paddingHorizontal 等）は未対応。',
    props: [...done('create'), ...todo('flatten', 'hairlineWidth', 'absoluteFill', 'absoluteFillObject', 'compose')],
  },
  { name: 'Platform', status: 'todo', note: '分岐ユーティリティ。open-bookshelf で 23 箇所使用。', props: todo('OS', 'Version', 'select', 'isPad', 'constants', 'isTV') },
  { name: 'Dimensions', status: 'todo', note: '画面サイズ取得。', props: todo('get', 'set', 'addEventListener', 'removeEventListener') },
  { name: 'PixelRatio', status: 'todo', note: 'ピクセル密度。', props: todo('get', 'getFontScale', 'getPixelSizeForLayoutSize', 'roundToNearestPixel') },
  { name: 'Appearance', status: 'todo', note: 'テーマ情報。useColorScheme の基盤。' },
  { name: 'AppRegistry', status: 'todo', note: 'アプリ登録。gpuix は render() で起動するため置き換え対象。' },
  { name: 'AppState', status: 'todo', note: 'アプリ状態（foreground/background）。' },
  { name: 'BackHandler', status: 'todo', note: '戻るボタン。Desktop ではキーイベントへ対応。' },
  { name: 'Alert', status: 'todo', note: 'ダイアログ。gpuix のウィンドウ機構で実装予定。' },
  { name: 'ActionSheetIOS', status: 'todo', note: 'iOS 専用。不要の見込み。' },
  { name: 'ToastAndroid', status: 'todo', note: 'Android 専用。不要の見込み。' },
  { name: 'Animated', status: 'todo', note: 'アニメーション。gpuix の motion / frame loop と対応検討。' },
  { name: 'Easing', status: 'todo', note: 'アニメーションのイージング関数。' },
  { name: 'LayoutAnimation', status: 'todo', note: 'レイアウトアニメーション。優先度低。' },
  { name: 'Keyboard', status: 'todo', note: 'キーボード制御。Desktop では優先度低。' },
  { name: 'InteractionManager', status: 'todo', note: 'インタラクション後の処理スケジューリング。' },
  { name: 'PanResponder', status: 'todo', note: 'ジェスチャ。gpuix のポインタイベントへ対応。' },
  { name: 'Linking', status: 'todo', note: '外部 URL 起動。' },
  { name: 'Share', status: 'todo', note: '共有。Desktop ではネイティブ共有 API へ対応。' },
  { name: 'Vibration', status: 'todo', note: 'バイブレーション。Desktop では no-op の見込み。' },
  { name: 'Clipboard', status: 'todo', note: 'クリップボード。' },
  { name: 'PermissionsAndroid', status: 'todo', note: 'Android 専用。不要の見込み。' },
  { name: 'NativeModules', status: 'todo', note: 'ネイティブモジュール橋渡し。gpuix では別経路。' },
  { name: 'I18nManager', status: 'todo', note: 'RTL 制御。' },
  { name: 'LogBox', status: 'todo', note: '警告表示。gpuix では console / オーバーレイで代替。' },
  { name: 'findNodeHandle', status: 'todo', note: 'ネイティブノード参照。gpuix では host node id で代替。' },
  { name: 'processColor', status: 'todo', note: '色の正規化。' },
  { name: 'UIManager', status: 'todo', note: 'レイアウト計測・ネイティブ操作。' },
  { name: 'AccessibilityInfo', status: 'todo', note: 'アクセシビリティ。gpuix の AccessKit と対応検討。' },
  { name: 'DevSettings', status: 'todo', note: '開発設定。不要の見込み。' },
];

// ── Hooks ────────────────────────────────────────────────────────────────────

const HOOKS: CatalogEntry[] = [
  { name: 'useColorScheme', status: 'todo', note: 'テーマ判定。open-bookshelf で 6 箇所使用。' },
  { name: 'useWindowDimensions', status: 'todo', note: 'ウィンドウサイズ。open-bookshelf で使用。' },
  { name: 'useAnimatedValue', status: 'todo', note: 'Animated 用フック。' },
  { name: 'useAnimatedValueXY', status: 'todo', note: 'Animated 用フック。' },
  { name: 'useAnimatedColor', status: 'todo', note: 'Animated 用フック。' },
  { name: 'usePressability', status: 'todo', note: 'Pressable の内部フック。Pressable 移植時に実装。' },
];

// ── Types ────────────────────────────────────────────────────────────────────

const TYPES: CatalogEntry[] = [
  { name: 'ViewStyle', status: 'todo', note: 'View 用スタイル型。StyleDesc との対応付けが必要。' },
  { name: 'TextStyle', status: 'todo', note: 'Text 用スタイル型。' },
  { name: 'ImageStyle', status: 'todo', note: 'Image 用スタイル型。' },
  { name: 'StyleProp', status: 'todo', note: 'スタイル配列/単一の共用型。gpuix は配列未対応。' },
  { name: 'FlexAlignType', status: 'todo', note: 'flex アラインメント型。' },
  { name: 'DimensionValue', status: 'todo', note: '寸法型（number | string）。gpuix と概ね一致。' },
  { name: 'Insets', status: 'todo', note: 'セーフエリア等の inset 型。' },
];

export const CATALOG: CatalogGroup[] = [
  { id: 'components', title: 'Components', entries: COMPONENTS },
  { id: 'apis', title: 'APIs', entries: APIS },
  { id: 'hooks', title: 'Hooks', entries: HOOKS },
  { id: 'types', title: 'Types', entries: TYPES },
];
