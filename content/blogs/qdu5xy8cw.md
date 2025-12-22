---
id: "qdu5xy8cw"
title: "【Next.js】webpack.cache.PackFileCacheStrategyのエラーの解決"
category: "qrl6l2q0sxi4"
tags: ["3linszp5x1"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/5f1e3530b2ac451288b9fb5ab505e2ce/nextjs%20(1).png"
createdAt: "2023-10-06T08:43:13.490Z"
updatedAt: "2023-11-28T12:16:35.835Z"
publishedAt: "2023-10-06T08:43:13.490Z"
---

# 1. 概要
この記事では、Next.jsアプリケーションのビルド時に`webpack.cache.PackFileCacheStrategy`というエラーに遭遇した際の解決方法について説明します。

# 2. エラーメッセージ
```
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, stat '/Users/User名/Next_App/.next/cache/webpack/client-development/18.pack.gz'
```

# 3. エラーの影響
アプリケーションのビルド時に毎回 **Terminal** にエラーが出る。

# 4. 解決方法
Next.jsアプリケーションの **ルートディレクトリ直下**の「**.next**」フォルダを削除してアプリケーションを再起動。
>**理由**
出ているエラーが **webpack** の **cache** の読み込み失敗に関するエラーなので、ビルド時に、**cache** しているフォルダごと消しています。

# 5. 参考文献

https://github.com/vercel/next.js/issues/47394

https://github.com/vercel/next.js/discussions/35877

https://github.com/vercel/next.js/issues/27650

https://kt-tech-blog.vercel.app/blogs/qdu5xy8cw


# 6. おわりに

**isuue** を見ても解決している感じがなかったので根本的な原因はわかりませんでした。

個人的には **cache** している **webpack** が怪しいなと思っているのですが、Next.jsに関する理解が甘いせいで完全に原因を探し切れていません。

もし、詳しく理解されている方がいらっしゃいましたら知見を共有いただけると幸いです。
