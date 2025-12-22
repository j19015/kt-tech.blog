---
id: "41n452uabek"
title: "【Git】commitメッセージをおしゃれにしたい！"
category: "qrl6l2q0sxi4"
tags: ["dzssocf1fs"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/a3107c0242da4cbdb50d3cf12b49a694/git_emoji.jpg"
createdAt: "2024-05-02T04:16:12.964Z"
updatedAt: "2024-05-02T04:39:58.984Z"
publishedAt: "2024-05-02T04:16:12.964Z"
---

# 概要

こちらの記事では、commitメッセージをおしゃれにし、何をしたcommitなのかわかりやすくすることをゴールとしています。


# 対象者

commitをするときに`feat: ~~~を修正した`という風に、ただ文字を羅列しているだけでなんか見づらいなぁと思ったことがある方向けです。
(文字だけで書くことを悪いと言っているわけではありません！！)


# 実装

こちらの章では実際にcommitメッセージを、おしゃれにしていく過程について説明をします。

## 必要な絵文字を選ぶ

`:~~~~`で使える絵文字なら基本問題ないと思うのですが、パッとどういう絵文字を使うべきか浮かんでこなかったので今回は、下記のサイトと同様の絵文字を使ってみます。

https://gitmoji.dev/

とりあえず使いたいやつを出してみました。

| type | emoji |
|:-:|:-:|
| 初めてのコミット（Initial Commit） |  🎉 |
| バージョンタグ（Version Tag） |  🔖  |
| 新機能（New Feature）  |  ✨ |
| バグ修正（Bugfix）  |  🐛 |
| スタイル修正 (Add or update the UI and style files) | 💄 |
| タイプミス修正 (Fix typos) | ✒ |
| リファクタリング(Refactoring)  | ♻️  |
| ドキュメント（Documentation）  |  📚 |
| デザインUI/UX(Accessibility)  |  🎨 |
| パフォーマンス（Performance）  |  🐎 |
| ツール（Tooling）  |  🔧 |
| テスト（Tests） |  🚨 |
| コード・ファイルの削除 (Remove code or files) |  🔥 |
| 作業中(Work In Progress)  |  🚧 |


## templateを作成

commitする際に見やすいようにtemplateに追加してみます。

### ファイルを作成
まずはファイルの作成と記述を行います。
```
~ $ vi .commit_template
```
エディタが開いたら下記のようにtemplateを記述します。
```
# ==================== Emojis ====================
# 🎉  :tada: 初めてのコミット（Initial Commit）
# 🔖  :bookmark: バージョンタグ（Version Tag）
# ✨  :sparkles: 新機能（New Feature）
# 🐛  :bug: バグ修正（Bugfix）
# 💄  :lipstick: スタイル修正 (Add or update the UI and style files)
# ✒   :pencil2: タイプミス修正 (Fix typos)
# ♻️   :recycle: リファクタリング(Refactoring)
# 📚  :books: ドキュメント（Documentation）
# 🎨  :art: デザインUI/UX(Accessibility)
# 🐎  :horse: パフォーマンス（Performance）
# 🔧  :wrench: ツール（Tooling）
# 🚨  :rotating_light: テスト（Tests）
# 🔥  :fire: コード・ファイルの削除 (Remove code or files (Remove code or files.)
# 🚧  :construction: WIP(Work In Progress)


# ==================== Format ====================
# :emoji: Subject
#
# Commit body...
```

### globalの設定に適用
設定をGitのglobalの設定にします。
```
~$ git config --global commit.template ~/.commit_template
```


## commitを行う

commitしたときにtemplateが出るのでそれを参考にcommitをしpushまでしてみましょう。
Github上で絵文字が出ていたら問題なしです！

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clvoqdvvc00003b6ro8tktqbt.png)

# 参考文献
非常に参考にさせていただきました。

https://qiita.com/Jung0/items/0a9a7a97a2c17f92d3c5
https://qiita.com/shun198/items/72511bd95e13cf0be88c

# おわりに
絵文字はいろいろなものを使えたりするので便利だなと思いました。
`feat`とか`refactor`とか見ても英語があまり得意ではない自分からするとパッと見で意味がすっと入ってこない時期がGit初心者の時にはあったので、絵文字つける文化があるとGit初心者がコミットメッセージを理解しやすくなるのかな..なんて思ったりもしました。


