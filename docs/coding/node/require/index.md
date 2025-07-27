---
outline: deep
---

# require模块加载机制

## 一、模块类型和加载顺序

### 1.1、模块类型

Node.js 的模块有好几种类型，前面我们使用的其实都是 文件模块，总结下来，主要有这两种：

内置模块：就是 Node.js 原生提供的功能，比如 fs， http 等等，这些模块在 Node.js 进程起来时就加载了。

文件模块：我们前面写的几个模块，还有第三方模块，即 node_modules 下面的模块都是文件模块。

### 1.2、加载顺序

加载顺序是指当我们 require(X) 时，应该按照什么顺序去哪里找 X，在官方文档上有详细伪代码，总结下来大概是这么个顺序：

1. 优先加载内置模块，即使有同名文件，也会优先使用内置模块。
2. 不是内置模块，先去缓存找。
3. 缓存没有就去找对应路径的文件。
4. 不存在对应的文件，就将这个路径作为文件夹加载。
5. 对应的文件和文件夹都找不到就去 node_modules下面找。
6. 还找不到就Error了。

### 1.3、加载文件夹

前面提到找不到文件就找文件夹，但是不可能将整个文件夹都加载进来，加载文件夹的时候也是有一个加载顺序的：

1. 在这个文件夹下面有没有 package.json，如果有就找里面的 main 字段， main 字段有值就加载对应的文件。所以如果大家在看一些第三方库源码时找不到入口就看看他 package.json 里面的 main 字段吧，比如 jquery 的 main 字段就是这样： "main":"dist/jquery.js"。
2. 如果没有 package.json 或者 package.json 里面没有 main 就找 index 文件。

### 1.4、支持的文件类型

| 支持的文件类型 | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| .js            | .js文件是我们最常用的文件类型，加载的时候会先运行整个JS文件，然后将前面说的 module.exports作为 require的返回值。 |
| .json          | .json文件是一个普通的文本文件，直接用 JSON.parse将其转化为对象返回就行。 |
| .node          | .node文件是C++编译后的二进制文件，纯前端一般很少接触这个类型。 |

## 二、require的实现原理

### 2.1、\_Module类

Node.js 模块加载的功能全部在 Module 类里面，整个代码使用面向对象的思想，如果你对JS的面向对象还不是很熟悉可以先看看这篇文章。 Module 类的构造函数也不复杂，主要是一些值的初始化，为了跟官方 Module 名字区分开，我们自己的类命名为 \_Module

```js
// 定义一个构造函数MyModule, 这里区分node的Module类, 使用MyModule进行命名
function _Module(id = '') {
  this.id = id; // 这个id其实就是我们require的路径
  this.path = path.dirname(id); // path是Node.js内置模块，用它来获取传入参数对应的文件夹路径
  this.exports = {}; // 导出的东西放这里，初始化为空对象
  this.filename = null; // 模块对应的文件名
  this.loaded = false; // loaded用来标识当前模块是否已经加载
}
```

### 2.2、require方法

```js
// require其实是Module类的一个实例方法
_Module.prototype.require = function (id) {
  // id 为文件路径
  return _Module._load(id);
};
```

### 2.3、\_ Module.\_load

\_ Module.\_load 是一个静态方法，这才是 require 方法的真正主体，作用：

1. 先检查请求的模块在缓存中是否已经存在了，如果存在了直接返回缓存模块的 exports。
1. 果不在缓存中，就 new 一个 Module 实例，用这个实例加载对应的模块，并返回模块的 exports。

```js
// 缓存的模块存储在 Module._cache 这个静态变量上
_Module._cache = Object.create(null);

// _Module._load 是一个静态方法, 这是 require 的真正主体
// 它的作用:
// 1. 先检查请求的模块在缓存中是否存在了, 如果存在了直接返回缓存模块的 exports.
// 2. 如果不在缓存中, 就 new 一个 Module 实例, 用这个实例加载对应的模块, 并返回模块的 exports

_Module._load = function (request) {
  // request 是我们传入的路径参数
  const filename = _Module._resolveFilename(request); // 获取绝对路径

  // 先检查缓存, 如果缓存存在且已经加载, 直接返回缓存
  const cacheModule = _Module._cache[filename];
  if (cacheModule !== undefined) {
    return cacheModule.exports;
  }

  // 如果缓存不存在, 我们就加载这个模块. 加载前先 new 一个 _Module 实例,然后调用实例方法 load 加载. 加载完成直接返回 module.exports
  const module = new _Module(filename);
  _Module._cache[filename] = module;
  // load 之前就将这个模块缓存下来, 这样如果有循环引用就会拿到这个缓存, 但是这个缓存里面的 exports 可能还没有或者不完整
  module.load(filename);
  return module.exports;
};

// _Module.prototype.load 是一个实例方法，这个方法就是真正用来加载模块的方法，这其实也是不同类型文件加载的一个入口，
// 不同类型的文件会对应 _Module._extensions 里面的一个方法：
_Module.prototype.load = function (filename) {
  const extname = path.extname(filename);
  _Module._extensions[extname](this, filename);
  this.loaded = true;
};
```

### 2.4、\_ Module.\_extensions

不同文件类型的处理方法都挂载在 \_ Module.\_extensions

```js
// _Module._extensions 静态变量用来存各种文件对应的处理方法
_Module._extensions = {
  '.js': function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    module._compile(content, filename);
  },
  '.json': function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    module.exports = JSON.parse(content);
  },
};
```

### 2.5、\_ Module.prototype.\_compile

\_ Module.prototype.\_compile 是加载 JS 文件的核心所在，也是我们最常使用的方法，这个方法需要将目标文件拿出来执行一遍，执行之前需要将它整个代码包裹一层，以便注入 exports、require、module、dirname、filename，这也是我们能在JS文件里面直接使用这几个变量的原因。

```js
_Module.wrapper = ['(function (exports, require, module, __filename, __dirname) { ', '\n});'];

_Module.wrap = function (script) {
  return _Module.wrapper[0] + script + _Module.wrapper[1];
};

// _Module.prototype._compile是加载JS文件的核心所在，也是我们最常使用的方法，这个方法需要将目标文件拿出来执行一遍，
// 执行之前需要将它整个代码包裹一层，以便注入 exports,require,module,__dirname,__filename，这也是我们能在JS文件里面直接使用这几个变量的原因。
_Module.prototype._compile = function (content, filename) {
  const wrapper = _Module.wrap(content);

  // vm是nodejs的虚拟机沙盒模块，runInThisContext方法可以接受一个字符串并将它转化为一个函数
  // 返回值就是转化后的函数，所以compiledWrapper是一个函数
  const compiledWrapper = vm.runInThisContext(wrapper, {
    filename,
    lineOffset: 0,
    displayErrors: true,
  });

  // 准备exports, require, module, __filename, __dirname这几个参数
  // exports可以直接用module.exports，即this.exports
  // require官方源码中还包装了一层，其实最后调用的还是this.require
  // module不用说，就是this了
  // __filename直接用传进来的filename参数了
  // __dirname需要通过filename获取下
  const dirname = path.dirname(filename);
  compiledWrapper.call(this.exports, this.exports, this.require, this, filename, dirname);
};
```

### 2.6、全部代码

```js
const path = require('path');
const fs = require('fs');
const vm = require('vm');

// 定义一个构造函数_Module, 这里区分node的Module类, 使用_Module进行命名
function _Module(id = '') {
  this.id = id; // 这个id其实就是我们require的路径
  this.path = path.dirname(id); // path是Node.js内置模块，用它来获取传入参数对应的文件夹路径
  this.exports = {}; // 导出的东西放这里，初始化为空对象
  this.filename = null; // 模块对应的文件名
  this.loaded = false; // loaded用来标识当前模块是否已经加载
}

// require其实是Module类的一个实例方法
_Module.prototype.require = function (id) {
  const fileId = path.resolve(__dirname, id);
  // id 为文件路径
  return _Module._load(id);
};

// 缓存的模块存储在 Module._cache 这个静态变量上
_Module._cache = Object.create(null);

// _Module._load是一个静态方法, 这是require的真正主体
// 它的作用:
// 1. 先检查请求的模块在缓存中是否存在了, 如果存在了直接返回缓存模块的exports.
// 2. 如果不在缓存中, 就new一个Module实例, 用这个实例加载对应的模块, 并返回模块的exports

_Module._load = function (request) {
  // request是我们传入的路径参数
  const filename = _Module._resolveFilename(request); // 获取绝对路径

  // 先检查缓存, 如果缓存存在且已经加载, 直接返回缓存
  const cacheModule = _Module._cache[filename];
  if (cacheModule !== undefined) {
    return cacheModule.exports;
  }

  // 如果缓存不存在, 我们就加载这个模块. 加载前先new一个_Module实例,然后调用实例方法load加载. 加载完成直接返回module.exports
  const module = new _Module(filename);
  _Module._cache[filename] = module;
  // load之前就将这个模块缓存下来, 这样如果有循环引用就会拿到这个缓存, 但是这个缓存里面的exports可能还没有或者不完整
  module.load(filename);
  return module.exports;
};

// _Module._extensions 静态变量用来存各种文件对应的处理方法
_Module._extensions = {
  '.js': function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    module._compile(content, filename);
  },
  '.json': function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    module.exports = JSON.parse(content);
  },
};

// 通过用户传入的require参数来解析到真正的文件地址的
_Module._resolveFilename = function (request) {
  const filename = path.resolve(request); // 获取传入参数对应的绝对路径
  const extname = path.extname(request); // 获取后缀名

  // 如果没有文件后缀名, 尝试添加.js和.json
  if (!extname) {
    const exts = Object.keys(_Module._extensions);
    for (let i = 0; i < exts.length; i++) {
      const currentPath = `${filename}${exts[i]}`;

      // 如果拼接后的文件存在, 返回拼接的路径
      if (fs.existsSync(currentPath)) {
        return currentPath;
      }
    }
  }
  return filename;
};

// _Module.prototype.load是一个实例方法，这个方法就是真正用来加载模块的方法，这其实也是不同类型文件加载的一个入口，
// 不同类型的文件会对应 _Module._extensions里面的一个方法：
_Module.prototype.load = function (filename) {
  const extname = path.extname(filename);
  _Module._extensions[extname](this, filename);
  this.loaded = true;
};

_Module.wrapper = ['(function (exports, require, module, __filename, __dirname) { ', '\n});'];

_Module.wrap = function (script) {
  return _Module.wrapper[0] + script + _Module.wrapper[1];
};

// _Module.prototype._compile是加载JS文件的核心所在，也是我们最常使用的方法，这个方法需要将目标文件拿出来执行一遍，
// 执行之前需要将它整个代码包裹一层，以便注入 exports,require,module,__dirname,__filename，这也是我们能在JS文件里面直接使用这几个变量的原因。
_Module.prototype._compile = function (content, filename) {
  const wrapper = _Module.wrap(content);

  // vm是nodejs的虚拟机沙盒模块，runInThisContext方法可以接受一个字符串并将它转化为一个函数
  // 返回值就是转化后的函数，所以compiledWrapper是一个函数
  const compiledWrapper = vm.runInThisContext(wrapper, {
    filename,
    lineOffset: 0,
    displayErrors: true,
  });

  // 准备exports, require, module, __filename, __dirname这几个参数
  // exports可以直接用module.exports，即this.exports
  // require官方源码中还包装了一层，其实最后调用的还是this.require
  // module不用说，就是this了
  // __filename直接用传进来的filename参数了
  // __dirname需要通过filename获取下
  const dirname = path.dirname(filename);
  compiledWrapper.call(this.exports, this.exports, this.require, this, filename, dirname);
};

module.exports = _Module;
```

### 2.7、测试加载

```js
// test.js
module.exports = function add(x, y) {
  console.log(x, y);
  return x + y;
};

// index.js
const MyModule = require('./myModule');
const add = MyModule.prototype.require('./testModule.js');

console.log(add(1, 6));
```

代码测试结果：

![1678025456223](./images/1678025456223.png)
