---
id: "hm15jb5jyfp2"
title: "【JS】便利なconsoleメソッドについて"
category: "rsrbb9276"
tags: ["dxdk1txguz"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/652f8262b96e494196e17ab5e5e492c3/ariticle_console.jpg"
createdAt: "2024-04-01T03:20:57.295Z"
updatedAt: "2024-04-01T09:29:45.394Z"
publishedAt: "2024-04-01T03:23:40.675Z"
---

# 概要
こちらの記事は勉強会にて発表を行うための資料になっております。
Qiitaにて拝見させていただいた下記の記事をもとに、自分なりの解釈を加え記事を作成しています。
自分は、`console.log("~~~~~")`しか基本的に使うことがないので、初めての情報に目から鱗状態でした！

https://qiita.com/S4nTo/items/453b5e6ee933765211ec#%E7%9C%81%E7%95%A5%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%B3%E3%82%BD%E3%83%BC%E3%83%AB%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89

# 対象者
対象者は下記のような方々になります。

- JavaScriptを用いたことがある方。
- `console.log`等を用いてログの出力を行ったことがある方。


# 本文
ここからが本文です。実際にどんな`console`メソッドの使い方があるのかをみていきます。

## console.log()
個人的にはこれをよく使います（というかこの形式しか知らなかった.....）

```javascript:index.js
console.log("ログを出力しています。");
console.log(10000);
console.log(true);
```

## console.log("",CSS)
第二引数にCSSプロパティをくわえてあげることで、出力する内容を装飾することができるみたいです。
```javascript:index.js
console.log("%ckt-tech.blog","background-color: blue; color: white; padding: 20px;");
```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdvgd000003b6qpq05o315.png)

個人的にはエンタメ系のWebサービスなどの検証ツールに使ってエンドユーザにより楽しんでもらうために使ってもらえたらいいんじゃないかと思いいました。


## console.table()

console.table()は表形式のデータ(配列やオブジェクト)をコンソール上において表で出力を行ってくれます。

```javascript:index.js
console.table({
    'Date': new Date().getFullYear(),
    'platform': 'Qiita',
    'post1': 'blog1',
});
```
上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdvrt300013b6q9gqp2jg5.png)

データが大量にある時にexcelにまとめて見たいな〜と思う時があるのでそういう時に一旦`console.table`に頼ってみるのもありかもと思いました。


## console.group()
console.groupを使用するとメッセージをグループ化して、インデントして表示することができます。
まとめたいものをconsole.group()とconsole.groupEnd()で囲むことにより実現できます。

```javascript:index.js
console.group("処理1");
console.log("処理1の内容です。");
console.log({"message":"成功です。"});
console.groupEnd()


console.group("処理2");
console.log("処理2の内容です。");
console.log({"message":"成功です。"});
console.groupEnd()

```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdw1ny00023b6qzabpb9o4.png)

並列実行してる関数毎にまとめて出力できたりしたら便利だな〜と思いました。
最近並列実行を意識して開発しているのでぜひ使いたい！

## console.dir()
console.dir()を使用するとオブジェクトのプロパティを一覧形式でコンソールに表示することができます。
オブジェクトの構造や中身を探索する際に役立てることができます。

```javascript:index.js
const user = {
  name: "kt",
  age: 23,
  address: {
    city: "Shizuoka",
    country: "Japan"
  }
};

console.dir(user);
```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdwggq00033b6q68q7s3yo.png)

個人的には`console.log()`の使い勝手とあまり変わらないので今の所の使い所は思いつかないです。
DOMツリーとかの表示に使うという記事をいくつか見たので今後やって見て便利さを実感して見たいと思います。


## console.time()
console.time()を使用すると処理にかかる時間を計測することができます。
使い方は簡単で、console.time();とconsole.timeEnd();で計測したい箇所を挟んで上げれば計測を行うことができます。

```javascript:index.js
console.time("test1")

let i=1;
while(i>10000){
	i++;
}

console.timeEnd("test1");
```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。

![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdwovg00043b6qxfmhy454.png)

実行時間みたい時とか結構あるのでこれはとてもありがたい。

## console.count()
呼び出された回数を記録するメソッドで関数や変数が呼び出された回数を記録して呼び出される度に出力を行います。

```js:index.js
function exampleFunction() {
  console.count('Function call count');
}

for (let i = 0; i < 5; i++) {
  exampleFunction();
}
```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。


![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdwvam00053b6qojv0gy1q.png)

内部的には変数を作成してそこに毎回インクリメントしているのだと思うが、繰り返しの数を別で使いたい時もあるので、個人的には変数を作って毎回インクリメントする方法の方が好きかも....という気持ち



## console.error()
エラーメッセージを出力できます。
コンソール上では赤色で表示されます。

```javascript:index.js
console.error("これはerrorです。");
```

上記のコードをブラウザの検証ツール等にて実行してみてください。
下記のように表示されるはずです。


![](https://pub-9d03846db4364486bb0806774184931a.r2.dev/images/clugdx01p00063b6qmsugbgi0.png)

最近よく使っています。エラーログがわかりやすくなるのでデバッグがしやすくなる印象です。


## console.warn()
cosole.warn()はコンソールに警告メッセージを出力するのに用います。
潜在的な問題や注意が必要な状況を知らせるのに用います。

```javascript:index.js
console.warn("これは警告です。");
```
コンソール上では黄色で表示されます。



これはあまり使っていませんでしたが、エラーとの対比で今後使って見たいと思います。

# 参考文献

https://qiita.com/S4nTo/items/453b5e6ee933765211ec#%E7%9C%81%E7%95%A5%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%B3%E3%82%BD%E3%83%BC%E3%83%AB%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89

# さいごに
よく使う`console`メソッドでしたが知らないオプションが多々あったので今後活用していきたいと思いました。
最後まで、ご覧いただきありがとうございます。
