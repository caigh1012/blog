---
outline: deep
---

# this指向

this 是在 JavaScript 中是一个特殊的关键字，它代表的是函数执行上下文中的 “当前对象”。然而，this 的指向并不是固定的，它取决于函数是如何被调用的。

## 一、this指向分类

### 1.1、全局作用域this

```javascript
// 在浏览器环境中，this指向window对象，在node环境中指向 global 对象
console.log(this);
```

在严格模式下，this 指向 undefined。在非严格模式下，浏览器环境中，this指向window对象，在node环境中指向 global 对象。

### 1.2、普通函数调用

```javascript
function foo() {
  console.log(this); // 在浏览器环境中，this指向window对象，在node环境中指向 global 对象
}

foo();
```

### 1.3、对象内的函数调用

当一个函数作为对象的一个方法被调用时，`this` 通常指向那个对象。

```javascript
/**
 * 对象函数调用
 */
var obj = {
  name: 'John',
  foo: function () {
    console.log(this); // 在浏览器环境中，this 指向 obj 对象
  },
};

obj.foo(); // 在浏览器环境中，this 指向 obj 对象
```

由上述示例进行演变

```javascript

var obj1 = {
  name: 'Jack',
  foo: function () {
    console.log(this); // 在浏览器环境中，this指向 obj1 对象
    return function () {
      console.log(this);
    };
  },
};

obj1.foo()(); // 返回的函数在全局作用域下执行，this 指向 window

const fn = obj1.foo();
fn(); // 返回的函数在全局作用域下执行，this 指向 window
```

### 1.4、构造函数中的this

使用 new 关键字调用构造函数时，this 指向新创建的对象实例。

```javascript
/**
 * 构造函数
 */

class User {
  constructor(name) {
    this.name = name;
    console.log(this);
  }

  getName() {
    return this.name;
  }
}

const user = new User('John');
console.log(user.getName()); // 输出: John
```

### 1.5、this指向的 “特殊情况”

在 JavaScript 里，`this` 的指向完全取决于函数被调用的方式，而不是它被定义的位置（箭头函数除外）。

```javascript
/**
 * this指向的 “特殊情况”
 */

// setTimeout中的延迟执行代码中的 this 永远都指向 window（严格模式下）
// 默认绑定
setTimeout(function () {
  console.log(this); // 浏览器非严格模式：window；严格模式：undefined
}, 0);

// map/filter 回调：也是默认绑定，但可以传入 thisArg 显式绑定。
// 如果不传，内部实现类似于 callback(item, index, arr)，所以 this 指向与 setTimeout 类似
[1, 2, 3].map(function () {
  console.log(this); // 输出： window
});

// 内部大致实现原理
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    // 如果传入了 thisArg，就用它作为 this；否则传 undefined
    result.push(callback.call(thisArg, this[i], i, this));
  }
  return result;
};

// 事件监听回调：显式绑定。浏览器事件系统在调用监听器时，
// 会将 this 设置为绑定事件的元素（即 event.currentTarget），相当于 callback.call(element, event)。举例。
document.getElementById('root').addEventListener('click', function () {
  console.log(this); // 元素对象
});
```

如果将 ` function () {} ` 换成箭头函数会有差别，this 继承外围函数作用域的 this

```javascript
setTimeout(() => {
  console.log(this); // 输出：window
}, 0);

[1, 2, 3].map(() => {
  console.log(this); // 输出：window
});

document.getElementById('root').addEventListener('click', () => {
  console.log(this); // 输出：window
});
```

对于 setTimeout 的匿名函数和数组 map、filter 等函数的匿名函数作为回调函数，this 始终都是 window

```javascript
var name = 'John';

var obj = {
  name: 'Jack',
  getName: function () {
    console.log(this); // 输出: {  name: 'Jack' }
    setTimeout(function () {
      console.log(this.name, 'function () {}'); // 输出：John (指向window)
    });
  },
  getNameArrowFn: function () {
    console.log(this); // 输出: {  name: 'Jack' }
    setTimeout(() => {
      console.log(this.name, '() => {}'); // 输出： Jack
    }, 0);
  },
  arrayMap: function () {
    console.log(this); // 输出: {  name: 'Jack' }
    [1, 2, 3].map(function () {
      console.log(this.name); // 输出：John (指向window)
    });
  },
  arrayMapArrowFn: function () {
    console.log(this); // 输出: {  name: 'Jack' }
    [1, 2, 3].map(() => {
      console.log(this.name); // 输出： Jack
    });
  },
};

obj.getName();
obj.getNameArrowFn();

obj.arrayMap();
obj.arrayMapArrowFn();
```

对于返回的匿名函数（非箭头函数），this 指向却决于当前执行上下文的 this

```javascript
var obj = {
  name: 'John',
};

var obj1 = {
  name: 'Jack',
  getThis: function () {
    console.log(this); // 在浏览器环境中，this指向 obj1 对象
    return function () {
      console.log(this); // 当前 this 指向取决于调用的执行上下文
    };
  },
};

var foo = obj1.getThis();

foo(); // 输出：window

obj.foo = obj1.getThis();
obj.foo(); // 输出：{ name: "John", foo: f() }
```

### 1.6、箭头函数

箭头函数没有 this 指向，而是继承自外围函数的作用域中的 this，始终牢记这一原则对于箭头函数的 this 指向问题就会迎刃而解

```javascript
/**
 * 箭头函数
 */

var foo = () => {
  console.log(this); // 输出: Window 对象
};

var obj = {
  name: 'John',
  method: function () {
    console.log(this); // 输出: obj 对象
    var arrowFunc = () => {
      console.log(this); // 输出: obj 对象，因为箭头函数不绑定自己的 this
    };
    arrowFunc();
  },
};

obj.method();
```

由上述代码进行一次演变

```javascript
var obj1 = {
  name: 'jack',
  method: function () {
    console.log(this); // 输出: obj1 对象
    return () => {
      console.log(this); // 输出: obj1 对象, 因为继承外部环境的 this
    };
  },
};

obj1.method()();
```

由上述代码将 obj1 的 method 方法改变 this 指向时，返回的箭头函数的 this 也会发生改变，因为箭头函数继承于外围函数的作用域中的 this

```javascript
obj1.method.call(this)(); // 输出 window
```

## 二、bind、call、apply函数改变this指向

bind、call 和 apply 是 JavaScript 中用于改变函数执行时 this 指向的方法

### 2.1、bind函数

bind 会创建一个新的函数，并将原始函数绑定到指定的上下文,以后可以进行复用。这意味着无论在什么时候调用这个新函数，它都会使用绑定的上下文。bind 方法可以接收多个参数，第一个参数是要绑定的上下文对象，后面的参数是要传递给原始函数的参数。

```javascript
var name = '张三';

const user = { name: '李四' };

/**
 * 原始函数
 */
function getUserName(age, hobby) {
  console.log(this.name);
  console.log(age, hobby);
}

/**
 * 在全局调用
 */
getUserName(18, '打球');

/**
 * bind 会返回一个新的函数
 * 第一个参数：指定的上下文（this）
 * 后续参数：都是传递给原始函数的参数
 */
const getUserNameByBind = getUserName.bind(user);

getUserNameByBind(19, '踢球');
```

### 2.2、call函数

call 可以在指定的上下文中调用函数，并传递一个或多个参数。与 bind 不同的是，call 会立即调用函数，而不是返回一个新函数，所以并不能像 bind 一样进行复用。call 方法的第一个参数是要绑定的上下文对象，后面的参数是要传递给函数的参数。

```javascript
var name = '张三';

const user = { name: '李四' };

/**
 * 原始函数
 */
function getUserName(age, hobby) {
  console.log(this.name);
  console.log(age, hobby);
}

/**
 * 在全局调用
 */
getUserName(18, '打球');

getUserName.call(user, 19, '踢球');
```

### 2.3、apply函数

apply 在指定的上下文中调用函数，并传递一个数组作为参数。与 call 类似，apply 也是立即调用函数。第一个参数是要绑定的上下文对象，但与 call 不同的是，apply 的第二个参数是一个数组这个数组里面包含要传递给函数的参数。

```javascript
var name = '张三';

const user = { name: '李四' };

/**
 * 原始函数
 */
function getUserName(age, hobby) {
  console.log(this.name);
  console.log(age, hobby);
}

/**
 * 在全局调用
 */
getUserName(18, '打球');

getUserName.apply(user, [19, '踢球']);
```

### 2.4、对于箭头函数能否调用bind、call、apply

原则上对于不允许箭头函数调用 bind、call、apply，原因是箭头函数继承外围函数的作用域的this，相当于在定义时就已经绑定。如果强行调用，在语法上不会报错，但是  this 指向不会改变。如下示例代码

```javascript
/**
 * 对于箭头函数是否能调用 bind、call、apply
 */

var name = '张三';

var user = {
  name: '李四',
};

var foo = () => {
  console.log(this.name);
};

foo(); // 输出：张三

foo.call(user); // 输出：张三

foo.apply(user); // 输出：张三

var foo1 = foo.bind(user);

foo1(); // 输出：张三
```

