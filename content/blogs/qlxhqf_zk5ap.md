---
id: "qlxhqf_zk5ap"
title: "【Cloudflare】お名前.comから Cloudflare Registrarにドメイン移管をする"
category: "qrl6l2q0sxi4"
tags: ["vk9ap1y9z54"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/7f4408a01dd046b9bba9e2980fce2ba6/cloudflare_registrar.jpg"
createdAt: "2024-08-15T04:02:14.629Z"
updatedAt: "2024-09-10T06:12:09.648Z"
publishedAt: "2024-08-15T04:10:35.541Z"
---

# 概要

この記事では「お名前.com」で登録・更新を行なっていた、このブログのドメインである `kt-tech.blog` を「Cloudflare Registrar」にドメイン移管した話についてまとめています。

# 移管理由

まず、ドメインを移管したいと思った理由ですが、いくつかあります。

- 年更新のタイミングなので何となく切り替えようと思っていた
- お名前.comのサービス維持調整費が無限に釣り上がっていく
- お名前.comからのメールが無限に届く
- お名前.comにてドメイン登録時によくわからないレンタルサーバーを契約させられた。
- お名前.comと関係を切りたい
- お名前.comが嫌い

# 移管先選定

移管先の選定には以下の記事を参考にさせていただきました。

https://zenn.dev/muchoco/articles/9039762136e15c

主な理由は以下です。
- Cloudflare Registrarが一番安い(調整量などがないので)
- 元々blogの画像保存にR3を使っていて関連サービスをCloudflareに統一したかった。

# 移管方法

移管方法についてはこちらの記事を参考にさせていただきました。

https://blog.yotiosoft.com/2023/06/10/%E3%81%8A%E5%90%8D%E5%89%8D.com%E3%81%8B%E3%82%89Cloudflare-Registrar%E3%81%AB%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E7%A7%BB%E7%AE%A1%E3%81%97%E3%81%9F.html

注意点やハマった点だけ下記に列挙しておきます。
- ネームサーバの更新には少々時間がかかる
- ドメイン移管後はDNSSECの設定は「フル」にしておかないとリダイレクトのループが発生し、なぜかページが閲覧できなくなる。

# おわりに

ドメイン移管は結構色々手間取りそうだなと思ったりもしていましたが、そんなこともありませんでした。
今後はvercelにデプロイしているNext.jsのプロジェクトもCloudflare Pagesへ移行したいと考えています


# 参考文献

https://zenn.dev/muchoco/articles/9039762136e15c

https://blog.yotiosoft.com/2023/06/10/%E3%81%8A%E5%90%8D%E5%89%8D.com%E3%81%8B%E3%82%89Cloudflare-Registrar%E3%81%AB%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E7%A7%BB%E7%AE%A1%E3%81%97%E3%81%9F.html
