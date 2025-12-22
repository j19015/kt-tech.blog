---
id: "qls3z-k8m"
title: "【Next.js】FontAwesomeを導入してアイコンを表示してみよう！"
category: "qrl6l2q0sxi4"
tags: ["7rvblpzz0e", "3linszp5x1"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/fdd77a0bc91e42df8c13515cb6935c0e/FontAwesome.png"
createdAt: "2023-10-07T16:50:45.022Z"
updatedAt: "2023-10-21T16:40:40.871Z"
publishedAt: "2023-10-07T16:50:45.022Z"
---

# はじめに
こんにちは！Web系の企業に勤務し、地方からフルリモート勤務をしている@takakouと申します

今回は、「**【Next.js】FontAwesomeを使ってみよう！**」というテーマで記事をシェアします！

この記事を執筆しようと思った経緯としては、私自身が **Next.jsアプリケーション**に**FontAwesome**を導入する記事が古いものが多いなと思ったからです。

そこで、同じ疑問を持つ方の解消ができればと思い執筆しました

記事執筆は未熟者で、至らない点もあるかと思いますが、皆さんのコメントやフィードバックをお待ちしています！

# 目次
<!-- タイトルとアンカー名を編集 -->
1. [対象者](#1.対象者)
1. [動作環境](#2.動作環境)
1. [前提知識](#3.前提知識)
1. [導入手順](#4.導入手順)
1. [参考文献](#5.参考文献)
1. [おわりに](#6.おわりに)
<!-- 各チャプター -->

# 1. 対象者

* **FontAwesome**を**Next.jsアプリケーション**に導入したい方
* **Next.js**,**React**に普段から触れている方

# 2. 動作環境
この章では**動作環境**について説明します。

## 端末
- PC : **MacBook Air (M1, 2020)**

- RAM : **8GB**

- OS : **macOS Monterey(ver12.1)**

## バージョンなど

- Next.js : **13.4.19**

- React : **18.2.0**

- npm : **9.8.1**

# 3. 前提知識
この章では前提知識として**FontAwesome**について軽く説明をします。

## FontAwesomeとは

**Font Awesome**とは、Webサイトにアイコンフォントを簡単に表示させることができるWebサービスです。
提供されているアイコンフォントは商用利用可能となっていますので、個人開発されているWebサイトやブログに導入できます。

また、Font Awesomeのアイコンフォントはサイズ・色の変更ができるだけでなく、サイズを大きくしても画質が悪くならないといったメリットがあります。(引用: [ラクスエンジニアブログ](https://tech-blog.rakus.co.jp/entry/20220127/fontawesome))

https://tech-blog.rakus.co.jp/entry/20220127/fontawesome

# 4. 導入手順
こちらの章では導入手順について説明していきます。

>**前提**
公式のリファレンスを参考にしています。:
https://fontawesome.com/docs/web/use-with/react/

## fontawesome-svg-coreをinstallする
こちらは有料プラン、無料プラン問わず必要なコマンドになりますので実行してください。
```shell:Terminal
npm i --save @fortawesome/fontawesome-svg-core
```

## プラン別

>**注意点**
加入しているプラン別に実行コマンドが違います。
今回は登録不要な **Free Plan** で設定を行います。


### Free Plan
```shell:Terminal
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
```

### Pro Plan
もし**FontAwesome**の**Pro**プランに加入されていて、そちらを使ってみたい方は、こちらのリファレンスを参考に設定をしてみてください。

https://fontawesome.com/docs/web/setup/packages#configure-access


## React Componentを追加
```shell:Terminal
npm i --save @fortawesome/react-fontawesome@latest
```

## layout.tsxに記述を追加
```javascript:src/app/layout.tsx
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
```

## 使いたいアイコンを検索
Freeで使えるアイコンを下記のページから探します。

https://fontawesome.com/search?o=r&m=free

### 探し方
- 検索窓に自分が使いたいアイコン、例えばノートの絵文字なら **note**、家の絵文字なら **home** のように入れましょう。非同期で検索が行われるので検索ボタンとかは探さなくて大丈夫です。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/0da9c441-4047-e4d9-9649-b2e2301a2805.png)

- ヒットしたものから使いたいものを選んでクリックします。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/0c0fbde9-2400-2b1f-cdff-fbeb2be0d5a0.png)

- コードブロックの言語選択欄からReactを選択しましょう。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/f2600fa3-5c01-8042-c7f9-1a5141f48993.png)

-  Glocal importの コードをコピーしておいてください。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/59932c07-ca8c-7442-87c0-f1c9f6a462ee.png)

- Individual importの記述もコピーしておきましょう
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/e5c89ff2-d5dd-e8c3-fcff-894a96e45eef.png)



## アイコンを使いたいページに記述を追加
今回使うアイコン(`fa-house`)は先ほどコピーした**Glocal import**のコードから`solid`に含まれていることがわかります。
```javascript
<FontAwesomeIcon icon="fa-solid fa-house" />
```

コピーしておいた**Individual import**の記述に加え、最初の方にinstallした`'@fortawesome/free-solid-svg-icons`パッケージの中から、`faHouse`をimportしておきます。

```javascript:（例）index.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'



....

<FontAwesomeIcon icon={faHouse} />

....

```


>**注意点**
アイコンによって含まれるパッケージが異なりますので注意してください。

## 表示例
こんなアイコンがブラウザ上に表示されていれば問題なしです。


![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/79708e32-4507-1bb4-92d2-016ffe899cd3.png)



# 5. 参考文献

https://kt-tech.blog/blogs

https://fontawesome.com/docs/web/use-with/react/


# 6. おわりに

今回の記事では、 **Next.jsアプリケーションにFontAwesome** を導入する方法について説明しました

もし興味を持っていただけましたら、ぜひ他の記事も読んでいただけるとうれしいです！

(最後に、気づいた方もいらっしゃると思うのですが、絵文字を入れるのは苦手なので、文章に沿った絵文字を挿入するのに、ChatGPTを利用させていただきましたが、いかがでしたでしょうか。不快に思われた方がいたら申し訳ございません)
