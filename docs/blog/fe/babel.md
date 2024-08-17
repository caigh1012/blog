---
title: Babel
description: Babel@7的使用
sidebar_label: Babel@7的使用
hide_title: true
---

## 一、babel的作用

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

- 语法转换（es-high -> es-lower）
- 通过 Polyfill 处理在目标环境无法转换的特性（通过 core-js 实现）
- 源码转换（codemods、jscodeshift）
- 静态分析（lint、根据注释生成 API 文档等）

## 二、命令行的基本使用

### 2.1、初次转换箭头函数

1. 安装 @babel/cli 和 @babel/plugin-transform-arrow-functions

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions @babel/cli
```

2. 配置script脚本

```json
  "scripts": {
    "arrow": "./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions",
  },
```

3. 执行命令

```js
// src/index.js
const fn = () => 1;

// converted to

// lib/index.js
('use strict');

var fn = function fn() {
  return 1;
};
```

执行结果：

![1664725792261](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664725792261.png)

### 2.2、使用babel配置文件

1. 创建 .babelrc.js

```js
module.exports = {
  presets: [],
  plugins: ['@babel/plugin-transform-runtime'],
};
```

2. 配置脚本和执行命令 `npm run babel`

```json
"scripts": {
    "babel": "./node_modules/.bin/babel src --out-dir lib",
 },
```

## 三、理解babel的作用和使用

1. 安装 @babel/core

```bash
npm i @babel/core -D
```

2. 在src/index.js配置代码

```js
const fn = () => 1;

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }
```

3. 然后执行`npm run babel`

![1664726696241](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664726696241.png)

参考如下图：

![./images/20221003001343.png](https://gitee.com/caigh1012/assets/raw/main/blog/babel/20221003001343.png)

发现此时并不会编译，并且在IE浏览器上课可能会存在兼容性问题。原因是扩展运算符并没有配置相关插件去进行相关转换，进到 Babel 插件页面 *https://www.babeljs.cn/docs/plugins-list* ，看需要什么插件能处理扩展运算符——可以看到这是一个 ES2018 的特性，通过 @babel/plugin-proposal-object-rest-spread[4] 插件就可以用啦。

安装 @babel/plugin-proposal-object-rest-spread 依赖包

```bash
npm i @babel/plugin-proposal-object-rest-spread -D
```

配置.babelrc.js

```js
{
    "plugins": ["@babel/plugin-proposal-object-rest-spread"]
}
```

编译后的结果：

![1664727156204](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664727156204.png)

同时此时还是会存在兼容性问题，IE浏览器不兼容解构赋值，需要安装 @babel/plugin-transform-destructuring

![](https://gitee.com/caigh1012/assets/raw/main/blog/babel/20221003001407.png)

安装 @babel/plugin-transform-destructuring

```bash
npm i @babel/plugin-transform-destructuring -D
```

编译后的代码：

![1664727695437](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664727695437.png)

再次看 IE浏览器的反应：

![](https://gitee.com/caigh1012/assets/raw/main/blog/babel/20221003002049.png)

## 四、优化babel的配置

### 4.1、 @babel/preset-env

> preset-env是一个智能预设，同时也是插件集合，配置了它就可以让你用es6+去书写你的代码，而且他会按需去加载所需要的插件

使用@babel/preset-env替换 @babel/plugin-transform-destructuring、@babel/plugin-proposal-object-rest-spread

```js
module.exports = {
  presets: [['@babel/preset-env']],
  plugins: [],
};
```

编译结果：
![1664728282764](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664728282764.png)

### 4.2、@babel/plugin-transform-runtime优化代码量

新建一个文件index2.js，

![1664729748797](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664729748797.png)

结果是 \_objectWithoutProperties 和 \_objectWithoutPropertiesLoose 居然都会重复声明两次。这对于需要转换的特性，我使用很多次，转换后输出的文件不是爆炸了么？此时需要一个插件来控制代码量——@babel/plugin-transform-runtime[14] 。对于这种转换函数，在外部模块化，用到的地方直接引入即可。

### 4.3、.babelrc.js配置

```js
module.exports = {
  presets: [['@babel/preset-env']],
  plugins: ['@babel/plugin-transform-runtime'],
};
```

编译结果：

![1664729954870](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664729954870.png)

## 五、配置 `@babel/polyfill `垫片

@babel/polyfill 模块包含 core-js 和一个自定义的 regenerator runtime 来模拟完整的 ES2015+ 环境。

这意味着你可以使用诸如 Promise 和 WeakMap 之类的新的内置组件、 Array.from 或 Object.assign 之类的静态方法、 Array.prototype.includes 之类的实例方法以及生成器函数（generator functions）（前提是你使用了 regenerator 插件）。为了添加这些功能，polyfill 将添加到全局范围（global scope）和类似 String 这样的原生原型（native prototypes）中。

### 5.1、安装 @babel/polyfill

```bash
npm install --save @babel/polyfill
```

🔔注意：使用 --save 参数而不是 --save-dev，因为这是一个需要在你的源码之前运行的 polyfill。

### 5.2、配置useBuiltIns

#### 5.2.1、useBuiltIns的配置

- usage： 每个文件引用使用到的特性；
- entry： 入口处全部引入

- false： 不引入

#### 5.2.2、在入口js进行引入`@babel/polyfill`

```js
const fn = () => 1;
import '@babel/polyfill';
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

const a = [1, 2, 3, 4, 6];
console.log(a.includes(7));
```

发现`@babel/polyfill`是弃用的，原因是babel在7.4.0之后就被弃用了。

![1664733961843](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664733961843.png)

官方文档的说明：

![1664734155346](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664734155346.png)

需要使用：

```js
import "core-js/stable"; 替换 import '@babel/polyfill';
```

此时无论设置`useBuiltIns`为何值时，都不起作用

![1664733981890](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664733981890.png)

#### 5.2.3、配置`core-js/stable`

index.js

```js
const fn = () => 1;
import 'core-js/stable';
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

const a = [1, 2, 3, 4, 6];
console.log(a.includes(7));
```

当useBuiltIns为entry时：

![1664735115854](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664735115854.png)

当useBuiltIns为usage时：

![1664735201539](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664735201539.png)

useBuiltIns为false时：

![1664735239981](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664735239981.png)

## 六、babel对模块化的处理

查看index.js

```js
const fn = () => 1;
import 'core-js/stable'; // import进行引入
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

const a = [1, 2, 3, 4, 6];
console.log(a.includes(7));
```

编译后的结果：

![1664768231207](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664768231207.png)

可以在preset-env的配置项中添加modules，其中modules的值：

- amd
- umd
- systemjs
- commonjs
- cjs
- auto
- false

modules当前设置为 false

![1664769336839](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664769336839.png)

## 七、babel在webpack中的使用

> 通常在webpack的使用，可以将转化后的模块保持ESM模块，让webpack可以做ESM模块的静态分析

### 7.1、webpack的配置

![1664773797505](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664773797505.png)

### 7.2、babel的配置

![1664773835792](https://gitee.com/caigh1012/assets/raw/main/blog/babel/1664773835792.png)
