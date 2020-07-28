# RealtimeQuiz-front

## Launching

```sh
$ npm install
$ npm run dev
```

## Coding Rules

### CSS

BEM + SCSS でやります。

命名規則は以下の通りです。
**ブロック\_\_要素--修飾子**

例: `display__button--disabled`とか

## Development tips

### コンポーネントカタログは積極的に利用してください．

RealtimeQuiz ではどのようなコンポーネントがあるかを一目で確認するために storybook を採用しています．
コンポーネントを追加した時は，`components/stories`に story の追加もお願いします！

```sh
$ npm run storybook
```
