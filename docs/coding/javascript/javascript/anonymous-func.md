---
outline: deep
---

# 匿名函数和立即执行函数

## 一、匿名函数

在JavaScript中，匿名函数（也称为函数表达式或 lambda 表达式）是一种非常灵活且强大的特性，它允许你在不命名函数的情况下定义和立即使用函数。

```javascript
function() {
    // 函数体
}

// 或
() => {
    // 函数体
}
```

匿名函数可以配合 [高阶函数](./higher-function) 一起使用，这时匿名函数就和普通函数类似。也可以和立即执行的函数表达式一起使用

```javascript
setTimeout(function() {
    console.log('Hello after 2 seconds!');
}, 2000);

// 使用箭头函数简化
setTimeout(() => {
    console.log('Hello after 2 seconds!');
}, 2000);
```

匿名函数的缺陷：

1. 匿名函数不具备函数提升
2. 匿名函数再递归中调用困难

## 二、立即执行函数

### 2.1、立即执行函数写法

立即执行函数的两种写法

```javascript
// 第一种：用括号把整个函数定义和调用包裹起来
// 这里不能替换为箭头函数
(function(){
 // 函数体
}())

//第二种：用括号把函数定义包裹起来，后面再加括号
(function (){
 // 函数体
})()
// 还可以使用箭头函数
(() => {
  // 函数体
})();
```

在这里比较推荐第二种，第一种方式无法替换成箭头函数。

### 2.2、立即执行函数参数

```javascript
/**
 * 立即执行函数
 */
(function (a) {
  console.log(this); // 打印 window
  console.log(a); // 打印 1
})(1);
```



