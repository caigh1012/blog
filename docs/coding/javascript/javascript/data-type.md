# 数据类型判断

```javascript
/**
 * 判断 js 数据类型有以下几种方式：
 * 1. typeof 操作符
 * 2. instanceof 操作符
 * 3. Object.prototype.toString
 */

/**
 * 1. typeof 操作符
 */
console.log(typeof 'Hello'); // 输出: string
console.log(typeof 42); // 输出: number
console.log(typeof true); // 输出: boolean
console.log(typeof undefined); // 输出: undefined
console.log(typeof Symbol()); // 输出: symbol
console.log(typeof function () {}); // 输出: function
console.log(typeof {}); // object

// 缺陷：对于 null Date对象，Map对象、Set对象输出都是 obeject 都无法进行区分
console.log(typeof null); // 输出: object (这是一个特殊情况)
console.log(typeof new Date()); // 返回 object
console.log(typeof new Set()); // 返回 object
console.log(typeof new Array()); // 返回 object

/**
 * 2. instanceof 操作符
 * 用来判断一个对象是否某个构造函数的实例，这对于区分对象和数组等引用类型有用
 */
let arr = new Array();
let date = new Date();

// 包含自定义类区分
class User {
  constructor(name) {
    this.name = name;
  }
}

let user = new User('张三');
console.log(arr instanceof Array); // true
console.log(date instanceof Date); // true
console.log(user instanceof User); // true

/**
 * 3. Object.prototype.toString.call(数据).slice(8, -1)
 * 可以返回一个表示该对象的字符串。这个方法非常强大，因为它可以区分不同的对象类型，甚至是内置对象和宿主对象
 */
console.log(Object.prototype.toString.call(1).slice(8, -1)); // Number
console.log(Object.prototype.toString.call('1').slice(8, -1)); // String
console.log(Object.prototype.toString.call(Symbol()).slice(8, -1)); // Symbol
console.log(Object.prototype.toString.call(function () {}).slice(8, -1)); // Function
console.log(Object.prototype.toString.call(null).slice(8, -1)); // Null
console.log(Object.prototype.toString.call(undefined).slice(8, -1)); // Undefined
console.log(Object.prototype.toString.call({}).slice(8, -1)); // Object
console.log(Object.prototype.toString.call(new Date()).slice(8, -1)); // Date
console.log(Object.prototype.toString.call(new Map()).slice(8, -1)); // Map
console.log(Object.prototype.toString.call(new Set()).slice(8, -1)); // Set
console.log(Object.prototype.toString.call(new Array()).slice(8, -1)); // Array

// 缺陷：一个对象是否是某个构造函数的实例
console.log(Object.prototype.toString.call(user).slice(8, -1)); // Object
```

