---
outline: deep
---

# 闭包

## 一、闭包特点

1. 闭包通常涉及一个函数（称为内部函数或子函数）嵌套在另一个函数（称为外部函数或父函数）内部。
2. 内部函数可以访问并操作外部函数的局部变量，即使外部函数已经执行完毕。
3. 当内部函数被返回或者以其他方式被外部访问时，它仍然可以访问定义它的外部函数的变量。

如果对于不理解闭包特性，可以先理解 [作用域和作用域链](./scope/index) 以及 [高阶函数](./higher-function)

简单示例如下

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count += 1;
    return count;
  };
}

const counter = createCounter(); // 创建闭包
console.log(counter()); // 输出: 1
console.log(counter()); // 输出: 2

// 当确定不再使用闭包时，适当地断开对外部变量的引用
counter = null;
```

## 二、闭包作用

### 2.1、数据封装

闭包可以将函数和其相关的数据封装在一起，形成一个整体，从而提高代码的模块化和可维护性。

```javascript
/**
 * 数据封装
 */

function createCounter() {
  let count = 0; // 私有变量，仅在闭包内部可访问

  function increment() {
    count++; // 访问并修改了外部函数的私有变量
    console.log('Count:', count);
  }

  function decrement() {
    count--;
    console.log('Count:', count);
  }

  function getCount() {
    return count; // 通过闭包暴露了内部私有变量的值
  }

  return {
    increment: increment,
    decrement: decrement,
    getCount: getCount,
  };
}

// 使用闭包创建一个计数器实例
const counter = createCounter();
counter.increment(); // 输出: Count: 1
counter.increment(); // 输出: Count: 2
counter.decrement(); // 输出: Count: 1
console.log('Current Count:', counter.getCount()); // 输出: Current Count: 1
```

### 2.2、保存状态

闭包保持状态的基本原理是通过内部函数访问外部函数中的变量。当外部函数执行完成后，其内部定义的变量虽然不再处于活动状态，但由于内部函数仍然保留对这些变量的引用，这些变量的值仍然可以被内部函数访问和修改。

```javascript
function createCounter() {
  let count = 0;
  function increment() {
    count++;
    console.log('Count:', count);
  }
  return increment; // 返回内部函数
}
const counter = createCounter();
counter(); // 输出: Count: 1
counter(); // 输出: Count: 2
```

### 2.3、封装私有变量和方法

闭包可以实现私有化，即内部函数中的变量对外部是不可见的。这使得我们可以在JavaScript中实现类似于面向对象编程中的私有成员的功能

```javascript
function createPerson(name, age) {
  // 私有变量
  let _name = name;
  let _age = age;
  // 私有方法
  function isAdult() {
    return _age >= 18;
  }
  // 公共接口
  return {
    getName: function () {
      return _name;
    },
    setName: function (name) {
      _name = name;
    },
    getAge: function () {
      return _age;
    },
    setAge: function (age) {
      if (age >= 0) {
        _age = age;
      } else {
        console.error('Age cannot be negative');
      }
    },
    isAdult: isAdult,
  };
}
// 创建一个Person实例
const person = createPerson('Alice', 25);
console.log(person.getName()); // 输出: Alice
console.log(person.getAge()); // 输出: 25
console.log(person.isAdult()); // 输出: true
person.setAge(15);
console.log(person.getAge()); // 输出: 15
console.log(person.isAdult()); // 输出: false
```

## 三、闭包内存泄漏的风险

闭包会保持对外部环境的引用。如果闭包的生命周期很长，且不及时销毁，就可能导致外部作用域的变量无法被垃圾回收，从而导致内存泄漏。尤其是当闭包引用了大量的对象或变量时，这种情况更为严重。

示例如下

```javascript
function createLargeObject() {
    let largeObject = new Array(1000000).join('x'); // 模拟一个大对象
    return function() {
        console.log(largeObject);
    };
}

const closure = createLargeObject();
// 由于闭包的存在，largeObject 无法被垃圾回收，即使外部函数已经执行完毕
```

在上面的代码中，`largeObject` 被闭包引用，直到闭包被销毁，`largeObject` 的内存才会被回收。如果闭包长时间不销毁，会导致内存占用过高，从而可能引发性能问题。

如果在不需要的时候需要将 `closure = null;` 处理。