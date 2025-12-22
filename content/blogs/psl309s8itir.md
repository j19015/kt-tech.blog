---
id: "psl309s8itir"
title: "【React × Github Pages】簡単に自己紹介サイト作ってみた。"
category: "rsrbb9276"
tags: ["2wfp35bvg2", "xet6ush6eaig"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/0e467c12c8674c1ca36035858d851487/react_githubPages.jpg"
createdAt: "2024-09-26T04:31:05.111Z"
updatedAt: "2024-10-07T06:46:00.726Z"
publishedAt: "2024-09-26T04:31:05.111Z"
---

# 概要

この記事ではReactとGithubPagesを使って簡単に自己紹介サイトをデプロイしようと思います。

ハンズオン形式で進めていきますが、詳細な説明はしないので詳しく知りたい方は各単語を検索してみていただけると幸いです。

他にもなるべくレイアウトを一から実装するのは割と面倒なのでchatGPTやGithub Copilotを使って最低限の実装をしてもらっています。



# 対象者

対象者は以下になります。

- ある程度Typescript,React,Git,Githubの知識がある方
- 手軽に自己紹介サイトを作りたい方
- 自分でカスタマイズできるページを準備したい方

# 使用するツール

使用したツールや技術などをまとめておきます。
- 言語: TypeScript
- ビルド: Vite
- CSS : TailwindCSS
- UI: shadcn/ui
- デプロイ先: Github Pages
- AIツール: chatGPT(o1 preview),Github Copilot

# 前提

この記事では、前提として`node.js`の実行環境や、VSCodeなどのIDEの準備が終わっている前提で進めています。
もしセットアップが終わっていない場合は書くセットアップを完了いただいた後、この記事に戻ってきていただければと思います。

# 手順

この章では順番に手順を説明していこうと思います。

## プロジェクトの作成

まずはプロジェクトを作成しようと思います。
下記のコマンドをターミナルで打ち込んでください。

```sh:Terminal
npm create vite@latest
```

こんな感じで順番に選択していきました。
project名は自由に決めましょう。
型安全でやりたいのでTypeScriptを選択しましたが、SWCを使うかどうかは正直このプロジェクトではどっちでもいいかなという感じです。

```sh:Terminal
create-vite@5.5.2
Ok to proceed? (y) y
✔ Project name: … kt-profile-site
✔ Select a framework: › React
✔ Select a variant: › TypeScript + SWC
```

無事に終わったら下記のように表示されると思います

```sh:Terminal
Scaffolding project in /Users/koki-takahashi/Desktop/Private/kt-profile-site...

Done. Now run:

  cd kt-profile-site
  npm install
  npm run dev
```

上記のコマンド通りに実行し起動後、 `localhost:5173` にて下記のように表示されていれば問題ありません。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm1isnznp00003b6uzvhr2xim.png)


## 必要なパッケージ
今回使おうと思ってるパッケージは下記の通りです。

- tailwindcss
- shadcn/ui
- react-router

## TailwindCSSのセットアップ

まずは下記のコマンドの通り実行しましょう。

```sh:Terminal
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

次に生成された `tsconfig.json` を編集します。
`compilerOptions` の部分を追加する感じです。

```json:tsconfig.json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

さらに `tsconfig.app.json` も編集します。

```json:tsconfig.app.json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}

```

そして ` tailswind.config.js` も修正します。

```javascript:tailswind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

さらに　`index.css` にも記述を追加します。

```css:index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

~~~~~~~~~~

```

最後に `vite.config.ts` でエラーが出ないように下記のコマンドとファイルの編集を行います。

```sh:Terminal
npm i -D @types/node
```

```typescript:vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

```

セットアップが終わったら試しにTailWindCSSが反映されているかみてみましょう。
App.tsxの余分な記述を消した上で下記のように編集してみます。

```typescript:App.tsx
import './App.css'

function App() {
  return (
    <div className="bg-gray-100 flex items-center justify-center w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg　m-auto">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-900">山田 太郎</h2>
          <p className="text-gray-600">Web Developer</p>
          <p className="mt-2 text-gray-700">
            こんにちは！私はフロントエンド開発者です。ReactとTailwind CSSを使って美しいウェブサイトを作成します。
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
```

編集が終わったらアプリを起動し変更を確認してみましょう。
下記のように表示されていたら問題ありません。
色や、幅、文字の大きさなど色々と設定ができているはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm1iso6nd00013b6uw2lmw81f.png)


## shadcn/uiのセットアップ

下記のコマンドを打ちましょう

```sh:Terminal
npx shadcn@latest init
```

設定については適当に選んでみます。

```sh:Terminal
Which style would you like to use? › New York
Which color would you like to use as base color? › Neutral
Do you want to use CSS variables for colors? › no / yes
```


例えばで、アコーディオンとかを入れて表示してみましょう。
導入の方法は簡単でshadcn/uiの公式ページで使いたいコンポーネントを探してinstallするだけで使えます。

https://ui.shadcn.com/

今回は下記のコマンドを入力します。

```
npx shadcn@latest add accordion
```

components.jsonを作りますかと言われたのでそのまま作っておきました。

```
✔ You need to create a component.json file to add components. Proceed? … yes
✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Neutral
✔ Would you like to use CSS variables for theming? … no / yes
```

TOPページに表示してみてちゃんとimportできるかみてみましょう

```
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

割とリッチなUIが簡単に実装できました。
背景色が悪いですが、こんな感じになりました。しっかり色を決めて分ければ綺麗なページになると思います。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm1isprn600043b6uq5ucliu7.png)


## react-routerの導入

ページごとにコンポーネントを分けて管理したいと思うので、`react-router`を導入します。

```sh:Terminal
npm install react-router-dom
```

## ページの作成

ここはそれぞれ自由にやっていただけたらという感じです。
自分はreact-routerの導入まで済んだので必要なページを用意して編集しました。
個人的にはportfolioサイトには、自己紹介、スキル、ポートフォリオ、連絡先などが別ページで用意されていることが多いと思うので4つのページを作るとします。
ここのレイアウト作成にchatGPT(o1 mini)を使いました。すごく簡単にできるのでおすすめです、tailwindcss,shadcn/uiを使っているのでv0なんかを使うのが一番おすすめです。

react-routerの記述を参考にしていただければと思うのでそれだけ貼っておきます

```typescript:main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Contact,Skill,Top,Portfolio } from './pages';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Layout } from './components/layouts/Layout/Layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Top /></Layout>,
  },
  {
    path: "/skill",
    element: <Layout><Skill /></Layout>,
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>,
  },
  {
    path: "/portfolio",
    element: <Layout><Portfolio /></Layout>,
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

```

# デプロイ
それではある程度ページを作り終えたところでgithub pagesにデプロイしてみましょう。

## package.jsonの修正

デプロイ前準備としてpackage.jsonに追加の記述をします。

```json: package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```


## リポジトリの作成と紐付け

まずはgithubでリポジトリを作成して紐付けをします。

まずは下記のページにアクセスし、リポジトリを作成しましょう。

https://github.com/new

こんな感じで作成しました。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm1isow5a00023b6u7urlucde.png)

そしたらgithubに言われた通り下記のようにコマンドを実行していきます。

```sh:Terminal
echo "# kt-profile-site" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:j19015/kt-profile-site.git
git push -u origin main
```


## Github Pagesへのデプロイ

`npm run deploy`を実行します。
その後、settingsで下記のように変更をしてsaveします。
URLが発行されたらそれをみて問題なく表示されていたらOKです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm1isp3rj00033b6ui2c922wp.png)


## ページがうまく表されない

react-routerを使っているとデプロイ後に真っ白の画面になります。
下記のURLを見て対応しましょう。

https://qiita.com/otohusan/items/39160086ceec63c5b04a


# 終わりに

ページは問題なく確認できましたでしょうか？
静的なページで無料で公開するならgithub pagesとてもいいなと思いました。
これからも使っていこうと思います。
