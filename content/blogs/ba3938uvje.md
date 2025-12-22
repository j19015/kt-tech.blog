---
id: "ba3938uvje"
title: "【Next.js】リンクカードの実装方法について"
category: "qrl6l2q0sxi4"
tags: ["3linszp5x1", "c3p3elg95"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/9af2277c26f64f53923b5c117c649dc0/link_card.png"
createdAt: "2023-11-30T15:15:46.423Z"
updatedAt: "2024-02-14T18:40:00.979Z"
publishedAt: "2023-11-30T15:45:44.493Z"
---

# 概要
Next.jsで作成したブログにリンクカードを実装する方法についてメモを残しておきます。今回は、server actionsを利用してサーバサイドでリンクカードを生成しておく方法を用いました。あまり参考になるリファレンスがなく苦労しました...

# 環境
- Next.js 13.4.5
- App Routerを採用

# 実装手順

まずは、OGPデータを取得するメソッドを定義しておきます。

```javascript:page.tsx
async function fetchOGPData(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const getMetaTag = (name :string) => {
    return (
      $(`meta[name=${name}]`).attr('content') ||
      $(`meta[property="og:${name}"]`).attr('content') ||
      $(`meta[property="twitter:${name}"]`).attr('content')
    );
  };

  return {
    title: getMetaTag('title'),
    description: getMetaTag('description'),
    image: getMetaTag('image'),
  };
}
```

server actionsで実行するコードを記述します。

```javascript:page.tsx
html = "ブログの内容をHTML形式に変換したものを代入";

const parse_body = cheerio.load(html);

// 全てのリンク要素を取得
const Links: string[] = [];
parse_body('a').each((_, link) => {
  const href = parse_body(link).attr('href');
  Links.push(href);
});

// 各リンクのOGPデータを非同期で取得
// 効率化のため並列実行
const ogpDataPromises = Array.from(Links).map((href) => fetchOGPData(href));
const ogpDataResults = await Promise.all(ogpDataPromises);

// hrefとOGPデータをマッピング
const hrefToOgpData = new Map();
Array.from(uniqueLinks).forEach((href, index) => {
  hrefToOgpData.set(href, ogpDataResults[index]);
});

// リンクカードの生成とHTMLの更新
parse_body('a').each((_, link) => {
  const href = parse_body(link).attr('href');
  if (!href || href.startsWith('#')) {
    return;
  }

  const meta = hrefToOgpData.get(href);
  const linkCardHTML = `
    <div class="link-card mt-3 mb-3">
      <a href="${href}" target="_blank" rel="noopener noreferrer">
        <div class="link-card-body">
          <div class="link-card-info">
            <div class="link-card-title">${meta.title}</div>
            <div class="link-card-url">${href}</div>
          </div>
          <img src="${meta.image}" class="link-card-thumbnail" />
        </div>
      </a>
    </div>
  `;

  parse_body(link.parent).replaceWith(linkCardHTML);
});
```

CSSに記述を追加。
デザイントークンの場合は適宜変更をお願いします。
```css:global.css
.link-card {
  -webkit-box-align: center;
  border: 0.3px solid rgb(var(--foreground-rgb));
  border-radius: 8px;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  overflow: hidden;
  text-decoration: none;
  word-break: break-all;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.link-card > a{
  color: rgb(var(--foreground-rgb));
  width: 100%;
}

.link-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.link-card-body {
  display: flex;
  justify-content: space-between;
}

.link-card-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.0rem;
  flex: 1;
}

.link-card-title {
  color: var(--color-text-high-emphasis);
  display: -webkit-box;
  font-weight: 600;
  font-size: 1.0rem;
  line-height: 1.5;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.link-card-url {
  color: var(--color-text-high-emphasis);
  display: -webkit-box;
  font-size: 12px;
  line-height: 1.8;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}


.link-card-thumbnail {
  border-left: 1px solid var(--color-divider);
  flex-shrink: 0;
  object-fit: cover;
  width: 270px;
  margin: 0;
}

.link-card-body > img {
  border-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 110px;
}

@media (max-width: 768px){
  .link-card-thumbnail {
    width: 220px;
  }
}

@media (max-width: 479px){
  .link-card-thumbnail {
    width: 110px;
  }
}
```

# 表示結果
このような感じで表示されていれば問題ないです。

https://kt-tech.blog

# おわりに
markdown->htmlに変換するときにリンクにpタグがついてしまう問題に対処するのに2,3時間かかりました。
解決方法は、aタグの親要素ごと入れ替えてあげればいいことだったので同じことをする人には気をつけてもらいたいです。
