---
title: ESMoudle
description: ESM和Cjs模块化区别
sidebar_label: ESM和Cjs模块化区别
hide_title: true
---

## 一、模块化概念

模块是指将一个复杂的程序依据一定的规则 (规范) 封装成几个块 (文件)，并进行组合在一起，块的内部数据与实现是私有的， 只是向外部暴露一些接口 (方法) 与外部其它模块通信。

## 二、模块化的由来

### 2.1、如果没有模块化

早期 JavaScript 开发很容易存在**全局污染**和**依赖管理**混乱问题。这些问题在多人开发前端应用的情况下变得更加棘手。我这里例举一个很常见的场景：

![1678783041846](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678783041846.png)

实际代码参考如下：

```js
// a.js
var num = 200;

// b.js
function num() {
  console.log('num是一个函数');
}

// c.js
console.log(num); // 打印一个函数，而不是200
```

执行结果：

![1678783000886](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678783000886.png)

如果在没有模块化的前提下，会暴露一系列问题：

- 全局污染

  没有模块化，那么`script`内部变量是可以相互污染的。比如上述，a.js定义了一个num是数字类型，b.js定义num为一个函数类型，在c.js引入获取num时，发现打印的num为一个函数，获取不到想要的数字类型

- 依赖管理

### 2.2、namespace模式(简单对象封装)

作用： 减少了全局变量，解决命名冲突

问题： 数据不安全 (外部可以直接修改模块内部的数据)

```js
let myModule = {
  data: 'www.baidu.com',
  foo() {
    console.log(`foo() ${this.data}`);
  },
  bar() {
    console.log(`bar() ${this.data}`);
  },
};
myModule.data = 'other data'; // 能直接修改模块内部的数据
myModule.foo(); // foo() other data
```

### 3.3、 IIFE 模式：匿名函数自调用 (闭包)

匿名函数自调用 (闭包)

作用： 数据是私有的， 外部只能通过暴露的方法操作；

编码： 将数据和行为封装到一个函数内部, 通过给 window 添加属性来向外暴露接口；

问题： 如果当前这个模块依赖另一个模块怎么办?

```js
// module.js 文件
(function (window) {
  let data = 'www.baidu.com';
  // 操作数据的函数
  function foo() {
    // 用于暴露有函数
    console.log(`foo() ${data}`);
  }
  function bar() {
    // 用于暴露有函数
    console.log(`bar() ${data}`);
    otherFun(); // 内部调用
  }
  function otherFun() {
    // 内部私有的函数
    console.log('otherFun()');
  }
  // 暴露行为
  window.myModule = { foo, bar }; //ES6 写法
})(window);
```

执行结果：

![1678958967181](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678958967181.png)

打印结果：

![1678958986961](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678958986961.png)

### 3.4、模块化的优点

- 避免命名冲突
- 更好的分离，按需加载
- 更高复用性
- 高可维护性

## 三、Node的Commonjs模块

### 3.1、Commonjs的导入导出

#### 3.2.1、加载模块

```js
const path = require('path');
const serve = require('./serve');
const utils = require('./utils');
```

#### 3.2.2、暴露模块

```js
// serve.js
module.exports = {
  a: 10,
};

// utils.js
module.exports = function (x, y) {
  return x * y;
};
```

### 3.2、Commonjs模块加载原理

详细可以参考本文章在[Node.js的模块require加载机制](/blogs/front-engineer/require)

### 3.3、Commonjs的模块循环加载和缓存

由于`缓存机制的存在，同时Commonjs是属于同步加载`，CommonJS的模块之间可以进行循环加载，而不用担心引起死循环：

案例：

```js
// a.js
exports.a = 1;
var b = require('./b');
console.log(b, 'a.js');
exports.a = 2;

// b.js
exports.b = 11;
var a = require('./a');
console.log(a, 'b.js');
exports.b = 22;

// main.js
const a = require('./a');
const b = require('./b');

console.log(a, 'main a');
console.log(b, 'main b');
```

打印结果：

![1678879377290](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678879377290.png)

执行过程分析：

1. 加载main.js，发现加载了a模块；读取并存入缓存
1. 执行a模块，导出`{a：1}`；发现又加载了b模块，读取并存入缓存
1. 执行b模块，导出了`{b：11}`；又加载了a模块，读取缓存，此时a模块只导出了`{a：1}`
1. b模块执行完毕，导出了`{b：22}`
1. 回到了a模块，执行完毕，导出`{a：2}`
1. 回到main.js，又加载了b模块，读取缓存

### 3.4、Commonjs加载机制

CommonJS的加载机制是，模块输出的是一个值的复制拷贝；对于基本数据类型的输出，属于复制，对于复杂数据类型，属于浅拷贝，我们来看一个例子：

案例1：

```js
// number.js
let num = 1;
function add() {
  num++;
}

module.exports.num = num;
module.exports.add = add;

// main.js
let number = require('./number');
console.log(number.num); // 输出：1
number.add();
console.log(number.num); // 输出：1
number.num = 3;
console.log(number.num); // 输出：3
```

执行结果：

![1678880976826](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678880976826.png)

分析：由于CommonJS是`「值的复制」`，一旦模块输出了值，模块内部的变化就影响不到这个值；因此main.js中的number变量本身和number.js没有任何指向关系了，虽然我们调用模块内部的add函数来改变值，但也影响不到这个值了；反而我们在输出后可以对这个值进行任意的编辑。

案例2：

```js
// obj.js
var obj = {
  color: {
    list: ['red', 'yellow', 'blue'],
  },
};
module.exports = obj;

//a.js
var obj = require('./obj');
obj.color.list.push('green');
//{ color: { list: [ 'red', 'yellow', 'blue', 'green' ] } }
console.log(obj);

//b.js
var obj = require('./obj');
//{ color: { list: [ 'red', 'yellow', 'blue', 'green' ] } }
console.log(obj);

//main.js
require('./a');
require('./b');
```

打印结果：

![1678881401602](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678881401602.png)

分析： 上面代码中我们通过a.js、b.js两个脚本同时引用一个模块进行修改和读取；需要注意的是由于缓存，因此b.js加载时其实已经是从缓存中读取的模块。

### 3.5、exports与module.exports用法区别

##### 3.5.1、exports导出

```js
// a.js
exports.name = '张三';
exports.age = 18;
exports.say = function () {
  console.log("Hi, I'm 张三");
};

// 引入
const a = require('./a');
console.log(a);
```

打印结果：

![1678796114299](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678796114299.png)

##### 3.5.2、为什么`exports={}`不可以

```js
// a.js
exports = {
  name: '张三',
  age: 18,
};

// 导入
const a = require('./a');
console.log(a);
```

打印结果：

![1678797050359](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678797050359.png)

原因解析：

module.exports和exports都是指向同一个对象地址，而进行require导入时获取的是module.exports导出的对象。

![1678797736477](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678797736477.png)

当`exports={}`时，exports和module.exports不在指向同一个地址

![1678797817990](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678797817990.png)

如上图：实际导入获取到的是`{ name: “李四” }`

操作如下图：

```js
//a.js
exports = {
  name: '张三',
  age: 18,
};

module.exports = {
  name: '李四',
};

// 导入
const a = require('./a');
console.log(a);
```

打印结果：

![1678797955906](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678797955906.png)

##### 3.5.3、module.exports

exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports 。那么这就说明在一个文件中，我们最好选择 exports 和 module.exports 两者之一，如果两者同时存在，很可能会造成覆盖的情况发生。比如如下情况：

```js
// a.js
exports.name = '李四'; // 此时 exports.name 是无效的
module.exports = {
  name: '张三',
  say() {
    console.log("Hi, I'm 张三");
  },
};

// 导出
const a = require('./a');
console.log(a);
```

打印结果：

![1678801698156](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678801698156.png)

## 四、ESModule模块化

### 4.1、ESModule导入导出

#### 4.1.1、导出

ES6通过export进行导出变量、函数或者类：

```js
export let num = 1;
export function add(x) {
  return num + x;
}

export class Person {}
```

或者

```js
let num = 1;
function add(x) {
  return num + x;
}

class Person {}
export { num, add, Person };
```

在导出对象时，还可以使用`as关键词`重命名导出的变量：

```js
let num = 1;

export { num as number };
```

需要注意的是，export规定，导出的是对外的接口，必须与模块内部的变量建立一一对应的关系。下面两种是错误的写法：

```js
// 报错，是个值，没有提供接口
export 1;

// 报错，需要放在大括号中
var m = 1;
export m;
```

#### 4.1.2、导入

其他模块文件可以通过`import`命令加载这个接口：

```js
import { number } from './export';
```

和export命令一样，我们可以使用as关键字，将导入的变量名进行重命名：

```js
import { number as num } from './export';
```

除了加载模块中指定变量接口，我们还可以使用整体加载，通过（\*）指定一个对象，所有的输出值都加载在这个对象上：

```js
import * as number from './number.js';
```

import命令具有提升效果，会提升到整个模块的头部，首先执行：

```js
console.log(num);
import { number as num } from './number.js';
```

以上代码不会报错，因为import 会优先执行；和CommonJS规范的require不同的是，import是静态执行，因此import不能位于块级作用域内，也不能使用表达式和变量，这些都是只有在运行时才能得到结果的语法结构：

```js
//报错
let moduleName = './num'
import { num, add } from moduleName;

//报错
//SyntaxError: 'import' and 'export' may only appear at the top level
let num = 10;
if (num > 2) {
    import a from "./a";
} else {
    import b from "./b";
}
```

#### 4.1.3、export default导出

```js
//add.js
export default function (x, y) {
  return x + y;
}

//main.js
import add from './add';
console.log(add(2, 4));
```

由于export default是默认导出，因此，这个命令在一个模块中只能使用一次，而export导出接口是可以多次导出的：

```js
//报错
//SyntaxError: Only one default export allowed per module.
//add.js
export default function (x, y) {
    return x + y;
};
export default function (x, y) {
    return x + y + 1;
};
```

`export default`其实是语法糖，本质上是将后面的值赋值给default变量，所以可以将一个值写在export default之后；但是正是由于它是输出了一个default变量，因此它后面不能再跟变量声明语句：

```js
//正确
export default 10

//正确
let num = 10
export default num

//报错
export default let num = 10
```

既然`export default`本质上是导出了一个default变量的语法糖，因此我们也可以通过`export`来进行改写：

```js
//num.js
let num = 10;
export { num as default };
```

上面两个代码是等效的；而我们在import导入时，也是把`default`变量重命名为我们想要的名字，因此下面两个导入代码也是等效的：

```js
import num from './num';
//等效
import { default as num } from './num';
```

在一个模块中，export可以有多个，export default只能有一个，但是他们两者可以同时存在：

```js
//num.js
export let num1 = 1;
export let num2 = 2;
let defaultNum = 3;
export default defaultNum;

//main.js
import defaultNum, { num1, num2 } from './num';
```

在export default导出和（\*）一起使用时

```js
// export.js
let num = 1;
function add(x) {
  return num + x;
}

class Person {}
export { num, add };

export default Person;

// main.js
import * as mod from './export.mjs';
console.log(mod);
```

执行结果：

![1678885103310](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678885103310.png)

### 4.2、ESModule加载机制

在CommonJS模块的输出是值的复制拷贝；而ES6输出的则是对外接口，我们将上面CommonJS中的代码进行改写来理解两者的区别：

```js
//number.mjs
let num = 1;

function add() {
  num++;
}

export { num, add };

// main.mjs
import { num, add } from './number.mjs';

console.log(num); //输出：1
add();
console.log(num); // 输出：2
```

调用模块中的函数影响了模块中的变量值；正是由于ES6模块只是输出了一个对外的接口，我们可以把这个接口理解为一个引用，实际的值还是在模块中；而且这个引用还是一个只读引用，不论是基本数据类型还是复杂数据类型：

```js
//obj.mjs
let num = 1;
let list = [1, 2];

export { num, list };

//main.mjs
import { num, list } from './obj.mjs';
//Error: "num" is read-only.
num = 3;
//Error: "list" is read-only.
list = [3, 4];
```

### 4.3、ESModule的循环加载

> ESModule加载是在编译时进行加载，Commonjs加载时在运行时进行加载模块

循环加载案例1：

```js
// a.mjs
import { bar } from './b.mjs';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import { foo } from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

执行a.mjs时，抛出错误

![1678955535216](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678955535216.png)

加载过程分析：
首先，执行a.mjs以后，引擎发现它加载了b.mjs，因此会优先执行b.mjs，然后执行a.mjs。接着，执行b.mjs的时候，已知它从a.mjs输入了foo接口，这时不会去执行a.mjs，而是认为这个接口已经存在了，继续往下执行。执行到`console.log(foo)`的时候，才发现这个接口根本没有定义，因此报错。

解决这个问题的方法， 就是让`b.mjs`运行的时候，`foo`已经有定义了。这可以通过将`foo`写成函数来解决。

```js
// a.mjs
import { bar } from './b.mjs';
console.log('a.mjs');
console.log(bar());
function foo() {
  return 'foo';
}
// export let foo = 'foo'
export { foo };

// b.mjs
import { foo } from './a.mjs';
console.log('b.mjs');
console.log(foo());
function bar() {
  return 'bar';
}
// export let bar = 'bar';
export { bar };
```

执行结果：

![1678956392149](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678956392149.png)

这是因为函数具有提升作用(类似函数的变量提升)，在执行 `import {bar} from './b'`时，函数`foo`就已经有定义了，所以`b.mjs`加载的时候不会报错。这也意味着，如果把函数`foo`改写成函数表达式，也会报错。

```js
// a.mjs
import { bar } from './b.mjs';
console.log('a.mjs');
console.log(bar());
// function foo() {
//   return 'foo'
// }
const foo = () => 'foo';
// export let foo = 'foo'
export { foo };
```

执行结果：

![1678956547741](https://gitee.com/caigh1012/assets/raw/main/blog/fe/js-module/1678956547741.png)

## 五、ESModule和Commonjs的差异

1. 两者的模块导入导出语法不同，CommonJs是通过module.exports，exports导出，require导入；ESModule则是export导出，import导入。
2. CommonJs是运行时加载模块，ESModule是在静态编译期间就确定模块的依赖。ESModule在编译期间会将所有import提升到顶部，CommonJs不会提升require。
3. CommonJs导出的是一个值拷贝，会对加载结果进行缓存，一旦内部再修改这个值，则不会同步到外部。ESModule是导出的一个引用(只读)，内部修改可以同步到外部。
4. CommonJs中顶层的this指向这个模块本身，而ESModule中顶层this指向undefined。
5. CommonJS加载的是整个模块，将所有的接口全部加载进来，ESModule可以单独加载其中的某个接口 ‘
6. CommonJS 模块的`require()`是同步加载模块，ES6 模块的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。
