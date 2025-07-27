---
outline: deep
---

# Node.js快速入门

## 一、认识Node

### 1.1、node.js架构

Node的架构最主要分三层 Natives modules、Node C/C++ Bindings、CPU/RAM/DISK OS

![1666881967961](images/1666881967961.png)

首先，Natives modules 层

- 当前层内容由 JavaScript 实现
- 提供应用程序可直接调用库，例如 fs、path、http 等
- JavaScript 语言无法直接操作底层硬件设置

然后，C++ 实现的 Builtin modules “胶水层”，之后，底层和功能模块

![1666882377612](images/1666882377612.png)

- V8：执行 JavaScript 代码，提供桥梁接口
- Libuv：事件循环、事件队列、异步IO
- 第三方模块：zlib、http、c-ares 等

最后，Node的核心组成：

![1666882607536](images/1666882607536.png)

### 1.2、node.js异步IO

![1666882696843](images/1666882696843.png)

### 1.3、事件驱动架构

```js
const EventEmitter = require('events');

// new一个实例
const myEvent = new EventEmitter();

// 监听事件1-订阅事件
myEvent.on('事件1', () => {
  console.log('事件1执行了');
});

// 触发事件
myEvent.emit('事件1');
```

### 1.4、node.js应用场景

1. IO密集型高并发请求

![1666883166059](images/1666883166059.png)

2. 操作数据库提供api服务

3. 实时聊天应用程序

### 1.5、node.js实现API服务

```js
const express = require('express');

const app = express();

const data = [
  {
    name: 'jack',
    age: 18,
  },
  {
    name: 'lucy',
    age: 20,
  },
];

app.get('/', (req, res) => {
  res.json(data);
});

app.listen(8080, () => {
  console.log('服务已经开启了');
});
```

![1666883645078](images/1666883645078.png)

## 二、node.js全局对象

在浏览器中我们有 window 对象用于挂载全局的变量，而在 node 中，全局变量则为 global。global 对象也有一个 global 属性引用自身。

```javascript
console.log(global); // 打印global对象
console.log(global.global); // 打印global对象
console.log(global.global.global.global); // 打印global对象
```

### 2.1、在交互模式下

交互模式：在 window 下打开 cmd，输入 node 即可进入交互模式。使用var定义的变量和创建的函数会挂载到global对象上。

![image-20250727094744709](images/image-20250727094744709.png)

### 2.2、在脚本模式下

声明的变量和创建的函数都不是 global 对象下的，这与 JavaScript 在浏览器运行时不一样。

```javascript
/**
 * 脚本模式下，定义的变量和函数不过挂载到global
 */
var a = 1;
console.log(global.a);

function add(x, y) {
  return x + y;
}

console.log(global.add(4, 5));
```

![image-20250727093924594](images/image-20250727093924594.png)

那么，在脚本模式下的 this 指向哪里

```javascript
console.log(this); // 输出 {}
```

在js文件中直接打印时，是一个空对象。

但是 common.js 模块化规范，每一个 js 文件都是一个模块，而这个 this 指向的是 module.exports 和 exports。

```javascript
/**
 * 这里的this指向 module.exports 和 exports
 */
console.log(this === module.exports); // 输出 true
console.log(this === exports); // 输出 true
console.log(exports === module.exports); // 输出 true
```

如果要让其中的 this 指向 global

```javascript
/**
 * 如果要让其中的 this 指向 global
 * 当前自执行函数等同于在交互模式下执行 console.log(this)
 */

// 当前自执行函数等同于在交互模式下执行 console.log(this)
(function () {
  console.log(this);
})();
```

## 三、全局变量process

无须 require 进行导入，可以直接使用，process的用途：

+ 获取进程信息
+ 执行进程操作

### 2.1、获取进程信息

获取 内存、cpu资源2、执行进程操作

```js
// 获取内存信息
console.log(process.memoryUsage())

// 打印后
{
  rss: 24961024,
  heapTotal: 4866048,
  heapUsed: 3995376,
  external: 234802,
  arrayBuffers: 11146
}

// 获取cpu信息
console.log(process.cpuUsage())
// 打印后
{ user: 31000, system: 15000 }
```

获取运行环境信息

```js
console.log(process.cwd()); // 当前运行目录
console.log(process.version); // node版本
console.log(process.versions); // 获取node版本、v8版本、zlib等版本信息
console.log(process.arch); // cpu架构
console.log(process.env.NODE_ENV); // 用户环境
// console.log(process.env.PATH) // 系统环境变量
console.log(process.env.USERPROFILE); // 获取管理员目录，注意: MacOS系统取的HOME，window取得是USERPROFILE
console.log(process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME); // 获取系统平台
```

获取运行状态信息

```js
// 3.运行状态信息
console.log(process.argv); // 启动参数，输出一个数组
console.log(process.argv0); // 默认输入 process.argv 数组中的第一个
// console.log(process.argv1) // 不存在argv1

console.log(process.pid); // ppid，执行完成之后会被回收
console.log(process.uptime()); // 从执行开始到结束后的时间
setTimeout(() => {
  console.log(process.uptime()); // 输出的时间大于3秒
}, 3000);
```

### 2.2、获取执行进程操作信息

获取事件信息

```js
// 1.获取事件信息
process.on('exit', (code) => {
  // 在脚本执行完成后进行，同样是异步操作
  console.log('exit:' + code);
  setTimeout(() => {
    console.log(123);
  }, 1000);
});

process.on('beforeExit', (code) => {
  // 在脚本执行完成前进行，同样是异步操作
  console.log('before exit' + code);
});
console.log('代码执行完了');
```

注意：process.on 监听的回调事件不能执行 `异步代码`

标准的输入、输出、

```js
// 5 标准的输出 输入 错误
console.log = function (data) {
  process.stdout.write('---' + data + '\n'); // 可写流
};
console.log(888);

const testFile = path.join(__dirname, 'test.txt');

// 创建一个可读流通过pipe给到process.stdout输出到终端面板上
fs.createReadStream(testFile).pipe(process.stdout);

// 创建一个输入同时对应输出
process.stdin.pipe(process.stdout);

process.stdin.setEncoding('utf-8'); // 设置编码
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if (chunk !== 'null') {
    process.stdout.write('data:' + chunk);
  }
});
```

## 四、全局变量Buffer

### 4.1、什么是Buffer

首先 Buffer 是 nodejs 全局上的一个內置模块，可以直接在不用 require 引入就可以直接调用的模块。

Buffer 的作用就是让 JavaScript 可以直接操作二进制数据，关于 Buffer 就离不开一些关键名词：二进制、流、管道、IO。关于二进制不需要做太多的解释了，像图片、文件这些都是以二进制的方式存储在磁盘中。当需要使用这些资源的时候，就是要去拿到这些数据，拿数据的这个操作就是读数据。拿到数据后就需要提供给程序，让这些数据作用到具体的应用上，而作用到具体应用的数据基本上不是直接使用二进制数据，而是应用能使用的另一种编码格式的数据。并且当这个数据被作用到具体应用后，这个数据就需要以这个编码格式一直保持被引用的状态，直到应用不在使用这个数据然后被系统回收。

从上面使用数据的过程来看就可以明白，拿到二进制数据后需要转换编码格式，然后还需要一个存放这个数据物理资源，这个物理资源通常被称作缓存，所以很多时候也将 Buffer 称作缓存。

从二进制数据到其他进制的编码格式，然后在被作用到具体应用，这就是数据从二进制到具体应用表达的过程，这个过程可以理解为一个流程，这个流程里可能还会有程序添加的一些其他操作，这一系列过程被简称为流。（在 node.js 中有一个专门用于处理流操作的模块 Stream，后面具体解析）

在很多数据操作的时候并不是一次性将一个二进制文件全部读出来，更多可能是基于程序的需要一点点的读取，这时候就需要一个程序逻辑来处理这种操作，将每一个需要的读取文件流程按照逻辑作用到具体应用中，这个程序逻辑我们将其称作管道。（在 node.js 中的 fs 模块中有一个 pipe 方法，这个方法就可以简单的理解为管道）

反之，向磁盘存储数据也一样，将上面描述的数据读取操作反过来就是文件写操作。文件的读写操作就被称为 IO。（在node.js 中负责处理文件操作的 fs 模块，就是nodejs读写操作 IO 的具体表达）

### 4.2、Bufffer结构

#### 4.2.1、Buffer模块结构

前面说过 Buffer 是全局作用域上的一个模块，可以理解为它是全局上的一个属性，这个属性引用着 Bufeer 模块对象，从这个角度来说它是一个 JavaScript 模块。但是 JavaScript 自身不具备直接操作二进制文件的能力，所以实质上 Buffer 在node.js 底层上还有一个 C++ 模块。这是因为 IO 操作是非常消耗性能的，所以 node.js 在 Buffer 模块构建设计上，将性能部分用 C++ 实现，将非性能部分用 JavaScript 实现。如图所示：

![buffer](images/buffer.png)

#### 4.2.2、Buffer对象结构

Buffer 在node.js 的 JavaScript 中是一个对象，与数组非常类似，它的元素为 16 进制的两位数，即 0 到 255 的数值。

```js
let str = 'node';
let buf = new Buffer(str, 'utf-8');
console.log(buf);
// 打印结果: <Buffer 6e 6f 64 65>
```

不同编码的字符占用的元素各不相同，utf-8 编码汉字占用 3 个元素，字母和半角标点符号占用 1 个元素，所以上面的 str转成 Buffer 由21个元素组成。根数组一样，Buffer 可以使用 length 属性获取长度，也可以通过下标访问元素，构造 Buffer对象时也可以和数组一样直接设置长度。

### 4.3、Buffer对象的API解析

Buffer.from()：支持 String、Array、ArrayBuffer、Object、Buffer 五种类型，也就是可以将这五种 JavaScript 类型的数据转换成十六进制数据。
但部分类型并不能完全支持。然后就是可选参数包括：编码(encoding)、偏移量、长度，但不是五种类型数据所可选的参数不是一样的

```js
let bufStr = Buffer.from('落霞与孤鹜齐飞，秋水共长天一色'); //默认编码utf-8。web标准编码也是utf-8，所以不需要设置编码模式，如果js不是标准编码需要注意设置编码
let bufStrBase64 = Buffer.from('6Iez6Iul5pil5ZKM5pmv5piO77yM5rOi5r6c5LiN5oOK', 'base64'); //'至若春和景明，波澜不惊'的base64编码
let buff = Buffer.from('5oiR5Y+r6JSh5YWJ6L6J', 'base64');
console.log(buff.toString());
console.log('5oiR5Y+r6JSh5YWJ6L6J'.toString());
console.log(bufStrBase64);
console.log(bufStr.toString()); //同样toString将Buffer对象转换成字符串时，也是默认utf-8编码
console.log(bufStrBase64.toString('base64')); //如果使用时依然需要base64编码，还是要使用base编码转换字符串
console.log(bufStrBase64.toString()); //如果使用时使用utf8编码模式，就可以直接使用默认编码
```

Buffer.alloc(size[, fill[, encoding]])：这是一个创建 Buffer 对象并对内存中的数据做初始化处理，并且可以通过 fill 可选参数指定初识化信息，和通过 encoding 指定初识化数据的编码类型。

```js
let buf64 = Buffer.alloc(44, 5, 'base64');
let bufUtf8 = Buffer.alloc(33, 2, 'utf8');
console.log(buf64);
console.log(bufUtf8);
buf64.write('6Iez6Iul5pil5ZKM5pmv5piO77yM5rOi5r6c5LiN5oOK', 'base64'); //需要注意的是这里写入还需要设置写入数据的编码，前面alloc的编码是指定初识化数据的
bufUtf8.write('落霞与孤鹜齐飞，秋水共长天一色'); //这里是默认的utf-8所以在写入时就不需要再指定了
console.log(buf64);
console.log(bufUtf8);
console.log(buf64.toString());
console.log(bufUtf8.toString());
```

Buffer.allocUnsafe(size)与Buffer.allocUnsafeSlow(size)：这两个方法与alloc的差别在读写上没有什么差别，它们与alloc的差别就是内存的使用和初识化内存数据这两个问题上，由于不做初识化处理它们只需要接收一个参数size设置使用内存的空间大小就可以了。

Buffer.concat(list[, totalLength])：这是一个拼接Buffer的静态方法，参数list是所有拼接的Buffer对象的列表，totalLength是指定拼接成新的Buffer对象的长度，如果长度不够则会忽略后面数据。

```js
let buf1 = Buffer.from('落霞与孤鹜齐飞');
let buf2 = Buffer.from('秋水共长天一色');
let buf = Buffer.concat([buf1, buf2]);
console.log(buf);
console.log(buf.toString()); // 落霞与孤鹜齐飞秋水共长天一色
```

Buffer.isBuffer(obj)：这是一个Buffer静态方法，用来判断对选是否是一个Buffer对象。

```js
let buf21 = Buffer.from('落霞与孤鹜齐飞,秋水共长天一色');
let obj21 = { test: 'isBuffer' };
console.log(Buffer.isBuffer(buf21));
console.log(Buffer.isBuffer(obj21));
```

Buffer.keys()

```js
let buf31 = Buffer.from('落霞与孤鹜齐飞,秋水共长天一色');
console.log(buf31.keys());
for (const key of buf.keys()) {
  console.log(key); //逐个打印key，Buffer类似数组，所以key可理解为索引
}
```

### 4.4、解决Buffer拼接时导致的乱码问题

使用 Buffer 除了性能编码等需要非常属性以外，还需要注意读取Buffer后拼接导致的乱码问题，比如下面的示例：

```js
let buf = Buffer.from('至若春和景明，波澜不惊，上下天光，一碧万顷，沙鸥翔集，锦鳞游泳，岸芷汀兰，郁郁青青。');
let start = 0;
let end = 10;
let str = '';
while (start < buf.length) {
  str += buf.subarray(start, end); //subarray获取Buffer对象中的指定片段，与字符串拼接时会默认调用toString方法
  start = end;
  end = start + 10;
}
console.log(str); // 至若春���景明��波澜不惊，上���天光��一碧万顷，沙���翔集��锦鳞游泳，岸���汀兰��郁郁青青。
```

这个问题并不好解决，因为想 UTF-8 存在字符不等长字节的现象，没办法直接通过固定的字符字节长倍数读取的方式来解决。针对这种情况 node.js 提供了一个字符串解码器模块（string_decoder），这个模块不会默认加载，需要手动引入使用，详细参考下面的示例代码：

字符串解码器官方文档：http://nodejs.cn/api/string_decoder.html

```js
const StringDecoder = require('string_decoder').StringDecoder;
let decoder = new StringDecoder('utf8');
let buf = Buffer.from('至若春和景明，波澜不惊，上下天光，一碧万顷，沙鸥翔集，锦鳞游泳，岸芷汀兰，郁郁青青。');
let start = 0;
let end = 9;
let str = '';
while (start < buf.length) {
  str += decoder.write(buf.subarray(start, end));
  start = end;
  end = start + 9;
}
console.log(str); // 至若春和景明，波澜不惊，上下天光，一碧万顷，沙鸥翔集，锦鳞游泳，岸芷汀兰，郁郁青青。
```

## 五、核心模块path

Node内置模块，用于处理文件/目录的路径

| API名称      |          作用          |
| :----------- | :--------------------: |
| basename()   |   获取路径中基础名称   |
| dirname()    |   获取路径中目录名称   |
| extname()    |   获取路径中扩展名称   |
| isAbsolute() | 获取路径是否为绝对路径 |
| join()       |    拼接多个路径片段    |
| resolve()    |      返回绝对路径      |
| parse()      |        解析路径        |
| format()     |       序列化路径       |
| normalize()  |       规范化路径       |

获取路径中的基础名称

```js
/* 1.获取路径中的基础名称 */
/*
 * 01 返回的就是接收路径当中的最后一部分
 * 02 第二个参数表示扩展名，如果说没有设置则返回完整的文件名称带后缀
 * 03 第二个参数作为后缀时，如果没有当前路径匹配到，那么就会忽略
 * 04 处理目录路径的时候，结尾处有路径分隔符，则也会被忽略掉
 *  */

console.log(path.basename(__filename)); // 输出path.js
console.log(path.basename(__filename, '.js')); // 输出：path
console.log(path.basename(__filename, '.css')); // 不存在css就会忽略，输出：path.js
console.log(path.basename('/a/b/c')); // 输出：c
console.log(path.basename('/a/b/c/')); // 输出：c
```

![image-20250727115955592](images/image-20250727115955592.png)

获取目录名

```js
/* 2.获取目录名 */
/*
 * 01 返回路径中最后一部分的上一层目录所在路径
 * */
console.log(path.dirname(__filename)); // 输出：D:\Users\Victor\Desktop\my-gitee\node\src\path
console.log(path.dirname('/a/b/c')); // 输出：/a/b
console.log(path.dirname('/a/b/c/')); // 输出：/a/b
```

![image-20250727120020459](images/image-20250727120020459.png)

获取路径的扩展名

```js
/* 3. 获取路径的扩展名 */
/*
 * 01 返回path路径中相应文件的后缀名
 * 02 如果path路径当中存在多个点，它匹配的是最后一个点，到结尾的内容
 * */
console.log(path.extname(__filename)); // 输出：.js
console.log(path.extname('/a/b')); // 输出：""
console.log(path.extname('/a/b/index.html.js')); // 输出：.js
console.log(path.extname('/a/b/index.html.')); // 输出："."
```

![image-20250727120042508](images/image-20250727120042508.png)

解析路径

```js
/* 4.解析路径 */
/*
 * 01 接收一个路径，返回一个对象，包含不同的信息
 * 02 返回root、dir、base、ext、name的信息
 * */
const obj = path.parse('/a/b/c/index.html');
// const obj = path.parse('/a/b/c/')
// const obj = path.parse('./a/b/c/index.html')
const currentPath = path.parse(__filename);
console.log(obj, currentPath.name, '<___obj');
```

![image-20250727120138916](images/image-20250727120138916.png)

序列化–重新生成路径

```js
const obj = path.parse('./a/b/c/index.html');
console.log(path.format(obj));
```

![image-20250727120206360](images/image-20250727120206360.png)

判断当前路径是否为绝对

```js
/* 6.判断当前路径是否为绝对 */
console.log(path.isAbsolute('foo')); // 输出：false
console.log(path.isAbsolute('/foo')); // 输出：true
console.log(path.isAbsolute('////foo')); // 输出：true
console.log(path.isAbsolute('')); // 输出：false
console.log(path.isAbsolute('.')); // 输出：false
console.log(path.isAbsolute('../foo')); // 输出：false
```

![image-20250727120239250](images/image-20250727120239250.png)

拼接路径

```js
/* 7. 拼接路径 */
console.log(path.join('a/b', 'c', 'index.html')); // 输出：a\b\c\index.html
console.log(path.join('/a/b', 'c', 'index.html')); // 输出：\a\b\c\index.html
console.log(path.join('/a/b', 'c', '../', 'index.html')); // 输出：\a\b\index.html
console.log(path.join('/a/b', 'c', './', 'index.html')); // 输出：\a\b\c\index.html
console.log(path.join('/a/b', 'c', '', 'index.html')); // 输出：\a\b\c\index.html
```

![image-20250727120305704](images/image-20250727120305704.png)

规范化路径

```js
/* 8.规范化路径 */
console.log(path.normalize('')); // 输出：.
console.log(path.normalize('a/b/c/d')); // 输出：a\b\c\d
console.log(path.normalize('a///b/c../d')); // 输出：a\b\c..\d
console.log(path.normalize('a//\\/b/c../d')); // 输出：a\b\c..\d
console.log(path.normalize('a//\b/c../d')); // 输出：a\c..\d
```

![image-20250727120341670](images/image-20250727120341670.png)

绝对路径

```js
/* 9.绝对路径 */
/*
 * resolve([form],to)
 * from不存在时输出当前的绝对路径，存在时要相对路径，被拼接的是to
 * */
console.log(path.resolve()); // D:\Users\Victor\Desktop\my-gitee\node
console.log(path.resolve('a', 'b')); // 输出：D:\Users\Victor\Desktop\my-gitee\node\a\b
console.log(path.resolve('a', '/b')); // 输出：D:\b  a被忽略
console.log(path.resolve('/a', '/b')); // 输出：D:\b /a被忽略以最后的/b为from
console.log(path.resolve('/a', 'b')); //  输出：D:\a\b
```

![image-20250727120415306](images/image-20250727120415306.png)

## 六、核心模块fs

### 6.1、权限位、标识符、文件描述符

权限位：用户对于文件所具备的操作的权限

![1665238934560](images/1665238934560.png)

Nodejs中flag表示对文件操作方式

| flag | 操作方式         |
| ---- | ---------------- |
| r    | 表示可读         |
| w    | 表示同步         |
| s    | 表示同步         |
| +    | 表示执行相反操作 |
| x    | 表示排它操作     |
| a    | 表示追加操作     |

fd 就是操作系统分配给被打开文化的标识

### 6.2、文件操作

#### 6.2.1、文件读写与拷贝操作

| 文件 API   | 作用                             |
| ---------- | -------------------------------- |
| readFile   | 从指定文件中读取数据             |
| writeFile  | 向指定文件中写入数据             |
| appendFile | 追加的方式向指定文件中写入数据   |
| copyFile   | 将某个文件中的数据拷贝至另一文件 |
| watchFile  | 对指定文件进行监控               |

readFile

```js
/* readFile */
fs01.readFile(path.resolve(__dirname, 'data.txt'), 'utf-8', (err, data) => {
  console.log(data, '<___data');
});
```

writeFile

```js
/* writeFile */
// 如果writeFile要写入文件的路径不存在，则重新创建一个文件
fs01.writeFile(
  path.resolve(__dirname, 'data.txt'),
  'hello world',
  {
    mode: 438,
    flag: 'r+', // 读写权限
    encoding: 'utf-8',
  },
  (err) => {
    if (!err) {
      fs01.readFile(path.resolve(__dirname, 'data.txt'), 'utf-8', (error, data) => {
        console.log(data, '<___data');
      });
    }
  },
);
```

appendFile

```js
/* appendFile */
fs01.appendFile(path.resolve(__dirname, 'data.txt'), '追加的数据', (err) => {
  console.log('写入成功');
});
```

copyFile

```js
/* copyFile */
fs01.copyFile(path.resolve(__dirname, 'data.txt'), path.resolve(__dirname, 'text.txt'), () => {
  console.log('拷贝成功');
});
```

watchFile

```js
/* watchFile */
fs01.watchFile(path.resolve(__dirname, 'data.txt'), { interval: 1000 }, (curr, prev) => {
  // console.log(curr,prev)
  if (curr.mtime !== prev.mtime) {
    console.log('文件被修改了');
  }
});
```

#### 6.2.2、文件打开与关闭

```js
/**
 * 文件打开与关闭
 * open： 打开文件
 * close：关闭文件
 */
fs.open(path.resolve(__dirname, 'data.txt'), 'r', (err, fd) => {
  // fd：操作系统分配给被打开文化的标识
  console.log(fd);
});

fs.open(path.resolve(__dirname, 'data.txt'), 'r', (err, fd) => {
  console.log(fd);
  fs.close(fd, (error) => {
    console.log('关闭成功');
  });
});
```

#### 6.2.3、大文件读写操作

readFile 进行读取文件适合小文件操作，大文件需要依靠流进行优化读写

![1665318023782](images/1665318023782.png)

实际代码如下

```js
const fs = require('fs');
const path = require('path');

/**
 * 大文件读写操作
 * open：打开文件
 * close：关闭文件
 */
let buf = Buffer.alloc(10);

// read： 所谓读就是将数据从磁盘文件中写入到buffer中
/**
 * 参数1：fd 定位当前被打开的文件
 * 参数2：buf 用于表示当前的缓冲区
 * 参数3：offset 表示当前从buf的那个位置开始执行写入
 * 参数4：length 表示当前次写入的长度
 * 参数5：position：表示当前从前文件的那个位置开始读取
 */
fs.open(path.resolve(__dirname, 'data.txt'), 'r', (err, rfd) => {
  console.log(rfd);
  fs.read(rfd, buf, 0, 3, 0, (err, readBytes, data) => {
    console.log(readBytes); // 读取的字节
    console.log(data); // data为存入的16进制
    console.log(data.toString());
  });
});

// write：将缓冲区里的内容写入到磁盘文件中
buf = Buffer.from('12345668455');
fs.open('b.txt', 'w', (err, wfd) => {
  fs.write(wfd, buf, 0, 3, 0, (err, written, buf) => {
    console.log(written);
    console.log(buf);
    console.log(buf.toString());
  });
});
```

#### 6.2.4、文件拷贝自定义操作

```javascript
const fs = require('fs')
const path = require('path')

/**
 * 文件拷贝自定义实现
 * @date: 2022-10-09 20:46
 */

/*
* 01: 打开a文件，利用read将数据保存到buffer暂存起来
* 02: 打开b文件，利用write将buffer中数据写入到b文件中
* */

let buf = Buffer.alloc(10)

// 打开指定的文件
fs.open('a.txt','r',(err,rfd)=>{
  // 读取指定的文件
  fs.read(rfd,buf,0,10,0,(err,readBytes,buffer)=>{
    // 打开被写入的文件
    fs.open('b.txt','w',(err,wfd)=>{
      // 写入目标的文件
      fs.write(wfd,buf,0,10,0,(err,written)=>{
        console.log("写入成功")
      })
    })
  })
})

// 代码优化-数据完全的拷贝
const BUFFER_SIZE = buf.length
let readOffset = 0
fs.open(path.resolve(__dirname,'a.txt'),'r',(err,rfd)=>{
  fs.open('b.txt','w',(err,wfd)=>{
    function next() {
      fs.read(rfd,buf,0,BUFFER_SIZE,readOffset,(err,readBytes,buffer)=>{
        if(!readBytes) {
          // 如果条件成立，说明内容已经读取完毕
          fs.close(rfd,()=>{})
          fs.close(wfd,()=>{})
          console.log('拷贝成功')
          return
        }
        readOffset += readBytes
        fs.write(wfd,buf,0, readBytes,(err,written)=>{
          next()
        })
      })
    }
    next()
  })
})
```

#### 6.2.5、目录操作

| 目录操作 API | 作用                           |
| ------------ | ------------------------------ |
| access       | 判断文件或目录是否具有操作权限 |
| stat         | 获取目录及文件信息             |
| mkdir        | 创建目录                       |
| rmdir        | 删除目录                       |
| readdir      | 读取目录中内容                 |
| unlink       | 删除指定文件                   |

access

```js
// 1.access
fs.access(path.resolve(__dirname, 'text.txt'), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('是有操作权限的');
  }
});
```

stat

```js
// 2.stat
fs.stat(path.resolve(__dirname, 'text.txt'), (err, statObj) => {
  console.log(statObj.size); // 大小
  console.log(statObj.isFile()); // 是否为文件
  console.log(statObj.isDirectory()); // 是否为文件目录
});
```

mkdir

```js
// 3.mkdir
fs.mkdir(
  '/a/b',
  {
    recursive: false, // 递归 默认false
  },
  (err) => {
    if (!err) {
      console.log('创建成功');
    } else {
      console.log(err);
    }
  },
);
```

rmdir

```js
// 4. rmdir
fs.rmdir('/a/b', (err) => {
  if (!err) {
    console.log('删除成功');
  } else {
    console.log(err);
  }
});
```

readdir

```js
// 5.readdir
fs.readdir('a', (err, files) => {
  console.log(files);
});
```

unlink

```js
// 6. unlink
fs.unlink('a/a.txt', (err) => {
  if (!err) {
    console.log('删除成功');
  }
});
```

## 七、核心模块stream

Stream 流是使您可以连续地从源读取数据或将数据写入目标的对象，在Node.js中，有四种类型的流：

| 文件流    | 作用                                 |
| --------- | ------------------------------------ |
| Readable  | 用于读取操作的流。                   |
| Writable  | 用于写操作的流。                     |
| Duplex    | 可用于读取和写入操作的流。           |
| Transform | 一种双工流，其中基于输入来计算输出。 |

每种类型的流都是一个 EventEmitter 实例，例如，一些常用事件如下：

| 事件名称 | 作用                                     |
| -------- | ---------------------------------------- |
| data     | 当有可读取的数据时，将触发此事件。       |
| end      | 当没有更多数据可读取时，将触发此事件。   |
| error    | 接收或写入数据时发生任何错误。           |
| finish   | 当所有数据都已刷新到系统时，将触发此事件 |

### 7.1、读取流

```js
const fs = require('fs');
const path = require('path');

/* 读取流 */
const readStream = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
let data = '';
readStream.on('data', function (chunk) {
  console.log(chunk);
  data += chunk;
});

readStream.on('end', function () {
  console.log(data);
});

readStream.on('error', function (err) {
  console.log(err.stack);
});

console.log('Program Ended');
```

### 7.2、写入流

```js
const fs = require('fs');
let data = 'Simply Easy Learning';

/* 创建可写流 */
const writerStream = fs.createWriteStream('output.txt');

//将数据写入流，编码为 utf8
writerStream.write(data, 'utf-8');

//标记文件结尾
writerStream.end();

//处理流事件 --> 完成和错误
writerStream.on('finish', function () {
  console.log('Write completed.');
});

writerStream.on('error', function (err) {
  console.log(err.stack);
});

console.log('Program Ended');
```

### 7.3、管道流

```js
/* 管道流 */
const fs = require('fs');

//创建可读流
const readerStream = fs.createReadStream('input.txt');

//创建可写流
const writerStream = fs.createWriteStream('output.txt');

//管道读取和写入操作
//读取 input.txt 并将数据写入 output.txt
readerStream.pipe(writerStream);

console.log('Program Ended');
```

## 八、Events模块

### 8.1、events模块

#### 8.1.1、on/emit

on 可以订阅多个事件

```js
// on
ev.on('click', function () {
  console.log('click事件执行了');
});

// on 多订阅一个事件
ev.on('click', function () {
  console.log('click事件执行了---2');
});
// emit
ev.emit('click');
ev.emit('click');
```

#### 8.1.2、once

once 只能触发一次

```js
// once
ev.once('click', () => {
  console.log('once监听执行');
});

ev.once('click', () => {
  console.log('once监听执行---2');
});

ev.emit('click');
ev.emit('click');
```

#### 8.1.3、off

```js
let cbFn = () => {
  console.log('回调函数执行');
};
ev.on('scroll', cbFn);
ev.emit('scroll');
ev.off('scroll', cbFn); // 解绑事件
ev.emit('scroll'); // 不执行
```

#### 8.1.4、传参

```js
let cbFun = (...args) => {
  console.log(args, '<___args'); // 输出：[ 1, 25, 5 ] <___args
};
ev.on('touch', cbFun);
ev.emit('touch', 1, 25, 5);
```

### 8.2、模拟发布订阅

```js
/**
 * 模拟事件的发布订阅
 */

class PubSub {
  constructor() {
    this._events = {};
  }
  // 订阅
  subscribe(event, callback) {
    if (this._events[event]) {
      this._events[event] = callback;
    } else {
      this._events[event] = [callback];
    }
  }

  // 发布
  publish(event, ...args) {
    const items = this._events[event];
    if (items && items.length) {
      items.forEach(function (callback) {
        callback.call(this, ...args);
      });
    }
  }
}

let ps = new PubSub();
ps.subscribe('事件1', () => {
  console.log('事件1执行了');
});

ps.subscribe('事件2', () => {
  console.log('事件2执行了');
});

ps.publish('事件1');
ps.publish('事件2');
```

### 8.3、浏览器和node的事件循环差异

#### 8.3.1、浏览器事件循环

```js
/**
 * 浏览器事件循环
 * @date: 2022-10-12 00:21
 */

setTimeout(() => {
  console.log('s1');
  Promise.resolve().then(() => {
    console.log('p1');
  });
  Promise.resolve().then(() => {
    console.log('p2');
  });
});

setTimeout(() => {
  console.log('s2');
  Promise.resolve().then(() => {
    console.log('p3');
  });
  Promise.resolve().then(() => {
    console.log('p4');
  });
});

// 输出：s1,p1,p2,s2,p3,p4

setTimeout(() => {
  console.log('set1');
  Promise.resolve().then(() => {
    console.log('pro2');
  });
  Promise.resolve().then(() => {
    console.log('pro3');
  });
});

Promise.resolve().then(() => {
  console.log('pro1');
  setTimeout(() => {
    console.log('set2');
  });
  setTimeout(() => {
    console.log('set3');
  });
});

// 输出：pro1，set1，pro2，pro3，set2，set3

/* 完整事件循环执行顺序
 * + 从上至下执行所有同步代码
 * + 执行过程中将遇到宏任务与微任务添加至相应的队列
 * + 同步代码执行完毕后，执行满足条件的微任务回调
 * + 微任务队列执行完毕后执行所有满足需求的宏任务回调
 * + 循环事件环操作
 * + 注意：每执行一个宏任务之后就会立刻检查微任务队列
 */
```

#### 8.3.2、node的事件循环

```js
/**
 * nodejs的事件循环
 */

/* 1.在node的任务队列
 * timers: 执行setTimeout与setInterval回调
 * pending callbacks: 执行系统操作的回调，列如：tcp，udp
 * idle，prepare：只在系统内部进行使用
 * poll：执行I/O相关的回调
 * check：执行setImmediate中的回调
 * close callbacks：执行close事件的回调
 *
 * 2.完整的事件环
 * + 执行同步代码，将不同的任务添加至相应的队列
 * + 所有的同步代码执行后会去执行满足条件微任务
 * + 所有微任务代码执行后会执行timer队列中满足的宏任务
 * + timer中的所有宏任务执行完成后就会依次切换队列
 * 注意：在完成队列切换之前会清空微任务代码
 */

// timer队列
setTimeout(() => {
  console.log('s1');
});

// 微任务
Promise.resolve().then(() => {
  console.log('p1');
});

console.log('start');

// 微任务
process.nextTick(() => {
  console.log('tick');
});

// check队列
setImmediate(() => {
  console.log('setImmediate');
});

console.log('end');

// 输出：start tick p1 s1 setImmediate
// 注意：nextTick，Promise同为微任务，nextTick比Promise的优先级高
```

## 九、zlib模块

Node.js Zlib模块用于提供压缩和解压缩（zip和unzip）功能。它是使用Gzip和deflate / inflate实现的。

### 9.1、压缩

```js
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

/* 压缩 */
const gzip = zlib.createGzip();
const inp = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
console.log(inp);
const out = fs.createWriteStream(path.resolve(__dirname, 'input.gz'));
inp.pipe(gzip).pipe(out);
```

### 9.2、解压

```js
const unzip = zlib.createUnzip();
const inp = fs.createReadStream('input.gz');
const out = fs.createWriteStream('input2.txt');

inp.pipe(unzip).pipe(out);
```

## 十、url模块

用于获取和处理 url 地址信息

| API     | 作用              |
| ------- | ----------------- |
| parse   | 解析url地址信息   |
| format  | 格式化url地址信息 |
| resolve | 拼接url地址信息   |

```js
/**
 * url用于解析url地址信息，返回一个对象
 */
const url = require('url');

/* 1.parse */
const urlObj = url.parse(
  'https://www.bilibili.com/video/BV1sA41137qw?p=25&spm_id_from=pageDriver&vd_source=d98864db03bf0a91eb9938e99caaf433',
);
console.log(urlObj);

/* 2.format */
console.log(
  url.format({
    protocol: 'http',
    host: '127.0.0.1:8080',
    search: 'name=jack',
  }),
);

/* 3.resolve */
console.log(url.resolve('https://www.baidu.com', 'a/b?name=zhangsan'));
```

![image-20250727122053138](images/image-20250727122053138.png)

## 十一、querystring模块

querystring 模块转化参数格式

```js
/**
 * querystring模块
 */
const query = require('querystring');
const obj = {
  name: 'jack',
  age: 20,
};
console.log('string', query.stringify(obj)); // 输出：name=jack&age=20
```

## 十二、OS模块

os 模块提供了一些基本的系统操作函数。

```js
const os = require('os');

console.log(os.tmpdir()); // 返回操作系统的默认临时文件夹。
console.log(os.endianness()); // 返回 CPU 的字节序，可能的是 "BE" 或 "LE"。
console.log(os.hostname()); // 返回操作系统的主机名。
console.log(os.type()); // 返回操作系统名
console.log(os.platform()); // 返回编译时的操作系统名
console.log(os.arch()); // 返回操作系统 CPU 架构，可能的值有 "x64"、"arm" 和 "ia32"。
console.log(os.release()); // 返回操作系统的发行版本。
console.log(os.uptime()); // 返回操作系统运行的时间，以秒为单位。
console.log(os.totalmem()); // 返回系统内存总量，单位为字节。
console.log(os.freemem()); // 返回操作系统空闲内存量，单位是字节。
console.log(os.cpus()); // 返回一个对象数组，包含所安装的每个 CPU/内核的信息：型号、速度（单位 MHz）、时间（一个包含 user、nice、sys、idle 和 irq 所使用 CPU/内核毫秒数的对象）。
console.log(os.networkInterfaces()); // 获得网络接口列表。
```

## 十三、http和https模块

### 13.1、http搭建服务器

```js
const http = require('http');

// 创建web服务器
const server = http.createServer();

// 监听请求
server.on('request', function (req, res) {
  console.log('收到请求', req.url);
  res.setHeader('Content-Type', 'text/html;charset=utf-8'); // 解决乱码
  res.write('hello,world点击进入我的博客');
  res.end();
});

// 启动服务
server.listen(9527, function () {
  console.log('服务启动成功');
});
```

### 13.2、代理客户端

搭建服务器–agent-server.js

```js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log('请求进来了');
  let { pathname, query } = url.parse(req.url);
  console.log(pathname, '----', query);

  // post
  let arr = [];
  req.on('data', (data) => {
    arr.push(data);
  });
  req.on('end', () => {
    console.log(Buffer.concat(arr).toString());
    console.log(req.headers['content-type']);
    let obj = Buffer.concat(arr).toString();
    if (req.headers['content-type'] === 'application/json') {
      let a = JSON.parse(obj);
      a.add = '计算机';
      res.end(JSON.stringify(a));
    }
  });
});

server.listen(9528, () => {
  console.log('server is running');
});
```

模拟客户端向agent-server.js构建的服务器进行请求

```js
const http = require('http');

let options = {
  host: 'localhost',
  port: 9528,
  path: '/?a=1',
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let arr = [];
  res.on('data', (data) => {
    arr.push(data);
  });
  res.on('end', () => {
    console.log(Buffer.concat(arr).toString());
  });
});
// req.end('hello, jack!')
req.end('{"name":"cgh"}');
```

实际效果如下

![image-20250727122406953](images/image-20250727122406953.png)

agent-server.js 打印信息

![image-20250727122418908](images/image-20250727122418908.png)

### 13.3、https请求接口（代理客户端跨域）

通过客户端请求node服务，通过node去请求目标服务器，返回结果统一返回给客户端

常见用途：

1. 代理客户端跨域
2. 爬虫

```js
const https = require('https');
const http = require('http');

// 创建web服务器
const server = http.createServer();

// 监听请求
server.on('request', function (req, res) {
  console.log('收到请求', req.url);
  res.setHeader('Content-Type', 'text/html;charset=utf-8'); // 解决乱码
  httpPost((data) => {
    res.end(data);
  });
});

// 启动服务
server.listen(9527, function () {
  console.log('服务启动成功');
});

function httpPost(cb) {
  var data = '';
  const options = {
    hostname: 'm.xiaomiyoupin.com',
    port: 443,
    path: '/mtop/market/search/placeHolder',
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    },
  };
  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      cb(data);
    });
  });
  req.write(JSON.stringify([{}, { baseParam: { ypClient: 1 } }]));
  req.end();
}
```

实际效果如下

![image-20250727122657401](images/image-20250727122657401.png)

## 十四、Node的模块化支持

早期 JavaScript 这门语言是没有模块化的概念的，直到 node.js 诞生，才把模块系统引入js。node.js 使用的是 CJS（Commonjs）规范，也就是我们平时所见的 `require`、`module.exports` 。而 JavaScript 语言标准的模块规范是 `ESM（Ecmascript Module）`，也就是我们在前端工程大量使用的 `import`、`export` 语法。node.js 已经在逐步支持 ESM，目前很多主流浏览器也已经原生支持 ESM。

### 14.1、Node对模块的区分

在 Ndoe.js 12.17.0 版本之后 ， node.js 按以下流程判断模块系统是用 ESM 还是 CJS：

![1667655489844](images/1667655489844.png)

common.js

```javascript
const path = require('path');
console.log(path.resolve(__filename)); // f:\my-gitee\node\packages\node.js\14-module\common.js
```

esm.js 需要设置 package.json 的 type = module标识

```js
import path from 'node:path';

console.log(path.resolve()); // f:\my-gitee\node
```

esm.mjs

```js
import path from 'node:path';

console.log(path.resolve()); // f:\my-gitee\node
```

m.cjs

```js
const path = require('path');
console.log(path.resolve(__filename)); // f:\my-gitee\node\packages\node.js\14-module\m.cjs
```

### 14.2、模块入口

 我们知道有很多第三方库同时支持在 node.js 和浏览器环境执行，这种库通常会打包出 CJS 和 ESM 两种产物，CJS 产物给 node.js 用，ESM 产物给 webpack 之类的 bundler 使用。所以，当我们使用 require 和 import 导入模块 moduleA时，入口文件路径往往是不一样的。那么问题来了，如何让 node.js 或者 bundler 找到对应的入口文件呢？

 一般我们通过 package.json 的 main 字段定义 CJS 的入口文件，module 字段定义 ESM 的入口文件。

```json
{
  "name": "moduleA",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js"
}
```

这样，node.js 和 bundler 就知道分别从 ./dist/cjs/index.js 和 ./dist/esm/index.js 导入模块了。

 Node.js v12.16.0 给 package.json 增加了 exports 字段，允许我们在不同条件下匹配不同的路径。exports 有很多用处，包括区分 node.js 还是 browser 环境、区分 development 还是 production 环境、限制访问私有路径等。这里重点讲它对CJS 和 ESM 模块导入的影响。

我们可以这么定义：

```JSON
{
	"name": "moduleA",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "exports": {
  "import": "./dist/esm/index.js",
   "require": "./dist/cjs/index.js"
	}
}
```

 当使用 require('moduleA') 时，实际导入的是 node_modules/moduleA/dist/cjs/index.js，而使用 import moduleA from 'moduleA' 时，导入的是 node_modules/moduleA/dist/esm/index.js。

 exports 的优先级比 main 和 module 高，也就是说，匹配上 exports 的路径就不会使用 main 和 module 的路径。

 咋一看好像 exports 并没有给 CJS 和 ESM 带来多少新东西。的确，普通的场景来说，main 和 module 字段已经满足需求，但是如果要针对不同路径或者环境引入不同的 CJS 或者 ESM 模块，exports 就显然更灵活。而且 exports 是新规范，我们也有必要了解甚至在工程里尝试使用。

 当然，这里还是建议大家保留 main 和 module 字段，用来兼容不支持 exports 字段的 node.js 版本或 bundler。

### 14.3、区别

如果想用 ESM 写node.js，这里就要特别注意下

ESM 模块里没有 dirname、filename 这些变量，但我们可以通过 import.meta.url 和 node.js 的 url 模块（使用firedirname也可以）来解析出 dirname 和 filename。

```js
import path from 'node:path';

console.log(path.resolve(__dirname)); // Error:  __dirname is not defined in ES module scope
```

安装 filedirname 依赖包

```bash
npm i filedirname -S
```

```js
import path from 'node:path';

import filedirname from 'filedirname';

// console.log(path.resolve(__dirname)); // Error:  __dirname is not defined in ES module scope

const [filename, dirname] = filedirname(import.meta.url);

console.log('dirname: ', dirname);

console.log('filename: ', filename);
```

| CJS与ESM的区别       | 作用                                                         |
| -------------------- | ------------------------------------------------------------ |
| 特性被移除           | 在 ESM 中没有 dirname、filename 这些变量                     |
| 严格模式VS非严格模式 | CJS默认是非严格模式，而 ESM 默认是严格模式                   |
| 引用VS拷贝           | CJS模块require导入的是值的拷贝，而ESM导入的是值的引用        |
| 动态VS静态           | 我们都知道 JavaScript 是一门 JIT 语言，v8引擎拿到js代码后会边编译边执行，在编译的时候v8就给import导入的模块建立静态的引用，并且不能在运行时不能更改。所以import都放在文件开头，不能放在条件语句里。 |
| 异步VS同步           | ESM是顶层await的设计，而require是同步加载，所以require无法导入ESM模块，但是可以通过import()导入。 |

