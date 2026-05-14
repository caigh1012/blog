---
outline: deep
---

# 前端模块化发展历程

## 一、原始时代：全局函数和命名空间

全局函数：将不同功能拆成独立文件，通过 script 标签引入。所有函数和变量都挂在全局 `window` 下，极易引发命名冲突和依赖顺序混乱。

命名空间 (Namespace)：用单个全局对象来收拢变量，如 `var app = {}`。这减少了全局变量，但对象内部全可被外部随意修改，没有真正的私有性。

IIFE (立即执行函数表达式)：利用函数作用域实现私有成员，通过返回或挂载到 `window` 暴露接口。

```javascript
var moduleA = (function() {
  var count = 0; // 私有
  function inc() { count++; }
  return { inc };
})();
```

这解决了私有化问题，但依赖管理仍靠手动排 script 标签的顺序。

## 二、规范之争：CommonJS、AMD 与 CMD

### 2.1、CommonJS (CJS)

随着 Node.js 兴起，JavaScript 在非浏览器环境下迫切需要模块化规范。2009 年由 Mozilla 工程师提出，最初为服务端 JavaScript（尤其是 Node.js）设计。目的是让 JS 拥有简单、同步的模块机制——文件即模块，通过 `require()` 同步加载。

**优点**

- **语法简洁直观**：`require` / `module.exports` 学习成本低。
- **服务端天生适配**：从磁盘读取文件极快，同步加载不会阻塞。
- **NPM 生态基石**：海量 NPM 包均以 CJS 格式发布，生态极度繁荣。

**缺点**

- **同步加载不适用于浏览器**：网络加载慢，同步 `require` 会阻塞页面渲染。
- **无法静态分析**：`require` 是动态执行，依赖只能在运行时确定，不能做 Tree Shaking（打包工具可通过转换模拟，但非原生）。
- **拷贝输出**：运行时加载，导出的是**值的拷贝**。由于同步机制会阻塞浏览器，不适合在浏览器中直接使用。

### 2.2、AMD (Asynchronous Module Definition)

专为浏览器环境设计，解决 CJS 同步阻塞问题。代表实现为 RequireJS。核心思想是**依赖前置、异步加载**，模块和依赖可以并行下载，加载完成后执行回调。

**优点**

- **真正的浏览器异步加载**：不阻塞页面，支持并行下载，性能好。
- **依赖清晰**：`define(id?, deps, factory)` 声明依赖数组，一眼看清依赖关系。

**缺点**

- **写法较繁琐**：即使只需一个依赖，也要写在数组里，模块主体包在回调中。
- **依赖提前执行**：所有依赖在 factory 执行前就已加载并执行完毕，有时浪费资源。
- **生态萎缩**：ESM 普及后基本被替代。

```javascript
// 定义 math.js
define(function () {
  // 这是模块的工厂函数，返回的对象就是该模块暴露的接口
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;

  // 返回公共方法
  return {
    add,
    multiply,
  };
});


// print.js —— 依赖 math 模块
define(['math'], function (math) {
  const printSum = (x, y) => {
    console.log(`${x} + ${y} = ${math.add(x, y)}`);
  };

  const printProduct = (x, y) => {
    console.log(`${x} * ${y} = ${math.multiply(x, y)}`);
  };

  return {
    printSum,
    printProduct,
  };
});

require.config({
  baseUrl: './',
  paths: {
    math: 'math',
    print: 'print',
  },
});

require(['print'], function (print) {
  console.log('加载主模块1111');
  print.printProduct(4, 5);
});
```

### 2.3、 CMD (Common Module Definition)

代表实现为 Sea.js，由国内开发者玉伯提出。理念是**依赖就近、延迟执行**，让代码风格尽可能贴近 CJS，同时实现浏览器异步加载。

**优点**

- **写法自然**：使用 `define(function(require, exports, module) { ... })`，需要时再 `require`，像写同步代码。
- **按需执行**：依赖直到 `require` 时才执行，便于实现条件加载或懒加载。

**缺点**

- **性能开销**：需要先解析工厂函数体，提取 `require` 字符串依赖，再异步加载，加载时序不如 AMD 直观。
- **生态弱小**：社区和构建工具支持远逊于 AMD / CJS，现已极少使用。

```javascript
// 定义 math.js 模块
define(function (require, exports, module) {
  // 通过 exports 暴露接口
  exports.add = function (a, b) {
    return a + b;
  };

  exports.multiply = function (a, b) {
    return a * b;
  };
});

// print 模块
define(function (require, exports) {
  // 在需要依赖的地方直接 require
  var math = require('./math');

  exports.printSum = function (x, y) {
    var result = math.add(x, y);
    console.log(`${x} + ${y} = ${result}`);
  };
});

// main.js 使用
define(function (require, exports, module) {
  // 用到 print 时才加载
  var print = require('./print');

  // 使用它们
  print.printSum(1, 3);

  module.exports = {
    init: function () {
      console.log('应用启动了');
      console.log('Hello Sea.js');
    },
  };
});
```

## 三、桥梁与大一统：UMD 与 ES6 标准诞生

### 3.1、UMD (通用模块定义)

不是一个新模块规范，而是一段**兼容性包装代码**。目的是让同一个模块能在 CJS（Node）、AMD（RequireJS）以及浏览器全局变量三种环境下正常工作，常用于发布 JavaScript 库。

**优点**

- **极高的环境兼容性**：一套代码三端通用。
- **无缝集成**：使用者无需关心模块规范差异。

**缺点**

- **样板代码冗余**：模块顶部有大量 if-else 环境判断。
- **仅解决加载兼容，不改善模块能力**：既不提供静态分析，也不优化加载。

```javascript
/**
 * umd 的模块化为 amd 和 commonjs 的结合统一
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
})(this, function () {
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  return {
    add,
    multiply,
  };
});

// main.js 使用
const math = require('./math');
console.log(math.add(1, 2));
```

### 3.2、ES Modules (ES6 标准)

2015 年随 ES6 发布的官方标准化模块系统，目标是统一所有环境。使用 `import` 和 `export` 语法，具备**静态结构**，可在编译时确定依赖关系。现代浏览器和 Node.js 均已原生支持。

**优点**

- **静态可分析**：编译时就能确定依赖图，支持 Tree Shaking、作用域提升等优化。
- **原生浏览器支持**：`<script type="module">` 直接运行，自动采用异步方式（defer）。
- **实时绑定（引用）**：导出的是只读引用，模块内部值变化会反映到导入方。
- **支持动态导入**：`import()` 返回 Promise，用于按需加载。
- **标准化未来**：Web 生态的终极模块方案。

**缺点**

- **旧环境不兼容**：老浏览器、老 Node 版本不支持。
- **Node.js 互操作稍复杂**：导入 CJS 模块只能用默认导入，且 ESM 文件需 `.mjs` 或 `package.json` 配置，不能省略扩展名。
- **严格模式强制**：`this` 为 `undefined`，一些宽松写法的代码需要调整。

### 3.3、SystemJS

并不是规范，而是一个**通用动态模块加载器**。它可以在浏览器中动态加载几乎所有格式的模块（ESM、AMD、CJS、全局变量），并提供类似 ES 模块加载器的钩子能力。曾用于 Angular 2+ 早期版本，现在常配合 `import maps` 使用，作为浏览器原生 ESM 的补充。

**优点**

- **格式兼容性极强**：一个加载器搞定多种模块系统，适合微前端、多技术栈项目。
- **动态加载与转换**：支持模块翻译、缓存、映射等功能，配合 `import maps` 可在不打包时控制模块版本和路径。
- **模拟标准加载器**：提供了部分 ES 模块加载器 API 的 polyfill。

**缺点**

- **运行时开销**：要在浏览器端做模块解析、转换和加载，包体积大，性能不如预打包方案。
- **配置复杂**：学习曲线陡峭。
- **使用场景收窄**：原生 ESM + 打包工具（Webpack、Vite）已能满足多数需求，SystemJS 现在多用于特定动态加载或低构建工具场景。