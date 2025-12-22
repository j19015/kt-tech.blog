---
id: "pm2pn03hj2wx"
title: "【Next.js】検索結果にサムネイル画像を設定する方法"
category: "qrl6l2q0sxi4"
tags: ["3linszp5x1", "m3lf7quc_852"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/57a9642deb98417eab8bea98e3cc8264/thumbnail.jpg"
createdAt: "2024-09-09T16:27:09.054Z"
updatedAt: "2024-09-10T02:36:52.130Z"
publishedAt: "2024-09-09T16:28:16.204Z"
---

# 概要

この記事ではNext.jsで作成したサイト、アプリケーションにサムネイル画像を設定する方法について説明をします。

wordpressなどを使ったサムネイル画像の設定方法はすぐに見つかったのですが、Next.jsの場合の設定方法についてはすぐに見つからなかったので共有します。

# Webブラウザにおけるサムネイル画像とは

下記の画像のようにページ説明の右側に出す画像のことです。

 他のページとの差別化を図ったりそのページにどんな情報があるのか視覚的にわかりやすくなります。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/cm0v7s6b200003b6s5miexxz1.png)


# 実装方法

layout.tsxや各page.tsxにてmetaDataのotherに下記のように指定してあげるだけです。


```typescript
export const metadata: Metadata = {

	~~~~~~~~~~~~~~~~~~~~~~

  other: {
    thumbnail: `サムネイル画像のURL`,
  },
};
```

# 確認方法

検証ツールなどでHTMLのheadタグの中にthumbailと書いてあるmetaタグがあれば問題ないと思います。

念の為metaタグのリンクに遷移し、画像が表示できるところまで確認しておくとなお良いと思います。


# まとめ

方法が意外と楽な割にネット上に情報が少なかったので困りました。

layout.tsxなどにmetaタグを直接埋め込んでも良いのですが、そうすると各ページごとサムネイル画像を変えたい時に、headじゃない部分でmetaタグを書くことになってしまうので記述が変になります。

今回の方法は覚えておこうと思います。
