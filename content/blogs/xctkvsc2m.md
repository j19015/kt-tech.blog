---
id: "xctkvsc2m"
title: "【Github】コミットの一括変更で草を生やす方法"
category: "qrl6l2q0sxi4"
tags: ["dzssocf1fs"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/127b8095feee4f8c9f3321a627ce77e3/github_kusa.jpg"
createdAt: "2024-02-14T16:31:52.145Z"
updatedAt: "2024-02-14T18:39:21.614Z"
publishedAt: "2024-02-14T16:36:09.496Z"
---

# 概要
この記事ではコミットを一括変更して草を生やしなおす方法について説明します。

ある日突然、毎日生やしていた草が消えてしまったことがありその時に調べたことを備忘録的に残しておこうと思います。

# 事件

自分の趣味は毎日Githubに草を生やすことでした。

しかしある日一部の草が突然消えてしまっていることに気づきました。

毎日Githubの草を生やすことを目標にしていた僕は何かをやらかしたと思いました。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clsm0eqya00003b6p5kxbda2w.png)


# 原因
色々と調べた結果下記のサイトに辿り着くことができました。

原因は、いくつか登録しているemailの中で最近使っていないemailを削除したことでした。

私用で使っていたPCで設定していたGitのconfigの設定では`(例)aaa@aaa.com`にしておりそのemailの登録をGithub上から解除してしまったという感じです。

https://zw-kakeru.com/tips/github-kusa-kieta/

# 解決方法
解決方法としては下記の記事を見つけることができました。

`filter-branch`を使い履歴の一括変更をした後、`force push`を行うことで解決しました。

```sh:Terminal
~$ git filter-branch -f --env-filter "GIT_AUTHOR_NAME=GitHubのアカウント名; GIT_AUTHOR_EMAIL=GitHubのメールアドレス; GIT_COMMITTER_NAME=GitHubのアカウント名; GIT_COMMITTER_EMAIL=GitHubのメールアドレス;" HEAD
~$ git push -f origin main
```

これは個人のプロジェクトなら問題ありませんが、チームで開発しているものに関しては絶対にやらないでください。

https://qiita.com/daichiki9180/items/f18f5c06ec826d431d25


# おわりに
毎日生やしていた草が突然消えた時は冷や汗をかきました。

多分同じ状況になってしまう方がいらっしゃると思いますので、その方々の助けになれればと思います。
