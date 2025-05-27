# Claude Code Rules for Rolling Scrollio

## プロジェクト概要
Rolling Scrollio は軽量なスクロール駆動アニメーションライブラリです。要素の可視性を追跡し、スムーズなスクロール進行値を提供します。

### 主な特徴
- 🎯 個別要素のスクロール進行状況を追跡
- 🎨 CSS変数によるアニメーション制御
- 🔧 柔軟な初期化オプション
- 🚀 軽量でパフォーマンス重視
- 📦 TypeScriptフルサポート

## 開発環境
- **言語**: TypeScript (strict mode)
- **ビルドツール**: tsup
- **パッケージマネージャー**: pnpm (10.9.0)
- **フォーマッター/リンター**: Biome
- **インデント**: タブ
- **引用符**: ダブルクォート
- **Node.js**: 18以上推奨

## 必須コマンド
コード変更後は必ず以下のコマンドを実行してください：
```bash
pnpm check  # フォーマット、リント、型チェックを一括実行
```

個別のコマンド：
- `pnpm format` - コードフォーマット
- `pnpm lint` - リントチェック  
- `pnpm build` - ビルド
- `pnpm changeset` - 変更履歴の記録（リリース前）

## プロジェクト構造

### ディレクトリ構成
```
rollin-scrollio/
├── src/                    # ソースコード
│   ├── index.ts           # メインエントリーポイント
│   ├── index.scss         # スタイル定義
│   ├── animations/        # アニメーション関連モジュール
│   │   └── index.ts       # アニメーション設定
│   └── utils/             # ユーティリティ関数
│       ├── createScrollEvent.ts  # スクロールイベント生成
│       ├── easingFunction.ts     # イージング関数
│       └── math.ts              # 数学関数
├── demo/                  # デモアプリケーション
│   ├── index.html        # デモページ
│   ├── src/
│   │   └── main.ts       # デモのエントリーポイント
│   └── package.json
├── dist/                  # ビルド出力（gitignore）
├── biome.json            # Biome設定
├── tsconfig.json         # TypeScript設定
├── tsup.config.ts        # ビルド設定
└── package.json          # プロジェクト設定
```

### ファイルの役割
- **src/index.ts**: ライブラリのメインAPI。RollingScrollio関数をエクスポート
- **src/utils/createScrollEvent.ts**: IntersectionObserverを使用したスクロール検知ロジック
- **src/utils/easingFunction.ts**: CubicBezierによるスムーズなアニメーション
- **src/utils/math.ts**: clampなどの数学的ユーティリティ

## コーディング規約

### 1. TypeScript
- strict modeを維持
- 型定義は明示的に記述
- anyの使用禁止
- インターフェースは`I`プレフィックスなし
- ユニオン型を活用した型安全性の確保

#### 型定義の例
```typescript
// 良い例
interface RollingScrollioOptions {
  selector?: string;
  element?: HTMLElement | HTMLElement[];
  callback?: (progress: number) => void;
}

// 悪い例
interface IRollingScrollioOptions {  // Iプレフィックス不要
  selector?: any;  // any禁止
  element?: object;  // 曖昧な型
}
```

### 2. 関数設計
- 単一責任の原則を遵守
- 副作用は明確に分離
- デストラクタパターンでリソース管理

```typescript
// 良い例：明確な責任分離
function createScrollioInstance(
  element: HTMLElement,
  options?: RollingScrollioCallback,
) {
  const scrollEvent = createScrollEvent(element);
  
  const destroy = scrollEvent((progress) => {
    // 進行値の処理
  });
  
  return { destroy };
}
```

### 3. コードスタイル
- Biomeの設定に従う
- タブインデント
- ダブルクォート使用
- セミコロン必須
- コメントは最小限に
- 変数名は意味を明確に

### 4. エクスポート規約
- デフォルトエクスポートを優先（メインAPI）
- 型定義は名前付きエクスポート
- バレルエクスポート（index.ts）を活用
- 内部実装は非公開

```typescript
// src/index.ts
export default RollingScrollio;  // メインAPI
export type { RollingScrollioOptions };  // 型定義

// src/utils/math.ts  
export function clamp(...) { }  // ユーティリティは名前付き
```

### 5. 変更時の注意点
- **新規ファイル作成は避ける** - 既存ファイルの編集を優先
- **ドキュメント作成禁止** - 明示的に要求されない限り*.mdファイルを作成しない
- **破壊的変更禁止** - 後方互換性を維持
- **依存関係の追加は慎重に** - 軽量性を維持（現在の依存: @takumus/cubic-bezierのみ）

### 6. テスト
- 現在テストフレームワークは未設定
- 手動でdemoフォルダで動作確認
- デモでの確認項目：
  - 基本的なスクロール動作
  - CSS変数の更新
  - callbackの動作
  - メモリリーク（destroy後）

### 7. コミット前チェックリスト
1. `pnpm check`が成功すること
2. `pnpm build`が成功すること
3. demo/index.htmlで動作確認
4. 不要なコメントがないこと
5. console.logが残っていないこと
6. 型エラーがないこと

## プロジェクト固有のルール

### CSS変数
- `--rolling-scrollio-progress`を自動設定
- -2から2の範囲で進行値を提供
- 要素ごとに独立した値を設定

### 進行値の仕様
```
-2 ~ -1: 要素がビューポートより上
-1 ~ 0: 要素が上から進入中
0: 要素がビューポート中央
0 ~ 1: 要素が下へ退出中  
1 ~ 2: 要素がビューポートより下
```

### API設計原則
- シンプルで直感的なAPIを維持
- オプションはオブジェクト形式で受け取る
- destroyメソッドでクリーンアップ可能に
- 複数の初期化パターンをサポート

#### 初期化パターン
```typescript
// 1. デフォルト
RollingScrollio();

// 2. カスタムセレクタ
RollingScrollio({ selector: '.custom' });

// 3. 要素直接指定
RollingScrollio({ element: document.getElementById('target') });

// 4. コールバック付き
RollingScrollio({ 
  callback: (progress) => console.log(progress)
});
```

### パフォーマンス最適化
- IntersectionObserverを活用（ポーリング回避）
- 不要な再計算を避ける
- メモリリークに注意（イベントリスナーの適切な削除）
- requestAnimationFrameでの更新

### エラーハンドリング
- 無効な要素は静かにスキップ
- 破壊的なエラーは避ける
- デバッグ情報は開発時のみ

## ビルドとリリース

### ビルド設定（tsup）
- CommonJSとESMの両方を出力
- 型定義ファイルを生成
- SCSSをバンドル
- ソースマップ付き

### リリースプロセス
1. 機能開発・バグ修正を完了
2. `pnpm changeset`で変更内容を記録
3. `pnpm build`でビルド確認
4. PRを作成してマージ
5. `pnpm ci:publish`でnpmに公開

## よくある実装パターン

### 1. スクロールイベントの最適化
```typescript
// utils/createScrollEvent.tsの実装パターン
const createScrollEvent = (element: HTMLElement) => {
  // IntersectionObserverで効率的に監視
  const observer = new IntersectionObserver(...);
  
  // クリーンアップ関数を返す
  return (callback: (progress: number) => void) => {
    // 実装
    return () => observer.disconnect();
  };
};
```

### 2. 進行値の計算
```typescript
// 要素の位置から進行値を算出
const progress = calculateProgress(
  elementTop,
  elementHeight,
  viewportHeight,
  scrollY
);

// -2から2の範囲にクランプ
const clampedProgress = clamp(progress, -2, 2);
```

### 3. CSS変数の更新
```typescript
element.style.setProperty(
  '--rolling-scrollio-progress',
  progress.toString()
);
```

## デバッグのヒント

### 開発時の確認方法
1. Chrome DevToolsでCSS変数の値を確認
2. console.logでコールバックの呼び出し頻度をチェック
3. Performance タブでパフォーマンスを計測
4. Memory タブでメモリリークを確認

### よくある問題と対処法
- **要素が検出されない**: セレクタの確認、タイミングの問題
- **アニメーションがカクつく**: requestAnimationFrameの使用確認
- **メモリリーク**: destroy()の呼び出し忘れ

## 今後の拡張ポイント
- テストフレームワークの導入（Vitest推奨）
- より高度なイージング関数のサポート
- スクロール方向の検出機能
- パフォーマンスモニタリング機能

## 実際のコード例と実装ガイド

### 1. 新機能追加の例：スクロール方向検出
```typescript
// src/index.tsに追加する場合
interface RollingScrollioOptions {
  // 既存の型定義...
  detectDirection?: boolean;
}

// 実装例
let previousProgress = 0;
const destroy = scrollEvent((progress) => {
  const direction = progress > previousProgress ? 'down' : 'up';
  previousProgress = progress;
  
  if (options?.detectDirection && options?.callback) {
    options.callback(progress, direction);
  }
});
```

### 2. パフォーマンス改善の例：スロットリング
```typescript
// src/utils/createScrollEvent.tsの改善例
import { throttle } from "./throttle"; // 新規作成が必要な場合

const scrollEffect = throttle(() => {
  if (!isReady) return;
  const progress = getScrollProgress(wrap);
  if (cb == null) return;
  cb(progress);
}, 16); // 60fps
```

### 3. Biome設定のカスタマイズ例
```json
// biome.jsonに追加する場合
{
  "linter": {
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "level": "warn",
          "options": { "maxAllowedComplexity": 10 }
        }
      }
    }
  }
}
```

## TODOコメントの管理
現在のコードベースには以下のTODOがあります：
- `src/utils/createScrollEvent.ts:3-11` - elementのorigin設定機能

TODOを追加する場合：
```typescript
// TODO: [機能名] - 簡潔な説明
// 例: TODO: Performance - Add requestAnimationFrame throttling
```

## AIアシスタント向けの注意事項

### コード変更時の確認事項
1. **既存ファイルの編集を優先** - 新規ファイルは最終手段
2. **型安全性の確保** - TypeScript strictモードでエラーがないこと
3. **後方互換性** - 既存のAPIを壊さない
4. **パフォーマンス** - 既存の最適化を維持

### よくある間違いと対策
- **間違い**: `console.log`を残す
  **対策**: デバッグ後は必ず削除

- **間違い**: コメントを過剰に追加
  **対策**: 必要最小限のコメントのみ

- **間違い**: 新しい依存関係を追加
  **対策**: 既存の`@takumus/cubic-bezier`のみで実装可能か検討

### プルリクエスト作成時の注意
- 変更内容を簡潔に説明
- `pnpm check`と`pnpm build`の成功を確認
- デモでの動作確認結果を記載

## セキュリティとベストプラクティス

### セキュリティ
- DOM操作は最小限に
- ユーザー入力のサニタイズ（将来的に必要な場合）
- XSS対策を意識したコード

### ベストプラクティス
- 早期リターンでネストを減らす
- 意味のある変数名を使用
- マジックナンバーは定数化
- 純粋関数を優先

```typescript
// 良い例
const VIEWPORT_MARGIN = "70% 0%";
const DEFAULT_THRESHOLD = 0.1;
const PROGRESS_MIN = -2;
const PROGRESS_MAX = 2;

// 悪い例
rootMargin: "70% 0%", // マジックストリング
```