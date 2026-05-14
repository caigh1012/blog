---
outline: deep
---

# 密码学

## 一、密码学介绍

### 1.1、信息交互

在日常生活时刻都保持对信息的获取，无论是网络获取的信息、书本、谈话的等信息。但是对于一些内容我们需要进行隐藏，不允许他人轻易获取，一般就会进行加密处理。这也是密码学一直发展的初衷。

### 1.2、密码学概述

密码学是一门研究如何保护信息安全的学科，实现信息的 `机密性（Confidentiality）`、`完整性（Integrity）`、`认证性（Authentication）` 和 `不可否认性`

密码学中有两个基本操作，一是加密，将可读的原始信息（明文）通过一种算法和密钥转换为不可读的乱码的过程，二是解密，将密文恢复为明文的逆过程

## 二、密码学发展

密码学的发展史是一部人类智慧的斗争史，大致可分为三个阶段：

| 阶段       | 代表性加密方式                 |
| ---------- | ------------------------------ |
| 古典密码学 | 替换法、移位法                 |
| 近代密码学 | 恩尼格玛机、二战时的电台破译   |
| 现代密码学 | 散列函数、对称密码、非对称密码 |

## 三、散列算法

Hash Algorithm 翻译成中文为 "哈希算法" 和 "散列算法"，它们指的是完全相同概念。

哈希算法是一种单向加密算法，通常用于生成数据的摘要。

工作原理：接收任意长度的输入数据，通过一个复杂数据函数，生成一个固定的长度、看似随机的字符串（哈希值）。

| 特性     | 说明                                                     |
| -------- | -------------------------------------------------------- |
| 单向性   | 从哈希值无法反推出原始数据                               |
| 确定性   | 相同的输入永远产生相同的输出                             |
| 雪崩效应 | 输入数据哪怕只改变一个比特，输出的哈希值也会发生巨大变化 |
| 抗碰撞性 | 极难找到两个不同的输入产生相同的哈希值                   |

常见的哈希算法有 md5、sha256、sha224、sha512、sha1、sha3 等

node.js 使用示例如下

```javascript
const md5 = require('crypto-js/md5');
const sha256 = require('crypto-js/sha256');
const sha224 = require('crypto-js/sha224');
const sha512 = require('crypto-js/sha512');
const sha1 = require('crypto-js/sha1');
const sha3 = require('crypto-js/sha3');

/**
 * 哈希算法
 */
// md5
console.log(md5('Hello, World!').toString()); // 65a8e27d8879283831b664bd8b7f0ad4
console.log(md5('Hello, JavaScript!').toString()); // 2aa85bcad7a0eb60a93bfb7536cbb96a

// sha256
console.log(sha256('Hello, World!').toString());
console.log(sha256('Hello, JavaScript!').toString());

// sha224
console.log(sha224('Hello, World!').toString());
console.log(sha224('Hello, JavaScript!').toString());

// sha512
console.log(sha512('Hello, World!').toString());
console.log(sha512('Hello, JavaScript!').toString());

// sha1
console.log(sha1('Hello, World!').toString());
console.log(sha1('Hello, JavaScript!').toString());

// sha3
console.log(sha3('Hello, World!').toString());
console.log(sha3('Hello, JavaScript!').toString());
```

## 四、对称加密

对称加密算法使用相同的密钥进行加密和解密，常见的对称加密有 DES、AES。

DES：数据加密标准，是一种使用密钥加密的块算法，1977年被美国联邦政府的国家标准局确定为联邦资料处理标准（FIPS），并授权在非密级政府通信中使用，随后该算法在国际上广泛流传开来。

AES 高级加密标准 .在密码学中又称Rijndael加密法，是美国联邦政府采用的一种区块加密标准。这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。

DES 目前已经很少用到，因为其已被破解不做安全，基本都是 AES 替代 DES 的使用，也是全球标准。

node.js 使用示例如下

```javascript
const CryptoJS = require('crypto-js');
const aes = require('crypto-js/aes');

/**
 * 对称加密
 */
// 密钥
const secretKey = 'secret key 123';

// 加密
const ciphertext = aes.encrypt('my message', secretKey).toString();

// 解密
const bytes = aes.decrypt(ciphertext, secretKey);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText);
```

对称加密缺陷：由于加密需要密钥所以密钥必须分发出去，分发出去的过程会发生密钥泄漏的风险，密钥被泄漏之后就存在安全问题。

## 五、非对称加密

非对称加密解决了密钥分发问题，但速度慢。

使用一对数学上相关的密钥：`公钥 (Public Key)` 和 `私钥 (Private Key)`。公钥可以公开给任何人，私钥必须严格保密。

公钥进行加密信息，对应的私钥进行解密信息

node.js 使用示例如下

```javascript
const JSEncrypt = require('jsencrypt');

const crypt = new JSEncrypt();

const originalText = 'Hello, World!';

// ---------------公钥加密过程--------------------

// 公钥
const publicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJE/EhmzxTdPFc8daSCzmIlAu8uN1O+Y
6l0DEEDC8SBX2r4bTEAXNgvJqnj7nPXWd601SfRF0E5yUqrLbo7yzZkCAwEAAQ==
-----END PUBLIC KEY-----
`;

crypt.setPublicKey(publicKey);

const encrypted = crypt.encrypt(originalText);

// ---------------私钥解密过程--------------------

// 私钥
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAkT8SGbPFN08Vzx1p
ILOYiUC7y43U75jqXQMQQMLxIFfavhtMQBc2C8mqePuc9dZ3rTVJ9EXQTnJSqstu
jvLNmQIDAQABAkBTQyWcKErY7vQgm8qFHY9Gtx4wjSjRBQbstPHfPiE+GVvlk+Kj
Q1J/Eg9mIaesGRkNF+ZlLx3Ty/GB1o/oX6UBAiEA8twdMr6EjlJ0WaLH006KJumo
w/c+oDzHYV8g3kGhzmECIQCZGuYbCc7aUrAxTnNrXHzDTt02hX27q7BmCySPCrYa
OQIgGNyJrKkuPreYK5jrZelTYTpoSW9lHNg7/O7VGYuUeeECIHcFPSp5xm9cZpH9
/aXRgT/HWBqhTawN/RRmxyXX2tapAiByZ8Fklk1VltFcaBorSbvK0/kracQLAtEf
f9igqsXIbQ==
-----END PRIVATE KEY-----`;

crypt.setPrivateKey(privateKey);

// 解密
const decrypted = crypt.decrypt(encrypted);

console.log('Original:', originalText);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
console.log('Match:', originalText === decrypted); // true
```

## 六、Base64

Base64 不属于加密，它不属于散列函数、对称加密、非对称加密种的任何一种。Base64 是一种编码方式，类似 ASCll 编码，而不是加密算法。

### 6.1、Base64产生背景

早期的互联网世界，很多核心协议（如 SMTP（电子邮件）、NNTP（新闻组））都是在 7 位 ASCll 编码的基础上设计的。这些系统只能可靠地处理 128 个字符（包括英文字母、数字和一些控制字符）。但是计算机数据远不止文本，还有图片（.png、.jpg）、可执行文件（.exe）、压缩包、音视频等文件。这些文件都是二进制数据，其中包含大量不在可打印 ASCII 范围内的值（例如 `0x00` ~ `0x1F` 这样的控制字符，或 `0xFF` 这样的值）。

如果直接在这些文本系统传输二进制数据，就会引发灾难。例如：

1. 控制字符被误解：许多控制字符在传输协议中有特殊含义。例如：
   - `0x00` (NULL)：可能被解释为字符串结束符。
   - `0x0A` (Line Feed - LF) / `0x0D` (Carriage Return - CR)：表示换行。如果一个二进制文件包含这些字符，会导致传输协议错误地认为一行结束，从而 `破坏数据的完整性`。
   - `0x1B` (ESC)：转义字符，可能会触发接收端的特殊模式。
2. 编码不一致：不同的系统可能使用不同的字符编码（如 EBCDIC）。一个在 ASCII 上可行的二进制流，在另一个编码系统上可能变成一堆乱码。
3. 设备处理问题：一些古老的硬件设备可能无法正确处理 8 位数据，最高位可能会被丢弃。

### 6.2、Base64目的和流程

Base64 的目的是转换数据格式，使其能够安全地在特定系统中传输或存储。并且是可逆的，编码后的数据可以毫无损失地解码回原始形式，不需要密钥。

编码流程：原始数据（二进制）> Base64 编码算法 > Base64 文本（可打印的ASCII字符）

解密流程：Base64 文本 > Base64 解码算法 > 原始数据 (二进制)

### 6.3、现代常见应用场景

| 使用场景                     | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| Data URLs                    | 将图片等资源直接嵌入到 HTML 或 CSS 文件中，减少 HTTP 请求。`src="data:image/png;base64,iVBORw0KGgo..."` |
| 在 JSON/XML 中传输二进制数据 | JSON 是文本格式，如果要传输文件内容，必须先将其编码为 Base64 字符串。 |
| 电子邮件附件                 | 虽然现代邮件系统已能处理二进制，但 Base64 仍是编码附件的标准方式之一。 |
| 存储加密后的二进制数据       | 加密后的密文是二进制，有时为了便于存储（比如存在数据库的文本字段里），会先进行 Base64 编码。 |
| 简单的混淆                   | 只是让数据看起来不像明文而已，任何人都可以轻松解码。注意：这不能替代加密！ |

