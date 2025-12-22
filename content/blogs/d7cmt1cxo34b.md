---
id: "d7cmt1cxo34b"
title: "【AWS】Lamdaを用いて、Route53にAレコードを登録する"
category: "qrl6l2q0sxi4"
tags: ["kc0jht4q38fj", "czf8co3f78", "bxmo2y8plp"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/2e2f2f5d94dc4a7db734199396e9c403/aws_logo_smile_1200x630.png"
createdAt: "2023-10-06T09:40:40.147Z"
updatedAt: "2023-11-28T12:17:30.975Z"
publishedAt: "2023-10-06T09:40:40.147Z"
---

# 概要

今回は、「**Lamdaを用いて、Route53にAレコードを登録する**」というテーマで記事を書いてみました。

# 1. 対象者

-  **Lamda**を使用したことがある方
-  **Route53**を使用したことがある方。
-  **Lamda**を用いて**Route53**にAレコードを登録したい方


>**本記事について**
下記のように取得してあるドメインにAレコードを登録していきます。
用途としては、**IPアドレスを固定にできない時**などです。
(例)**127-0-0-1.example.com**
(例)**127-0-0-2.example.com**

# 2. 動作環境

**AWS Console**に入れれば問題ないです。

# 3. 前提条件

**Route53**でドメインを取得してあること。

# 4. 導入手順

## Lamdaを作成する
あまり経験がない方は公式リファレンス等参照いただけると良いと思います。

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/getting-started.html


>**注意点**
`index.mjs`->`index.js`に変更しておいて下さい


### Roleについて
**Lamda**にアタッチする`Role`には`AmazonRoute53FullAccess`のポリシーを付与しておいて下さい。付与されていないと**Aレコードを作成する権限**がなく、エラーになります。

### Lamdaの処理
```js
const { Route53Client, ChangeResourceRecordSetsCommand } = require("@aws-sdk/client-route-53");

exports.handler = async function (event, context) {
    // Route53への接続
    const route53 = new Route53Client();

    // 変更を行うドメイン名とhostedzoneIDを入力
    const hostedZoneId = '********';
    const recordName = 'example.com';

    // IPアドレスを取得
    const newIpAddress = event.body.address;

    //レコード名を作成('.'->'-'へ正規化した上で結合)
    const newRecordName=newIpAddress.replace(/\./g, '-')+'.'+recordName

    // Aレコードの変更リクエストを作成
    const changeBatch = {
        Changes: [
            {
                Action: 'UPSERT',
                ResourceRecordSet: {
                    Name: newRecordName,
                    Type: 'A',
                    TTL: 300,
                    ResourceRecords: [
                        { Value: newIpAddress }
                    ]
                }
            }
        ]
    };

    // レコードの変更を実行
    try {
        const command = new ChangeResourceRecordSetsCommand({
            HostedZoneId: hostedZoneId,
            ChangeBatch: changeBatch
        });

        const response = await route53.send(command);

        console.log(response);

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        };
    }
};

```

## testを実行する。
今回は、送られてきたIPアドレスの`.`->`-`に変換した文字列を、ドメインの頭につける形で**Aレコード**を登録します。
- 下記のjsonでテストを行います。
```json
{
  "body": {
    "address": "127.0.0.1"
  }
}
```

## 実行結果の確認

**Route53**で自分が選択した**ホストゾーン(exaple.com)** に **Aレコード**が下記のように登録されていたらOKです。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/aa3646ba-f6fb-725f-af3f-f991375a7a15.png)




# 5. 参考文献

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/getting-started.html

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/route-53/command/ChangeResourceRecordSetsCommand/


# 6. おわりに

今回の記事では、 **LamdaでRoute53にAレコードを登録** してみたい時に、Lamdaにどんな処理を書けばいいのか記述をしました。

今回の内容を応用すれば、**IPアドレスの変更等を検知した場合**や、**EC2の起動を検知した場合**などに、**Aレコードを新しく登録**もしくは**更新する**などもできると思います。
