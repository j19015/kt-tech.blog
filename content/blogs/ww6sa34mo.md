---
id: "ww6sa34mo"
title: "【Github】コミットの日時を変更して草が生えてる場所をずらす方法"
category: "qrl6l2q0sxi4"
tags: ["dzssocf1fs"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/5d91566f907b43979ec1039ba644d6bb/github_kusa2.jpg"
createdAt: "2024-02-28T18:14:45.039Z"
updatedAt: "2024-02-28T18:33:20.266Z"
publishedAt: "2024-02-28T18:14:45.039Z"
---

# 概要

この記事では、Gitにおけるコミットの日時を変更する方法について言及しています。

記事を書こうと思った背景としては、プライベートの都合上、PCに触れない日が度々あるのですが、草を生やしておきたいという気持ちはあるためどうにかして毎日commitしているように見せたい自分と同じ方がいらっしゃると思ったからです。

# 説明
この章ではいくつかの段落に分けて説明をします。

今回は日付と曜日を変更し、一日前にcommitしたことにしたいと思います。

## コミット日時の確認

まずはコミットの日時を確認します。

```sh:Terminal
~ $ git log --pretty=fuller

Author:     j19015 <j19015@sangi.jp>
AuthorDate: Wed Feb 28 01:15:23 2024 +0900
Commit:     j19015 <j19015@sangi.jp>
CommitDate: Wed Feb 28 01:15:23 2024 +0900

    fix ブログ詳細のレイアウトを3等分に変更

commit a01acc2ec78ffde702d0e8922865e1589dad196d
Author:     j19015 <j19015@sangi.jp>
AuthorDate: Thu Feb 15 03:13:51 2024 +0900
Commit:     j19015 <j19015@sangi.jp>
CommitDate: Thu Feb 15 03:13:51 2024 +0900

    add title underline
```


## AuthorDateの修正
直前のコミットを修正するとして下記のコマンドを打ってみます。

曜日はあまり重要ではないみたいなのでそれ以外が変わっていれば問題なさそうです。

```sh:Terminal
~ $ git commit --amend --date="Tue Feb 27 01:15:23 2024 +0900"
```
エディタが立ち上がったら、`:wq`を入力後Enterで終了しましょう。

## CommitDateの修正
commitのデータを修正します。
```sh:Terminal
~ $ git rebase HEAD~1 --committer-date-is-author-date
```

## 確認
下記のコマンドで最後に確認をします。
```sh:Terminal
~ $ git log --pretty=fuller

Author:     j19015 <j19015@sangi.jp>
AuthorDate: Tue Feb 27 01:15:23 2024 +0900
Commit:     j19015 <j19015@sangi.jp>
CommitDate: Tue Feb 27 01:15:23 2024 +0900

    fix ブログ詳細のレイアウトを3等分に変更

commit a01acc2ec78ffde702d0e8922865e1589dad196d
Author:     j19015 <j19015@sangi.jp>
AuthorDate: Thu Feb 15 03:13:51 2024 +0900
Commit:     j19015 <j19015@sangi.jp>
CommitDate: Thu Feb 15 03:13:51 2024 +0900

    add title underline
```

変更を確認後、Githubにpushし、プロフィールページから草が生えていることが確認できれば問題なしでしょう。

# 参考文献

https://blog.zzzmisa.com/git_commit_date/

# おわりに
個人のプロダクトならやってもいいですが、チーム開発や業務の場合はやらない方がいいでしょう...conflictの原因になりかねません。
