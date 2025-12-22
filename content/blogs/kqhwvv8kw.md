---
id: "kqhwvv8kw"
title: "【Next.js×microCMS】初心者向け爆速ブログ作成ハンズオン"
category: "qrl6l2q0sxi4"
tags: ["3linszp5x1", "c3p3elg95", "f_zqu6k3qb"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/351dc6c5a2114ba6836e3fd9d91f7278/nextjs*microcms.png"
createdAt: "2023-12-21T15:35:46.881Z"
updatedAt: "2024-02-14T18:39:40.785Z"
publishedAt: "2023-12-21T15:35:46.881Z"
---

# はじめに

今回は、**【 Next.js×MicroCMS】初心者向け爆速ブログ作成ハンズオン**」というテーマで記事をシェアします🚀

初心者向けなので、緩く解説しながら進めていこうと思っています👍

文章がかなり長くなってしまうかもしれませんが、事前知識がある方は飛ばし飛ばしみていただけますと幸いです📚


# 1. 対象者

今回の記事の対象者となるのは下記の方々です。

- **Next.js**と**microCMS**を用いて無料でブログを作ってみたい方々
- **WordPress** や **STUDIO** などの今時の便利ツールを使いたくない僕のような逆張りの方々
- 無料でブログやPF掲載用のサイトを作成したい方々
- わからないことは自分で調べられる人方々


>**POINT**
わからないことがあった場合は**chatGPT**や**Bing AI**に聞いてもらってもちろん問題ありません。しかしブラウジング機能を利用しないとNext13系の情報を参照してくれなかったりするので気をつけてください。


>**ATTENTION**
今回は**Hobby**プランという無料プランを用いるため、このままでは将来的に広告をつけられません。もし広告収益を狙っている方がいらっしゃったら、課金をするか、もしくは他のデプロイ先を今後検討する必要があることを頭の片隅に置いておいていただけると幸いです。



# 2. 動作環境
この章では動作環境についてまとめておきます。
## 端末

* PC : **MacBook Air(M1,2020)**

* RAM : **8GB**

* OS : **macOS Monterey(ver12.1)**

## 実行環境
- Node.js: **ver.18**以降


# 3. 技術選定
この章では技術選定についてまとめておきます。
## フロントエンド
* Language: **TypeScript5.0**

* Library: **React18**

* FW: **Next.js13.5**(App routerを採用)

ページを表示するならReactだけでもいいのですが、今回はNext.jsを採用しました。なのでメリット、デメリットについてまとめておきます。
(Vue,Nuxtを使わなかったのは、単純に自分が使ったことがないだけです。😢)

### メリット

- 事前にHTMLを生成し、それをリクエストとして返すことができるので、パフォーマンスの向上が見込める。
- SPAと違いSEOに強い。(諸説あります。今はクローラがSPAも正しくページを認識してくれるらしい？)

### デメリット

- 常に最新の状態を表示できるわけではないこと。(SSGでサイトを動的ではなく静的サイトにしていた場合の話)

この記事の求めるところは本質理解ではないので、理解を深めたい方は以下の記事で、SSGやSPAについての理解を深めることをお勧めいたします。すごくわかりやすかったです！

https://zenn.dev/rinda_1994/articles/e6d8e3150b312d

## CMS
* CMS: **microCMS**

CMSとは何で、microCMSとはどのようなサービスなのかをまとめておきます。

### CMSとは
「CMS」とは、「Contents Management System：コンテンツ・マネジメント・システム」の略で、簡単にいうとWebサイトのコンテンツを構成するテキストや画像、デザイン・レイアウト情報（テンプレート）などを一元的に保存・管理するシステムのことです。([参照元](https://www.hitachi-solutions.co.jp/digitalmarketing/sp/column/cms_vol01/))

語弊を生むかもしれませんがめちゃくちゃ簡単に言うと、データを保存しておく、DBの処理などのバックエンド側の処理をまとめてやってくれるシステムですね。

### microCMSとは
誰でも使いやすいことを目標にして開発された日本製ヘッドレスCMSで、 直感的に入稿できるシステムによってあらゆる編集者にもわかりやすく、さまざまな要件にも適応できます。

今回選んだ大きな理由としては、クレジットカードなしで使えるので、まずは、使ってみたい初心者に対しての使用のハードルが低いことです。あとリファレンスが日本語なのとコミュニティが存在していることが大きいです。Discordのコミュニティを覗いていると、かなり盛んにユーザから運営に向けての質問が起票されており、運営も誠実に対応している様子が見受けられます。もしもの時にとても心強いですね。

## CSS
- TailwindCSS

TailswindCSSについても簡単にまとめておきます。

### TailwindCSSとは
TailwindCSSは、ユーティリティクラス(utility class)を自由に組み合わせて活用することで、オリジナリティの高いデザインのWebサイト及びWebアプリケーションを作成可能なCSSフレームワークです。

選んだ理由は単純で、Next.jsのプロジェクトに導入するのがすごく簡単だからです。(コードが汚くなるので個人的にはあまり好きではないですが...)

## デプロイ
* Service: **Vercel**

Vercelについてもどのようなサービスなのか説明をまとめておきます。

### Vercelとは
VercelはCI/CDとWebサーバーが合わさったサービスです。無料で始めることができ、GitHubなどのリポジトリと連携することで手軽にアプリケーションをデプロイすることが可能です。また、CDNが含まれているため高速なページ表示が可能となっています。([参照元](https://codezine.jp/article/detail/15780))

個人的には気軽にNext.jsプロジェクトをデプロイするならVercelかなって思ってます。
あと、最初に注意書きで書いてますが、使うプランはHobbyなので収入を得るような使い方はできません。有料プランにするか、他のデプロイ先を検討してみてください。(Amplifyやcloudflare pagesが気になってる。)

# 4. 実装手順
この章では実装手順について説明をしていきます。

## プロジェクト作成
プロジェクト名はなんでも良いですが、この記事では「**my-tech-blog**」としておきます。
プロジェクト内は、メインでTypescriptを使いたいのでオプションを指定しておきます。

```shell:Terminal
~ $ npx create-next-app my-tech-blog --typescript
```
作成時にオプションの設定が出てきますが以下のように設定していただければと思います。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/b6d2dd6a-94fe-9ada-6614-cbc3ea24a29e.png)


そうしたら一旦プロジェクトが立ち上がるの確認だけしておきましょう。

```shell:Terminal
~ $ cd my-tech-blog
~ my-tech-blog $ npm run dev
```

起動ができたら下記のURLにアクセスしてください。

https://localhost:3000

にアクセスし、下記のような画面になっていたらプロジェクトの起動に成功しています。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/31e124c5-249e-e271-5626-d02dd10e5b53.png)



>**ATTENTION**
人によってはこちらのエラーが出るかもしれません。
```
[Error: EACCES: permission denied, mkdir '/~/my-tech-blog/.next'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'mkdir',
  path: '/~/my-tech-blog/.next'
}
```
プロジェクトの操作をするのに、権限的に問題があることを示しているので、下記のコマンドを実行してください。
```
~ $ sudo chmod -R 777 .
```

## microCMSの設定

下記のURLにアクセスをしてmicroCMSのコンテンツ管理画面にアクセスしてください。
アカウントがない方は適当にアカウントを作成してください。

https://microcms.io

下記の画面まで進んだら「**一から作成する**」を選びましょう。
ここも便利な方を選ばないという**逆張り精神**を大切にしていきます。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/8ffbbfd1-0fc2-b695-64c5-78ca0cd59fad.png)

次の画面に進んだら、「**サービス名**」、「**サービスID**」を好きなように入力をしてみましょう。
「サービス名」は最初に作成したプロジェクト名と一緒にしておくとわかりやすいのでお勧めですが、「サービスID」は他の誰かと同じIDになってはいけないのでダメと言われたら適当に変更しましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/7739156c-ac1c-b38d-fd7a-86df62ab27b0.png)

成功したらこんな画面が出てくるので、一旦喜んでお茶を飲みましょう。
休憩をしたところで「**サービスにアクセスする**」をクリックして進みましょう。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/6d6f74c0-a880-fac4-e6e0-184bc9e0183d.png)

こんな画面に進むと思います。
そうしたら早速APIを作成していくのですが、
ここも**逆張り精神**を大切にし、「**自分で決める**」をクリックしましょう。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/3e44e87c-3b21-3dfa-a478-510820c8c266.png)

するとこちらの画面に進みます。
サービス名を「**ブログ**」、エンドポイントを「**blogs**」にしておきます。
内容を別に自分と一緒じゃなくても問題ないです。
入力が終わったら次のページに進みましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/0a12d60e-0494-4a89-06c0-2c04a126addf.png)

ここは「**リスト形式**」を選択しておきましょう。
問題なければ次のページに進みましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/b592b272-93ae-4241-1698-957d4337a2bb.png)

最後はこのページになります。
スキーマとして「title」,[body]を定義しておきます。
本当ならカテゴリや、タグも追加すべきなのですが、やることが増えるので今回の記事では割愛します。
入力が終わったら「作成」ボタンを押しましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/d360cfac-98a5-fdcf-638a-d9121da24a02.png)

終わったらこのページに進めば問題なしです。
ではここからテストデータとして、ブログをいくつか追加していきましょう。
「**追加**」のボタンを押して、次のページに進みましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/c592d33b-2e19-dd6c-e104-a64e859612a1.png)

このようにデータの追加画面に進みます。
**リッチテキストエディア**はslackやmattermostのテキスト入力欄のように、割と直感的に使えるので、色々触ってみると良いと思います。
早速ですが、タイトル、本文を適当に埋めてみましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/9c814ade-3399-d966-8c14-48808d219b89.png)

こんな感じでデータをいくつか作っていきます。
入力し終わるたびに右上の「**公開**」ボタンを押せば良いです。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/cdb9d2cc-e86a-6913-d275-4a5ac8a4faa9.png)

左上に「**公開中**」と出ていれば問題ないです。


![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/0b02b128-5a34-f7f3-f4d5-8ca7f4a90516.png)

このまま本文を変更すると、さっき作成した一つ目のブログを上書きしていくだけになってしまうので、二つ目のブログを作成するのに左のサイドバーの「**コンテンツ**」の下にある「**ブログ**」ボタンを押してブログのTOPページに戻ります。



![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/519a038e-eb65-579d-028a-a05ea968d8c0.png)

ブログのTOPページに戻れたら右上の「**追加**」ボタンを押し、再度データを作成しにいきます。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/95e2c078-65b1-f9a2-6649-78a760929814.png)

データをいくつか追加した状態で、ブログのTO P画面に戻り、追加したデータが表示されていればOKです。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/1f9a6806-2262-dd9b-2586-0018eb2029c1.png)

## API_KEYの設定

APIリクエストをするときのAPI_KEYをNext.jsプロジェクトに設定していきます。

まずはAPI_KEYをmicroCMSのコンテンツ管理画面から確認します。
左のサイドバーの「**APIキー**」から確認することができます。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/d8014166-c571-003f-0312-686196751177.png)

プロジェクトのルートディレクトリに`.env.local`というフォルダを作成してください。
中身に下記の記述を追加します。
SERVICE_DOMAINはAPIを作成するときに決めたドメイン名を、API_KEYは、先ほど確認したものを追加してください。
```sh:.env.local
SERVICE_DOMAIN=xxxxxxxxxxxx
API_KEY=xxxxxxxxxxxx
```

>**ATTENTION**
envファイルで設定したAPI_KEYは今回のSSGを採用したプロジェクトでは`process.env.API_KEY`で呼び出すことができますが、CSRを採用しているプロジェクトの場合は頭に`NEXT_PUBLIC_`を追加する必要がある場合があります。(使用場面によります。)
```sh:.env.local
NEXT_PUBLIC_SERVICE_DOMAIN=xxxxxxxxxxxx
NEXT_PUBLIC_API_KEY=xxxxxxxxxxxx
```


## microcms-js-sdkの準備

`microcms-js-sdk`をinstallします。

```
~ my-tech-blog $ npm install --save microcms-js-sdk
```

次に、ルートディレクトリに`libs`フォルダを作成、その配下に`client.ts`ファイルを作成します。
今回はTypescriptを採用しているので、存在チェックを先に行います。
一覧取得と詳細取得用の処理も書いておきます。
```typescript:libs/client.ts
import { createClient } from 'microcms-js-sdk';

export type Blog = {
    id: string;
    title: string;
    body: string;
}

if (!process.env.SERVICE_DOMAIN) {
    throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.API_KEY) {
    throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

export const client = createClient({
    serviceDomain: process.env.SERVICE_DOMAIN,
    apiKey: process.env.API_KEY,
});

// ブログ一覧を取得
export const getBlogs = async () => {
    const blogs = await client.getList<Blog>({
    endpoint: "blogs"
    });
    return blogs;
}

// ブログの詳細を取得
export const getDetail = async (contentId: string) => {
    const blog = await client.getListDetail<Blog>({
        endpoint: "blogs",
        contentId,
    });
    return blog;
};


```

## ブログ一覧を表示
`src/app`ディレクトリ配下に`blogs`フォルダを作成し、その配下に`page.tsx`を作成します。

```tsx:src/app/blogs/page.tsx
import Link from "next/link";
import { getBlogs } from "@/../libs/client";

export default async function StaticPage() {
    const { contents }  = await getBlogs();

    if (!contents) {
      return <h1>No Contents</h1>;
    }

    return (
      <>
        <div>
            <ul>
                {contents.map((blog) => (
                <li key={blog.id}>
                    <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                </li>
                ))}
            </ul>
        </div>
      </>
    );
  }
}

```

プロジェクトを起動し、確認します。
```
~ my-tech-blog $ npm run dev
```

下記のURLにアクセスします。

http://localhost:3000/blogs

こんな感じで。自分が入力しておいたコンテンツのタイトルが出力されていたら、問題ないです。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/161a97f1-5953-148c-e0d6-b3384fc64c8c.png)



## ブログ詳細を表示

`src/app/blogs`ディレクトリ配下に`[blogId]`フォルダを作成、その配下に`page.tsx`を作成します。

```tsx:src/app/blogs/[blogId]/page.tsx
import { getDetail,getBlogs } from "@/../libs/client";
import Link from "next/link"

export async function generateStaticParams(){
  const { contents } = await getBlogs();

  const paths = contents.map((blog)=>{
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params : { blogId },
}: {
  params: { blogId : string};
}) {
  const blog = await getDetail(blogId);

  return(
    <>
        <p>{blog.title}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: `${blog.body}`,
          }}
        />
    </>
  )
}

```
プロジェクトを起動している状態で、 下記のURLにアクセスし、ブログのタイトルをクリックして、詳細の画面を表示してみましょう。

http://localhost:3000/blogs

このように表示されていれば問題ないです。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/a07896a1-636f-dd27-3bcc-869033441eed.png)


## レイアウトを整える
### CSS
取得したHTML(blog.body)は任意のclassやstyleをmicroCMS側でつけることができないので、こちらでCSSを追加して対応します。
どうせならダークモードにも対応しようと思い、最近拝見したこちらの記事に影響されて**デザイントークン**を採用しています。

https://qiita.com/xrxoxcxox/items/9fac826a2e1c8526aa50

```css:global.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 28, 28, 28;
  --background-start-rgb: 245, 245, 245;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 227, 227, 227;
    --background-start-rgb: 28, 28, 28;
    --background-end-rgb: 38, 38, 38;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

.content h1 {
  @apply text-4xl font-bold mb-4 mt-8;
}

.content h2 {
  @apply text-3xl font-semibold mb-4 mt-6;
}

.content h3 {
  @apply text-2xl font-semibold mb-4 mt-5;
}

.content h4 {
  @apply text-xl font-semibold mb-3 mt-4;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgb(var(--background-end-rgb));
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: rgb(var(--foreground-rgb));
}

.content p {
  font-size: 18px;
  line-height: 1.6;
  color: #333333;
}

.content h1, .content h2, .content h3, .content h4, .content h5, .content h6, .content p {
  color: rgb(var(--foreground-rgb));
}

```


### 一覧画面
```tsx:src/app/blogs/page.tsx
import Link from "next/link";
import { getBlogs } from "@/../libs/client";

export default async function StaticPage() {
    const { contents }  = await getBlogs();

    if (!contents) {
      return <h1 className="text-2xl font-bold text-center mt-20">No Contents</h1>;
    }

    return (
      <>
       <div className="h-screen container mx-auto mt-10">
            <ul className="space-y-10">
                {contents.map((blog) => (
                 <li key={blog.id} className="p-5 rounded shadow-lg content flex justify-between items-center">
                    <h4>
                        {blog.title}
                    </h4>
                    <Link href={`/blogs/${blog.id}`}>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
                            詳細
                        </button>
                    </Link>
                  </li>
                ))}
            </ul>
        </div>
      </>
    );
  }

```



### 詳細画面

```tsx:src/app/blogs/[id]/page.tsx
import { getDetail,getBlogs } from "@/../libs/client";
export async function generateStaticParams(){
  const { contents } = await getBlogs();

  const paths = contents.map((blog)=>{
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params : { blogId },
}: {
  params: { blogId : string};
}) {
  const blog = await getDetail(blogId);

  return(
    <>
      <div className="h-screen pt-5">
        <div className="content">
          <h1>{blog.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: `${blog.body}`,
            }}
          />
        </div>
      </div>
    </>
  )
}

```

### 確認
ライトモードとダークモードでそれぞれ実験してみます。
- ライトモード
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/2633b61d-8ed2-dca7-d93c-3f2c36a9d287.png)
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/ad3ae70d-4dc4-a9a0-4829-e05ee3e67545.png)



- ダークモード
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/3b32967e-dd9c-2b8c-8cda-2b0b1b57420f.png)
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/3ec405fc-2de6-5c67-c2b5-5ce1e8982187.png)

問題なく表示できていたら良いと思います。
ここは個人で自由にCSSやclassを変えてしまって問題ないので遊んでみてください。

## デプロイ
ここからVercelにプロジェクトをデプロイしていきます。

### githubリポジトリを作成
下記のURLにアクセスしてgithubリポジトリを作成してください。
作成が終わったらターミナルで下記のコマンドを順番に入力していきます。
`${your-repository}`の部分は自身で書き換えてください。(`${}`もちゃんと消してください。)
```shell:Terminal
~ my-tech-blog $ git init
~ my-tech-blog $ git add .
~ my-tech-blog $ git commit -m 'first commit'
~ my-tech-blog $ git branch -M main
~ my-tech-blog $ git remote add origin ${your-repository}
~ my-tech-blog $ git push -u origin main
```
github上でファイルのアップロードが確認できたら問題ありません。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/65688efb-62ce-0dd2-f7a8-e74904a6b8f6.png)

### Vercelと連携
Vercelとgithubのリポジトリを連携していきます。
下記のURLにアクセスをしましょう。
初めての場合はgithubのアカウントでログインをしましょう。

https://vercel.com/dashboard

アクセスできましたら、ページ内の 「**Add New**」ボタンをクリックし、その後「**Project**」をクリックします。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/d8930e49-c1ff-95e5-04d6-92a22c42e705.png)

進んだ次のページ内にある「**import Git Repository**」で先ほど作成したリポジトリの「**Import**」ボタンをクリックします。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/e32ce921-2b7b-3ec6-7ac9-f9ac1bf6f6d4.png)

下記のページに進むと思います。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/dc42f776-fbe5-f164-5d48-00e1b5766944.png)


>**ATTENTION**
Vercelの使用が初めての場合は、アカウントの選択、リポジトリの選択画面のようなものが順番に出てくると思いますが、先ほど作成したリポジトリのオーナーであるアカウントを選択し、デプロイしたいリポジトリを選んでいただく方向で進めていただければと思います。


プロジェクトの名前を変えたい人は自由に変更してもらって構いません。
環境変数を追加します。「**Environment Variables**」をクリックしてください。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/dc42f776-fbe5-f164-5d48-00e1b5766944.png)

`.env.local`に追加した内容をそのまま追加します。
keyとvalueを記入したら右の「**Add**」ボタンを押すと追加できます。
入力しただけではダメなので気をつけましょう。
下記のような状態になると思います。(順不同)
問題なさそうならこのまま「**Deploy**」のボタンを押してみましょう。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/fa26dd70-efda-18e5-c2d2-6d304349e5ab.png)

デプロイが始まったらしばらく待ちましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/5c8f95ef-40d2-e2ce-0f17-a9ac179c75a1.png)

二分ほど待つと下記の画面に進みます。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/40038729-d331-c361-b3f7-5132c917a77b.png)

previw画面をクリックするとデプロイをしたページに飛べるので飛んでみましょう。
よく見るNext.jsのTOPページに飛べると思います。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/686d63a9-c0f1-40fd-2fda-d8da139b5d49.png)

ブラウザ上部に表示されているアドレスバー内のURL末尾に `/blogs`を追加してアクセスしてみましょう。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/d536c64e-8554-af1b-2bd7-ba7ac3fe7de2.png)
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/05c59444-5ebe-6020-9c99-2b29987137ce.png)


ローカルの開発環境で見ていた状態と同じものが見れていますね。
ここまできたらブログ作成のハンズオンは終了になります。

自分がデプロイしたのも貼っておきます。
`my-tech-blog-henna`の`-henna`の部分はVercel側が他の人のドメインと被らないように自動で割り当てしてくれてるみたいなので人によってバラバラです。

https://my-tech-blog-henna.vercel.app/blogs



# 5. 参考文献

https://blog.microcms.io/microcms-next-jamstack-blog/


# 6. おわりに
今回はブログを作成していくところまでを自分の方で担当しました。

ベースはできたと思うのでここからどうアレンジしていくかは皆様にお任せいたします！

就活用の自己紹介サイトにするのもよし、ブログとして本格運営するのもよしです。

今後は、暇な時にこの記事に関連した記事を出していこうと思っています。

今日以降で出るAdventCalendarの記事で、ブログを作成をしやすくする方法、markdownのレイアウトを綺麗にする方法についても詳しく解説した記事が出る予定なので楽しみにしておいていただけますと幸いです！


最後の最後にですが、自分が作成しているブログ（開発中）も見てくださると嬉しいです。

https://kt-tech.blog
