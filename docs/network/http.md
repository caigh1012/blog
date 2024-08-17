---
title: Http
description: Http缓存
sidebar_label: Http缓存
hide_title: true
---

## 一、浏览器缓存大概的种类

1.  **http缓存**是基于HTTP协议的浏览器文件级缓存机制。
1.  **websql** 这种方式只有较新的chrome浏览器支持，并以一个独立规范形式出现
1.  **indexDB** 是一个为了能够在客户端存储可观数量的结构化数据，并且在这些数据上使用索引进行高性能检索的 API
1.  **Cookie**一般网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密）
1.  **Localstorage**html5的一种新的本地缓存方案，目前用的比较多，一般用来存储ajax返回的数据，加快下次页面打开时的渲染速度
1.  **Sessionstorage**和localstorage类似，但是浏览器关闭则会全部删除，api和localstorage相同，实际项目中使用较少。
1.  **application cache** 是将大部分图片资源、js、css等静态资源放在manifest文件配置中
1.  **cacheStorage**是在ServiceWorker的规范中定义的，可以保存每个serverWorker申明的cache对象
1.  **flash缓存** 这种方式基本不用，这一方法主要基于flash有读写浏览器端本地目录的功能

## 二、http缓存原理

> http缓存是针对静态资源

### 2.1、缓存过程分析

浏览器与服务器通信的方式为应答模式，即是：**浏览器发起HTTP请求 – 服务器响应该请求**。那么浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中HTTP头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中，简单的过程如下图：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685367504-c53227.png)

由上图我们可以知道:

- 浏览器每次发起请求，都会在浏览器缓存中查看该请求的结果以及缓存标识
- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

以上两点结论就是浏览器缓存机制的关键，他确保了每个请求的缓存存入与读取，只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了，本文也将围绕着这点进行详细分析。

### 2.2、强制缓存和协商缓存

#### 2.2.1、强制缓存

**强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程**，强制缓存的情况主要有三种(暂不分析协商缓存过程)

(1)、不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求，如下图:

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366493-3d1de2.png)

(2)、存在该缓存结果和缓存标识，但是结果已经失效，强制缓存失效，则使用协商缓存（暂不分析），如下图 :

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366365-068016.png)

(3)、存在该缓存结果和缓存标识，且该结果没有还没有失效，强制缓存生效，直接返回该结果，如下图：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366371-926e49.png)

强制缓存的缓存的规则

当浏览器向服务器发送请求的时候，服务器会将**缓存规则**放入HTTP响应的报文的HTTP头中和请求结果一起返回给浏览器，**控制强制缓存的字段分别是Expires和Cache-Control**，其中Cache-Conctrol的优先级比Expires高。

**Expires与Cache-Control讲解**

①、**Expires**

Expires是HTTP/1.0控制网页缓存的字段，其值为服务器返回该请求的结果缓存的到期时间，即再次发送请求时，如果客户端的时间小于Expires的值时，直接使用缓存结果。

Expires是HTTP/1.0的字段，但是现在浏览器的默认使用的是HTTP/1.1，那么在HTTP/1.1中网页缓存还是否由Expires控制？

到了HTTP/1.1，Expires已经被Cache-Control替代，原因在于Expires控制缓存的原理是使用**客户端的时间**与**服务端返回的时间**做对比，如果客户端与服务端的时间由于某些原因（时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存直接失效，那么强制缓存存在的意义就毫无意义。

②、**Cache-Control**

在HTTP/1.1中，Cache-Control是最重要的规则，主要用于控制网页缓存，主要取值为：

（1）**public**：所有内容都将被缓存（客户端和代理服务器都可缓存）

（2）**private**：所有内容只有客户端可以缓存，**Cache-Control的默认取值**

（3）**no-cache**：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定

（4）**no-store**：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

（5）**max-age=xxx (xxx is numeric)**：缓存内容将在xxx秒后失效

案例：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366376-9f4a18.png)

由上面的例子我们可以知道：

- HTTP响应报文中expires的时间值，是一个绝对值

- HTTP响应报文中Cache-Control为max-age=600，是相对值

由于Cache-Control的优先级比expires，那么直接根据Cache-Control的值进行缓存，意思就是说在600秒内再次发起该请求，则会直接使用缓存结果，强制缓存生效。

🔔注意：在无法确定客户端的时间是否与服务端的时间同步的情况下，Cache-Control相比于expires是更好的选择，所以同时存在时，只有Cache-Control生效。

#### 2.2.2、协商缓存

**协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程**，主要有以下两种情况：

(1)、协商缓存生效，返回304，如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366382-fb87e4.png)

(2)、协商缓存失败，返回200和请求结果，如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366386-445841.png)

同样，协商缓存的标识也是在响应报文的HTTP头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：**Last-Modified / If-Modified-Since和Etag / If-None-Match**，其中Etag / If-None-Match的优先级比Last-Modified / If-Modified-Since高。

**Last-Modified / If-Modified-Since**

①、Last-Modified是服务器响应请求时，返回该资源文件在服务器最后被修改的时间，如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366392-5efbb2.png)

②、If-None-Match是客户端再次发起该请求时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200，如下：
![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366397-21ebd4.png)

**Etag / If-None-Match**

①、Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366401-2dd391.png)

②、If-None-Match是客户端再次发起该请求时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200，如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366404-d28e88.png)

<span className="highlight">附注：</span>Etag / If-None-Match优先级高于 Last-Modified / If-Modified-Since，同时存在则只有 Etag / If-None-Match 生效。

#### 2.2.3、总结：

强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存( Last-Modified / If-Modified-Since 和 Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回304，继续使用缓存，主要过程如下：

![](https://gitee.com/caigh1012/assets/raw/main/network/http-cache/2023-05-29-1685366409-013572.png)
