---
outline: deep
---

# 函数柯里化

## 一、定义和使用

在JavaScript中，函数柯里化（Currying）是一种技术，用于将一个多参数的函数转换成一系列使用一个单一参数的函数。

```javascript
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

let count = curriedAdd(1)(2)(3); // 6
console.log(count);
```

目前设计的curry函数只能满足 `f(a)(b)(c)` 形式的调用，其他形式的调用会报错。而且curry函数内部有多层函数嵌套的回调函数，造成代码的重复和难以维护。

## 二、柯里化的通用公式

函数柯里化又分为固定参数和任意参数。

```javascript
/**
 * 手动实现柯里化（固定参数）
 */
function curry(fn) {
  // 传递的 fn
  return function curried(...args) {
    // 如果传递的参数 大于或等于 传递函数的 fn 的参数长度
    // 也是终止函数
    if (args.length >= fn.length) {
      // 直接执行返回结果
      return fn.apply(this, args);
    } else {
      // 持续返回函数，并将 args 和 args2 进行合并成新的参数
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

const sum = function (a, b, c) {
  return a + b + c;
};

let newSum = curry(sum);
console.log(newSum(1, 2, 3)); // 6
console.log(newSum(1)(2)(3)); // 6
console.log(newSum(1, 2)(3)); // 6
console.log(newSum(1)(2, 3)); // 6
```

任意参数个数，原函数参数长度不确定

```javascript

/**
 * 任意参数个数，原函数参数长度不确定
 */
const add = (...args) => {
  let vars = args;

  // 定义 curried
  const curried = (...args) => {
    // 组合参数
    vars = [...vars, ...args];
    return curried;
  };

  curried.toString = () => {
    return vars.reduce((a, b) => a + b, 0);
  };

  return curried;
};

console.log(add(1).toString());
console.log(add(1, 2, 3).toString());
console.log(add(1)(2)(3).toString());
console.log(add(1)(2, 3)(4)(5).toString());
```

## 三、柯里化优缺点

柯里化函数的优点：

- 灵活性：将多个参数的函数转换成一系列只接受单个参数的函数，可以灵活地组合和使用函数
- 可复用性：将柯里化函数的一部分参数预设，从而得到新的函数，该函数可以直接使用，也可以作为其他函数的参数使用

柯里化函数的缺点：

- 可读性：原函数的调用变得更复杂，需要多次调用不同的函数才能得到最终结果，降低了代码的可读性