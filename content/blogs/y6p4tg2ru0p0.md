---
id: "y6p4tg2ru0p0"
title: "【Rails6】 既存AppにTailwindCSSを導入しよう!"
category: "qrl6l2q0sxi4"
tags: ["q1xemd6oh14c", "s9k7s5et-on8", "31vscoz_n"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/d2d6caae0fed48e2a02bc7c4eb6d883f/image%20(4).png"
createdAt: "2023-10-07T16:36:56.573Z"
updatedAt: "2023-11-28T12:18:45.586Z"
publishedAt: "2023-10-07T16:36:56.573Z"
---

# 概要
TailwindCSSをRailsに導入する方法について言及していきます。

# 1. 対象者

* **Rails6**の既存AppにTailwindCSSを導入したい方

# 2. 動作環境

## 端末
- PC : **MacBook Air(M1,2020)**

- RAM : **8GB**

- OS : **macOS Monterey(ver12.1)**

## バージョンなど

- Ruby : **3.1.2**

- Rails : **6.1.7**


# 3. 導入手順
こちらの章では導入手順について説明していきます。


>**前提**
公式のリファレンスを参考にしています。


https://tailwindcss.com/docs/guides/ruby-on-rails

## Gemfileに記述を追加
```ruby:Gemfile
gem 'tailwindcss-rails'
```

## bundle install
```shell:Terminal
bundle install
```

## TailwindCSSをinstall
```shell:Terminal
rails tailwindcss:install
```

## ファイルの確認
基本的にファイルが自動生成、記述が追加されますが、念のため確認をします。

```javascript:config/tailwind.config.js
 const defaultTheme = require('tailwindcss/defaultTheme')

 module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
 }

```
```scss:assets/stylesheets/application.tailwind.css
 @tailwind base;
 @tailwind components;
 @tailwind utilities;
```
```erb:views/layouts/application.html.erb
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag "tailwind", "inter-font", "data-turbo-track": "reload" %>

    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>

```

## アプリケーション再起動

>**注意点**
アプリケーション起動中のままの人は再起動してください。buildされるのでアプリケーション再起動後にはTailwindCSSが問題なく適用できるはずです。

```shell:Terminal
bin/dev
```

## classを適用
あとは自分が使いたい**TailwindCSS**のclassを適用させていくだけです。公式リファレンスで自分が適用したいclassを調べて実装してみましょう

https://tailwindcss.com



# 4. 参考文献

https://tailwindcss.com/docs/guides/ruby-on-rails


https://kt-tech.blog/blogs


<a id="#end"></a>
# 5. おわりに

今回の記事では、 **既存のアプリケーションににTailwindCSSを導入** をする方法について説明しました

もし興味を持っていただけましたら、ぜひ他の記事も読んでいただけるとうれしいです！

(最後に、気づいた方もいらっしゃると思うのですが、絵文字を入れるのは苦手なので、文章に沿った絵文字を挿入するのに、ChatGPTを利用させていただきましたが、いかがでしたでしょうか。不快に思われた方がいたら申し訳ございません)
