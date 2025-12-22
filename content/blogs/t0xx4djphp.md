---
id: "t0xx4djphp"
title: "【Next.js】Google Analytics4を導入してみた"
category: "qrl6l2q0sxi4"
tags: ["3linszp5x1", "g8a6lsp4h"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/f1b8fb21066a4847ac8520d2568bfe50/GoogleAnalytics.png"
createdAt: "2023-10-20T15:56:31.347Z"
updatedAt: "2023-10-21T15:53:15.767Z"
publishedAt: "2023-10-20T15:57:20.759Z"
---

# はじめに
こんにちは！Web系の企業に勤務し、地方からフルリモート勤務をしている@takakouと申します
今回は、**【Next.js】Google Analytics4を導入してみた** というテーマで記事をシェアします！
記事執筆は未熟者で、至らない点もあるかと思いますが、皆さんのコメントやフィードバックをお待ちしています！



# 対象者
- Next.jsプロジェクトにGoogleAnalyticsを導入したい方
- Next13系を利用している方
- App routerを採用している方
- デプロイにVercelを利用している方

# 動作環境
この章では**動作環境**について説明します。

## 端末
- PC : **MacBook Air (M1, 2020)**

- RAM : **8GB**

- OS : **macOS Monterey(ver12.1)**

## バージョンなど

- Next.js : **13.4.19**

- React : **18.2.0**

- npm : **9.8.1**

# 前提知識
この章では前提知識をいくつか説明します。

## GoogleAnalyticsとは
情報についてchatGPTに聞いてみました(最近課金したので使ってみたくてですね...)
Google Analyticsは、Googleが提供するウェブ解析ツールのことを指します。このツールを使用すると、ウェブサイトやモバイルアプリのユーザーの行動を詳しく分析することができます。以下はGoogle Analyticsの主な機能と特徴になります：

- **トラフィック分析**:
どのような経路でユーザーがサイトにアクセスしてきたか、例えば検索エンジン、リファラーサイト、直接アクセスなどの情報を取得することができます。

- **ユーザーの行動分析**:
ユーザーがサイト内でどのページを訪れたか、どのページでどれくらいの時間を過ごしたか、どのページで離脱したかなどの情報を分析することができます。

- **ユーザーのデモグラフィック情報**:
年齢、性別、地域などのユーザーの基本的なデモグラフィック情報を取得することができます。

- **コンバージョンの追跡**:
オンラインストアや広告キャンペーンの成果を測定するためのツールとして、コンバージョン（目標達成）の追跡機能があります。

- **カスタムレポート**:
ユーザーのニーズに合わせてカスタムレポートを作成することができます。


# 実装手順
この章では実装手順について説明していきます。

## Google Analyticsで設定をする
下記の記事を見ながら設定をしていただき、計測タグのIDをメモしておきます
`G-XXXXXXXXXX`みたいなのが設定完了後に出てくるはずです。

https://www.xserver.ne.jp/bizhp/how-to-set-up-google-analytics/?gad=1&gclid=CjwKCAjwysipBhBXEiwApJOcuztozCyy0vc0XKU7hLdTrsCNTILbWr9ISmdPtff_Ezv7dWTbLZtAbhoCMywQAvD_BwE

## gtagをinstall

```shell:Terminal
~ $ npm i -D @types/gtag.js
```

## .env.localに定義

```markdown:.env.local
NEXT_PUBLIC_GA_ID=*********
```

## libs/gtag.tsを作成

```typescript:libs/gtag.ts
export const GA_TAG_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const IS_GATAG = GA_TAG_ID !== "";

export const pageview = (path: string) => {
  window.gtag("config", GA_TAG_ID, {
    page_path: path,
  });
};
```

## componentを作成

```tsx:components/GoogleAnalytics/GoogleAnalytics.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { IS_GATAG, GA_TAG_ID, pageview } from "@/../libs/gtag";

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!IS_GATAG) {
      return
    }
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TAG_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TAG_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
```

## layout.tsxで読み込み

```tsx:app/src/layout.tsx
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics'

~~~~~~~

<html lang="ja">
  <head>
    <GoogleAnalytics/>
  </head>
  <body>
    <div>
      <Header/>
      <div className='m-1 mt-5 rounded-lg'>
        {children}
      </div>
      <Footer/>
    </div>
  </body>
</html>

~~~~~~~
```

## Vercelで対応
Vercelで環境変数として定義して値も入れておきます。

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/931955d5-591d-7587-55ee-072c70dbb663.png)

## 反映を確認

デプロイをし直し、少しサイトを操作した後にGoogle Analyticsの画面を見にいきましょう。GoogleAnalyticsの画面が設定のような画面から切り替わり、計測画面になっていればOKです。


> **注意点**
長くて48時間反映にかかる場合があるみたいなので気長に待ちましょう。


## 参考文献

https://qiita.com/ruiiixiii/items/2f3e3497d13ec804eb40

## おわりに

GoogleAnalyticsの設定がとても簡単だったので驚きました。
とりあえず今回は設定を計測されるか試してみたいだけだったのでここで終わります。
間違っている点等ありましたら指摘いただけると嬉しいです！
