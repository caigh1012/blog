---
outline: deep
---

# Promise实现原理分析

## 一、Promise实现原理分析

```javascript
class Promise {
  // 定义 Promise 的三种状态
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  // executor 为传递的函数
  constructor(executor) {
    this.state = Promise.PENDING;
    this.value = undefined;
    this.reason = undefined;

    // .then 方法存储
    this.onFulfilledCallbacks = [];
    // .catch 方法存储
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      // 只有状态为 PENDING，才会执行并更改状态
      if (this.state === Promise.PENDING) {
        // 更改状态
        this.state = Promise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      // 只有状态为 PENDING，才会执行并更改状态
      if (this.state === Promise.PENDING) {
        this.state = Promise.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      // 执行创建过来的函数
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then 方法
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 创建新 Promise 并返回
    const p1 = new Promise((resolve, reject) => {
      // 直接处理成功的调用
      if (this.state === Promise.FULFILLED) {
        setTimeout(() => {
          try {
            // onFulfilled 方法可以在 setTimeout 的外部调用，当时由于需要对 onFulfilled 执行是否错误进行 try catch 处理所以这里放入内部调用
            const x = onFulfilled(this.value);
            resolvePromise(p1, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        // 直接处理失败的调用
      } else if (this.state === Promise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(p1, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        // 直接处理请求中的调用
      } else if (this.state === Promise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(p1, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(p1, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return p1;
  }

  // catch 方法
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // Promise.resolve 方法
  static resolve(value) {
    if (value instanceof Promise) {
      return value;
    }
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // Promise.reject 方法
  static reject(reason) {
    return new Promise((_, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  //判断 x 和 promise2 之间的关系
  //因为 promise2 是上一个 promise.then 后的返回结果，所以如果相同，会导致下面的.then会是同一个 promise2，一直都是，没有尽头
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  //如果 x 不是 null，是对象或者方法
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 为了判断 resolve 过的就不用再reject了，（比如有reject和resolve的时候）
    let called;

    try {
      //防止then出现异常，Object.defineProperty
      let then = x.then; // 取x的then方法可能会取到{then:{}},并没有执行
      if (typeof then === 'function') {
        //我们就认为他是promise,call他,因为then方法中的this来自自己的promise对象
        then.call(
          x,
          (y) => {
            //第一个参数是将 x 这个 promise 方法作为this指向，后两个参数分别为成功失败回调
            if (called) return;
            called = true;
            //因为可能 promise 中还有 promise，所以需要递归
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            //一次错误就直接返回
            reject(err);
          },
        );
      } else {
        //如果是个普通对象就直接返回resolve作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    //这里返回的是非函数，非对象的值,就直接放在 promise2 的 resolve 中作为结果
    resolve(x);
  }
}

let p = new Promise((resolve, reject) => {
  console.log('构造函数内部执行');
  resolve(1);
});

p.then((res) => {
  console.log(res, 'res');
  return { X: 2 };
}).then((res) => {
  console.log(res, 'res5');
});
```

🔔注意：原生 Promise 的 then 方法回调是作为微任务执行的，而使用 setTimeout 实现的是宏任务。这在实际使用中会有差异。

## 二、Promise面试题分析

### 2.1、Promise单独考验面试题

题 1 如下

```javascript
console.log('start'); // 1

// 在 new Promise 过程中传递的函数是可以执行的，并且是同步任务
let p = new Promise((resolve) => {
  console.log(1, '1'); // 2
  resolve(1);
});

// then 函数为异步最后执行
p.then((res) => {
  console.log(res);
});

console.log('end'); // 3

// 输出：start、1 1、end、1
```

题 2 如下

```javascript
console.log('start');

Promise.resolve(1).then((res) => {
  console.log(res);
});

Promise.resolve(2).then((res) => {
  console.log(res);
});

console.log('end');

// 输出：start、end、1、2
```

题 3 如下

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
  reject('error');
});

promise
  .then(() => {
    console.log(3);
  })
  .catch((e) => console.log(e)); // 不执行

// 多个 then 是会执行的，还是微任务
promise.then(() => {
  console.log(5);
});

console.log(4);

// 输出：1 2 4 3 5
```

题 4 如下

```javascript
console.log('start');

const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve('success');
  });

console.log('middle');

fn().then((res) => {
  console.log(res);
});

console.log('end');

// 输出：start、middle、1、end、success
```

### 2.2、宏任务与微任务面试题结合

题 1 如下

```javascript
console.log(1); // 1

setTimeout(function () {
  console.log(2); // 5
}, 0);

new Promise(function (resolve) {
  console.log(3); // 2
  resolve(Date.now());
}).then(function () {
  console.log(4); // 4
});

console.log(5); // 3

setTimeout(function () {
  new Promise(function (resolve) {
    console.log(6); // 6
    resolve(Date.now());
  }).then(function () {
    console.log(7); // 7
  });
}, 0);

// 输出：1 3 5 4 2 6 7
```

题 2 如下

```javascript
console.log(1); // 1

setTimeout(function () {
  console.log(2); // 5
}, 1000); // 加了 1 秒后执行，在宏任务中排队

new Promise(function (resolve) {
  console.log(3); // 2
  resolve(Date.now());
}).then(function () {
  console.log(4); // 4
});

console.log(5); // 3

setTimeout(function () {
  new Promise(function (resolve) {
    console.log(6); // 6
    resolve(Date.now());
  }).then(function () {
    console.log(7); // 7
  });
}, 0);

// 输出：1 3 5 4 6 7 2
```

题 3 如下

```javascript
console.log('start');

Promise.resolve().then(() => {
  console.log(1);
  setTimeout(() => {
    console.log(2);
  }, 0);
});

setTimeout(() => {
  console.log(3);
  Promise.resolve().then(() => {
    console.log(4);
  });
}, 0);

console.log('end');

// 输出：start、end、1、3、4、2
```

题 4 如下

```javascript
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve(6); // promise 状态只能改一次，所以resolve(6)不会执行
      }, 0);
      resolve(1);
    });

    resolve(2);

    p.then((arg) => {
      console.log(arg);
    });
  });

first().then((arg) => {
  console.log(arg);
});

console.log(4);

// 输出：3、7、4、1、2、5
```

### 2.3、async、await和Promise面试题结合

🔔牢记：async 返回的是一个 Promise 对象，并且 async 内部在不遇到 await 时都是同步操作。await 关键字只能在 async 函数内部使用。它可以暂停 async 函数的执行，等待 Promise 的解决（resolve），然后以 Promise 的值继续执行函数。

题 1 如下

```javascript
console.log('start');

// async 返回的是一个 Promise
async function foo() {
  // async 在遇到 await 之前都是同步操作
  console.log(1);
  return 2;
}

foo().then((res) => {
  console.log(res);
});

console.log('end');

// 输出 start、1、end、2
```

题 2 如下

```javascript
console.log('start');

function bar() {
  return new Promise((resolve) => {
    resolve(3);
  });
}

// 异步
async function foo() {
  console.log(1);

  let a = await bar();
  console.log(a);

  return 2;
}

foo().then((res) => {
  console.log(res);
});

console.log('end');

// 输出：start、1、end、3、2
```

题 3 如下

```javascript
console.log('start');

function bar() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 2000);
  });
}

// 异步
async function foo() {
  console.log(1);

  let a = await bar(); // 需要等待 3 秒才能执行
  console.log(a);

  return 2;
}

// foo 函数执行
foo().then((res) => {
  console.log(res);
});

console.log('end');
```

题 4 如下

```javascript
async function fn1() {
  console.log('fn1 start');
  await fn2();
  console.log('fn1 end');
  await fn3();
  console.log('fn3 end');
}

async function fn2() {
  console.log('fn2');
}

async function fn3() {
  console.log('fn3');
}

console.log('start');
fn1();
console.log('end');

/**
 * 输出：
 * start
 * fn1 start
 * fn2
 * end
 * fn1 end
 * fn3
 * fn3 end
 */
```

### 2.4、async、await和Promise和宏任务结合

题 1 如下

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  // 后续为异步执行任务
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

console.log('script end');

/**
 * 输出：
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 */
```

题 2 如下

```javascript
async function asy1() {
  console.log(1);
  await asy2();
  console.log(2);
}

const asy2 = async () => {
  await setTimeout(() => {
    Promise.resolve().then(() => {
      console.log(3);
    });
    console.log(4);
  }, 0);
};

const asy3 = async () => {
  Promise.resolve().then(() => {
    console.log(6);
  });
};

asy1();
console.log(7);
asy3();

// 输出：1 7 6 2 4 3
```

题 3 如下

```javascript
async function asy1() {
  console.log(1);
  await asy2();
  console.log(2);
}

async function asy2() {
  console.log(3);
  let a = await Promise.resolve(1).then(() => {
    console.log(6);
  });
  console.log(a, 'a'); // undefined
  console.log(5);
}

asy1();
console.log(7);

// 输出：1 3 7 6 5 2
```



