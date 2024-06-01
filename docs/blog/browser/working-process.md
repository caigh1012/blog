---
id: workprocess
title: 浏览器解析HTML文档工作过程
description: 浏览器解析HTML文档工作过程
sidebar_label: 浏览器解析HTML文档工作过程
hide_title: true
---

## 一、解析Html文档工作过程

在浏览器没有完整接受全部HTML文档时，它就已经开始显示这个页面了，浏览器是如何把页面呈现在屏幕上的呢？不同浏览器可能解析的过程不太一样。

这里我们只介绍webkit的渲染过程，下图对应的就是WebKit渲染的过程，这个过程包括：

①、解析html以构建dom树 ，解析CSS 生成CSSOM树

②、将DOM树和CSSOM树结合 构建render（渲染）树

③、布局render树（Layout回流）：根据生成的渲染树，计算它们的在设备视口内的确切位置和大小，计算阶段称为**回流**

④、绘制render树（重绘） ：根据渲染树和回流得到几何信息进行渲染

![](https://gitee.com/caigh1012/assets/raw/main/blog/browser/webkit-render-flow.png)

过程分析：

1. 浏览器在解析html文件时，会”自上而下“加载，并在加载过程中进行解析渲染。在解析过程中，如果遇到请求外部资源时，如图片、外链的CSS、iconfont等，请求过程是**异步操作**的，并不会影响html文档进行加载。
1. 解析过程中，浏览器首先会解析HTML文件构建DOM树，然后解析CSS文件构建渲染树，等到渲染树构建完成后，浏览器开始布局渲染树并将其绘制到屏幕上。这个过程比较复杂，涉及到两个概念: reflow(回流)和repain(重绘)。
1. DOM节点中的各个元素都是以盒模型的形式存在，这些都需要浏览器去计算其位置和大小等，这个过程称为relow;当盒模型的位置,大小以及其他属性，如颜色,字体,等确定下来之后，浏览器便开始绘制内容，这个过程称为repain。
1. 页面在首次加载时必然会经历reflow和repain。reflow和repain过程是非常消耗性能的，尤其是在移动设备上，它会破坏用户体验，有时会造成页面卡顿。所以我们应该尽可能少的减少reflow和repain。

**当解析遇到script标签时**

`当文档加载过程中遇到js文件，html文档会挂起渲染（加载解析渲染同步）的线程，不仅要等待文档中js文件加载完毕，还要等待解析执行完毕，才可以恢复html文档的渲染线程。`因为JS有可能会修改DOM，最为经典的document.write，这意味着，在JS执行完成前，后续所有资源的下载可能是没有必要的，这是js阻塞后续资源下载的根本原因。所以我平时的代码中，js是放在html文档末尾的。

JS的解析是由浏览器中的JS解析引擎完成的，比如谷歌的是V8。JS是单线程运行，也就是说，在同一个时间内只能做一件事，所有的任务都需要排队，前一个任务结束，后一个任务才能开始。但是又存在某些任务比较耗时，如IO读写等，所以需要一种机制可以先执行排在后面的任务，这就是：同步任务(synchronous)和异步任务(asynchronous)。

JS的执行机制就可以看做是一个主线程加上一个任务队列(task queue)。同步任务就是放在主线程上执行的任务，异步任务是放在任务队列中的任务。所有的同步任务在主线程上执行，形成一个执行栈;异步任务有了运行结果就会在任务队列中放置一个事件；脚本运行时先依次运行执行栈，然后会从任务队列里提取事件，运行任务队列中的任务，这个过程是不断重复的，所以又叫做事件循环(Event loop)。

![](https://gitee.com/caigh1012/assets/raw/main/blog/browser/event_loop.png)

浏览器解析html文档过程分析图解：

![](https://gitee.com/caigh1012/assets/raw/main/blog/browser/html_render.png)

- 浏览器在拿到html文件时，浏览器在内存条中开辟一块栈内存，用来给html的代码提供环境；同时分配一个主线程去一行行的解析和执行代码
- 当浏览器遇到link/img/script等标签，请求后都会开辟全新的线程去加载资源
- 浏览器是多线程，js是单线程

## 二、拓展

### 2.1、`<script>`标签对DOM解析和渲染的影响

知道`<script>`标签的加载、解析和运行都会阻塞DOM的解析和渲染。这是因为js可以操作DOM，浏览器为了防止渲染过程出现不可预期的结果，让GUI渲染线程和js引擎线程互斥，即解析器在遇到`<script>`标记时会立即解析并执行(或请求）脚本。文档的解析将停止，直到脚本执行完毕后才会继续。

既然`<script>`标签都阻塞DOM的解析了，那肯定也会阻塞页面的渲染。阻塞渲染并不是页面不渲染，如果页面非要等到js加载执行完毕之后再渲染，那用户等待时间也太长了。浏览器的设计肯定会尽早让用户看到页面，因此遇到`<script>`标签时，会触发一次Paint，浏览器会将`<script>`标签之前的元素渲染出来。

以下案例分析：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="X-UA-Compatible"
      content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div>我是div111111</div>
    <script src="./test.js"></script>
    <div>我是div22222</div>
  </body>
</html>
```

对应的test.js

```js
console.log(Date.now());
for (let i = 0; i < 2000000000; i++) {
  let a = i;
}
console.log(Date.now());
```

运行结果：

![](https://gitee.com/caigh1012/assets/raw/main/blog/browser/js_jam.gif)

### 2.2、`<link>` 标签对DOM解析和渲染的影响

`<link>`标签不会阻塞DOM解析但会阻塞DOM渲染 , DOM的解析和CSSOM的解析是一个并行的过程。两者互不影响。两者解析完成之后，会合并生成render tree(渲染树)，之后就是layout和paint阶段，渲染到页面中。

### 2.3、`<link>`标签会阻塞js的执行

js运行时，有可能会请求样式信息，如果此时还没有加载和解析样式，js就有可能会得到错误的回复，产生很多问题。因此浏览器在`<link>`标签的加载和解析过程中，会禁止脚本运行。
