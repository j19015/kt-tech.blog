---
id: "8j-1zj_s9qxm"
title: "【Ubuntu24.04LTS】DNS永続化設定"
category: "qrl6l2q0sxi4"
tags: ["plysj496gq"]
eyecatch: "https://images.microcms-assets.io/assets/555ee4c8c91a46b086ad4115bdd2aeb4/490327aa744f4e069c846527e6033429/ubuntu_dns.jpg"
createdAt: "2024-06-25T09:00:01.626Z"
updatedAt: "2024-06-25T09:43:46.084Z"
publishedAt: "2024-06-25T09:28:44.543Z"
---

## 概要
この記事ではUbuntu24.04LTSの初期設定の際のDNSの永続化設定の手順についてまとめています。

## 環境
Ubuntu: **24.04LTS**

仮想化: **UTM**

## 手順
この章では順番に手順を説明しています。

### systemd-resolvedのインストール

```
sudo apt update
sudo apt install systemd-resolved
```


### systemd-resolvedの起動

```
sudo systemctl start systemd-resolved
sudo systemctl enable systemd-resolved
```


### シンボリックリンクの確認

```
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```



### resolvectlコマンドの使用

```
resolvectl status
```



### DNS設定の編集

```
vi ~/etc/netplan/01-netcfg.yaml
```

`01-netcfg.yaml`というファイル名はもしかしたら違う可能性があるので、netplan配下にあるファイルを指定するようにしてください。


```
network:
  version: 2
  ethernets:
    enp0s1:
      dhcp4: yes
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4

```


### 権限設定

```
sudo chmod 600 /etc/netplan/01-netcfg.yaml
```



### Netplanの設定を再適用


```
sudo netplan apply
```


### 最終確認

```
resolvectl status

Global
         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
  resolv.conf mode: uplink

Link 2 (enp0s1)
    Current Scopes: DNS
         Protocols: +DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
       DNS Servers: 8.8.8.8 8.8.4.4 192.168.64.1 fe80::6c7e:67ff:fead:cf64

Link 3 (docker0)
    Current Scopes: none
         Protocols: -DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
```

## まとめ
DNSの設定って結構見落としがちでなんでうまく通信できないんだろう? みたいな原因は大抵ここら辺だなって設定してて思いました...
