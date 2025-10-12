---
outline: deep
---

# 预解析与变量提升

在 [V8如何执行JavaScript代码](../browser/v8/index.md) 中讲述了 V8 执行 JavaScript 代码的基本流程，本文将深入探讨预解析（Pre-Parsing）和变量提升（Hoisting）的概念。

在预解析过程中：

1. 使用 var 关键字声明的变量提升到当前作用域的最前面。只会提升声明，不会提升赋值

2. 把函数的声明提升到当前作用域的最前面。只会提升声明，不会提升赋值

## 一、var 变量提升

当在 JS 文件直接打印一个变量时通常报错误：`a is not defined`，正是因为变量 a 未定义。

```javascript
console.log(a); // a is not defined
```
对于 var 关键字定义变量时，可以先使用后定义，原因是在代码执行前，JavaScript 会将 var 变量声明提升到当前作用域的顶部，但不会提升赋值操作。而对于 let、const 关键字则必须先定义后使用。

```javascript
console.log(a); // 打印 undefined
// 在代码执行前，JavaScript 会将 var 变量声明提升到当前作用域的顶部，但不会提升赋值操作。
var a = 1;
console.log(a); // 打印 1
```
由于 var 声明的变量存在变量提升，上述代码相当于


```javascript
var a;
console.log(a);
a = 1;
console.log(a); // 打印 1
```

## 二、函数声明变量提升

函数声明会被提升到当前作用域的顶部，函数可以在声明之前调用。

```javascript
foo();

// 声明函数
function foo() {
  console.log('foo');
}
```

上述代码相当于

```javascript
// 声明函数
function foo() {
  console.log('foo');
}

foo();
```

使用 var 关键字声明一个变量赋值一个函数，参考 var 变量提升，变量会被提升到函数作用域顶部并不会赋值

```javascript
bar(); // 此处会报错，因为 bar 被初始化 undefined，所以需要在赋值之后调用 // [!code error]

var bar = function () {
  console.log('bar');
};
```

```javascript
bar(); // [!code --]

var bar = function () {
  console.log('bar');
};

bar(); // 正确调用 // [!code ++]
```

## 三、var声明的变量名与函数名相同

当遇到函数和变量同名且都会被提升的情况时, 函数声明的优先级是要大于变量声明的。

### 3.1、当 var 声明的变量存储非函数时且与函数名相同

当 var 声明的变量存储非函数时且与函数名相同，该变量会覆盖函数声明，导致函数无法被调用。

```javascript
var foo = 1;

foo(); // Error: foo is not a function // [!code error]

function foo() {
  console.log('foo');
}
```

上述代码相当于

```javascript
function foo() {
  console.log('foo');
}
var foo;
foo = 1;
foo();
```

### 3.2、当 var 声明的变量存储函数时且与函数名相同

当 var 声明的变量存储函数时且与函数名相同，函数声明会被提升到作用域顶部，变量赋值会在声明之后。因此，函数可以在声明之前调用，但变量赋值会覆盖函数声明。

```javascript
foo(); // 输出：函数

var foo = function () {
  console.log('变量');
};

foo(); // 输出：变量

function foo() {
  console.log('函数');
}

foo(); // 输出：变量
```

上述代码相当于

```javascript
function foo() {
  console.log('函数');
}

var foo;

foo(); // 输出：函数

foo = function () {
  console.log('变量');
};

foo(); // 输出：变量
foo(); // 输出：变量
```

## 四、变量提升只提升到当前作用域

先引入一段作用域链相关代码

```javascript
var a = 10;

function foo() {
  console.log(a); // 访问全局作用域的 a，打印10
}
```

这里也可以在给全局变量 a 进行赋值操作

```javascript
var a = 10;

function foo() {
  console.log(a); // 访问全局作用域的 a，打印10
  a = 20; // [!code ++]
  console.log(a); // 打印 20 // [!code ++]
}
```

但是当给 foo 函数中 `a = 20;` 代码前加 var ，此刻差异就大了

```javascript
var a = 10; // 全局作用域的 a

function foo() {
  console.log(a); // 访问函数作用域的 a 打印 undefined
  var a = 20; // 在函数作用域内声明的变量 a
  console.log(a); // 打印 20
}
```

上述代码相当于

```javascript
var a; // 全局作用域的 a
a = 10;

function foo() {
  var a;
  console.log(a); // 访问函数作用域的 a 打印 undefined
  a = 20; // 在函数作用域内声明的变量 a
  console.log(a); // 打印 20
}
```

加上了 var 相当于 a 变成了函数作用域内变量 a，在函数内部也发生了变量提升，并且在当前作用域内。以下代码是全局作用域和函数作用域的变量提升。

```javascript
console.log(a); // 打印 undefined
var a = 10;
console.log(a); // 打印 10

function foo() {
  console.log(a); // 打印 undefined
  var a = 20; // 在函数作用域内声明的变量 a
  console.log(a); // 打印 20
}
```

