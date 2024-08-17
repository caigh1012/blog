---
title: Rxjs
description: Rxjs快速入门
sidebar_label: Rxjs快速入门
hide_title: true
---

## 一、Rxjs前置知识

### 1.1、Rxjs是什么

RxJS最早发布于2012年，它是微软`ReactiveX编程`理念的JavaScript版本， RxJS 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序， 它结合了`观察者模式`、`迭代器模式` 和 `使用集合的函数式编程`

### 1.2、RxJS解决异步事件管理的的基本概念

| 概念                    | 描述                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Observable (可观察对象) | 表示一个概念，这个概念是一个可调用的未来值或事件的集合                                                            |
| Observer (观察者)       | 一个回调函数的集合，它知道如何去监听由 Observable 提供的值                                                        |
| Subscription (订阅)     | 表示 Observable 的执行，主要用于取消 Observable 的执行                                                            |
| Operators (操作符)      | 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合          |
| Subject (主体)          | 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式                                           |
| Schedulers (调度器)     | 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他 |

### 1.3、Rxjs使用流程分析

```js
import { Observable } from 'rxjs';

/**
 * @description: Rxjs使用流程分析
 * @date: 2023-05-01
 **/
// 通过new Observable()创建一个可观察对象, 参数传入一个函数，函数参数为subscriber，可以调取next方法进行连续通信
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  });
});

console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');

/*
 * 打印结果：
 * just before subscribe
 * got value 1
 * got value 2
 * got value 3
 * just after subscribe
 * got value 4
 * done
 * */
```

## 二、官方案例分析

### 2.1、基于事件程序处理

```js
import { fromEvent } from 'rxjs';

// 1. 基于Javascript的API处理
document.addEventListener('click', () => console.log('Clicked!'));
// Rxjs处理事件，替代Javascript的API
fromEvent(document, 'click').subscribe(() => console.log('Clicked!'));
```

### 2.2、Rxjs的纯函数处理

```js
import { fromEvent, scan } from 'rxjs';
// 2. Rxjs的纯函数处理
// 纯API处理
let count = 0;
document.addEventListener('click', () => console.log(`Clicked ${++count} times`));
// Rxjs的处理
fromEvent(document, 'click')
  .pipe(scan((count) => count + 1, 0))
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

### 2.3、Rxjs的流处理

> 主要是通过`Observer的pipe函数进行流处理`

```js
// 3. Rxjs的流处理
// Javascript原生处理
let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`);
    lastClick = Date.now();
  }
});

// Rxjs处理
fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    scan((count) => count + 1, 0),
  )
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

### 2.4、获取事件值

```js
import { fromEvent, scan, throttleTime, map } from 'rxjs';
// 4.获取Values值
// 原生的处理方式
let count = 0;
const rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', (event) => {
  if (Date.now() - lastClick >= rate) {
    count += event.clientX;
    console.log(count);
    lastClick = Date.now();
  }
});

// Rxjs的处理
fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    map((event) => event.clientX),
    scan((count, clientX) => count + clientX, 0),
  )
  .subscribe((count) => console.log(count));
```

## 三、RxJS的Observable(可观察对象)

### 3.1、new Observable

```js
import { Observable } from 'rxjs';

//  new Observable创建一个可观察对象
const foo = new Observable((subscriber) => {
  console.log('Hello');
  subscriber.next(42);
  subscriber.next(100);
  subscriber.next(200);
  setTimeout(() => {
    subscriber.next(300); // happens asynchronously
  }, 1000);
});

console.log('before');
foo.subscribe((x) => {
  console.log(x);
});
console.log('after');

/**
 * 打印结果：
 * before
 * Hello
 * 42
 * 100
 * 200
 * after
 * 300
 **/
```

### 3.2、next\*(error|complete)?

```js
const observable01 = new Observable(function subscribe(subscriber) {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // 不会打印结果
  } catch (err) {
    subscriber.error(err); // delivers an error if it caught one
  }
});

observable01.subscribe((x) => {
  console.log(x);
});

/**
 * 打印结果：
 * 1
 * 2
 * 3
 **/
```

### 3.3、配置Observable返回值

> 因为Observable的执行可能是无限的，而且观察者通常希望在有限的时间内终止执行，所以我们需要一个API来取消执行。由于每次执行只对一个Observer独占，因此一旦Observer完成接收值，它必须有一种方法来停止执行，以避免浪费计算能力或内存资源。

点击页面时取消定时器

```js
const observable02 = new Observable(function subscribe(subscriber) {
  // Keep track of the interval resource
  const intervalId = setInterval(() => {
    subscriber.next('hi');
  }, 1000);

  // Provide a way of canceling and disposing the interval resource
  return function unsubscribe() {
    clearInterval(intervalId);
  };
});

const subscription = observable02.subscribe({ next: (x) => console.log(x) });

document.addEventListener('click', () => {
  subscription.unsubscribe();
});
```

## 四、RxJS的Observer(观察对象)

> 使用`new Observable`构造出来的可观察对象。调用`subscribe`方法时，可以传入一个函数，该函数为一个`next`回调函数，也可以传入一个对象，该对象包含`error`、`next`、`complete`属性

```js
import { Observable } from 'rxjs';

const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('done'),
};

const observable = new Observable(function (subscriber) {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.complete();
  } catch (e) {
    subscriber.error(e);
  }
});

// 当subscribe函数为一个对象时
observable.subscribe(observer);

// 当subscribe函数为一个函数时
observable.subscribe((x) => console.log(x));
```

## 五、RxJS的Operators(操作符)

### 5.1、操作符是什么？

操作符就是一个函数，该操作符存在两种功能操作符：

1. Pipeable Operators：官方解释为operatorFactory函数，具体主要在pipe的使用，操作符工厂函数包括filter(…)和mergeMap(…)。
1. Creation Operators：该操作符会创建`new Observable`可观察对象

案例分析：

```js
import { of, map } from 'rxjs';

/**
 * @description: RxJS的核心概念之一、Operators
 * @date: 2023-05-02
 **/
of(1, 2, 3) // of为Creation Operators，返回的是一个Observable可观察对象
  .pipe(map((x) => x * x)) // map为Pipeable Operators
  .subscribe((v) => console.log(`value: ${v}`));
```

### 5.2、Piping

> 可管道操作符，可以接受多个Pipeable Operators

```js
obs.pipe(op1(), op2(), op3(), op4());
```

### 5.3、操作符按用途分类

> 详细使用可参考官网[RxJS](https://rxjs.dev/)地址

#### 5.3.1、Creation Operators

- ajax
- bindCallback
- bindNodeCallback
- defer
- empty
- from
- fromEvent
- fromEventPattern
- generate
- interval
- of
- range
- throwError
- timer
- iif

#### 5.3.2、Join Creation Operators

- combineLatest
- concat
- forkJoin
- merge
- partition
- race
- zip

#### 5.3.3、Transformation Operators

- buffer
- bufferCount
- bufferTime
- bufferToggle
- bufferWhen
- concatMap
- concatMapTo
- exhaust
- exhaustMap
- expand
- groupBy
- map
- mapTo
- mergeMap
- mergeMapTo
- mergeScan
- pairwise
- partition
- pluck
- scan
- switchScan
- switchMap
- switchMapTo
- window
- windowCount
- windowTime
- windowToggle
- windowWhen

#### 5.3.4、Filtering Operators

- audit
- auditTime
- debounce
- debounceTime
- distinct
- distinctUntilChanged
- distinctUntilKeyChanged
- elementAt
- filter
- first
- ignoreElements
- last
- sample
- sampleTime
- single
- skip
- skipLast
- skipUntil
- skipWhile
- take
- takeLast
- takeUntil
- takeWhile
- throttle
- throttleTime

#### 5.3.5、Join Operators

- combineLatestAll
- concatAll
- exhaustAll
- mergeAll
- switchAll
- startWith
- withLatestFrom

#### 5.3.6、Multicasting Operators

- multicast
- publish
- publishBehavior
- publishLast
- publishReplay
- share

#### 5.3.7、Error Handling Operators

- catchError
- retry
- retryWhen

#### 5.3.8、Utility Operators

- tap
- delay
- delayWhen
- dematerialize
- materialize
- observeOn
- subscribeOn
- timeInterval
- timestamp
- timeout
- timeoutWith
- toArray

#### 5.3.9、Conditional and Boolean Operators

- defaultIfEmpty
- every
- find
- findIndex
- isEmpty

#### 5.3.10、Mathematical and Aggregate Operators

- count
- max
- min
- reduce

### 5.4、创建自定义操作符

#### 5.4.1、使用该 `pipe()` 函数创建新运算符

```javascript
import { pipe, filter, map, of } from 'rxjs';

function discardOddDoubleEven() {
  return pipe(
    filter((v) => !(v % 2)),
    map((v) => v + v),
  );
}

// 使用自定义创建的操作符
of(1, 2, 3)
  .pipe(discardOddDoubleEven())
  .subscribe((v) => console.log(`value: ${v}`)); // 输出：4
```

🔔注意： 该 `pipe()` 函数类似于可观察量上 `.pipe()` 的方法，但不是一回事。

#### 5.4.2、从头开始创建新运算符

```javascript
import { of, Observable } from 'rxjs';

function delay(delayInMillis) {
  return (observable) =>
    new Observable((subscriber) => {
      // this function will be called each time this
      // Observable is subscribed to.
      const allTimerIDs = new Set();
      let hasCompleted = false;
      const subscription = observable.subscribe({
        next(value) {
          // Start a timer to delay the next value
          // from being pushed.
          const timerID = setTimeout(() => {
            subscriber.next(value);
            // after we push the value, we need to clean up the timer timerID
            allTimerIDs.delete(timerID);
            // If the source has completed, and there are no more timers running,
            // we can complete the resulting observable.
            if (hasCompleted && allTimerIDs.size === 0) {
              subscriber.complete();
            }
          }, delayInMillis);

          allTimerIDs.add(timerID);
        },
        error(err) {
          // We need to make sure we're propagating our errors through.
          subscriber.error(err);
        },
        complete() {
          hasCompleted = true;
          // If we still have timers running, we don't want to complete yet.
          if (allTimerIDs.size === 0) {
            subscriber.complete();
          }
        },
      });

      // Return the finalization logic. This will be invoked when
      // the result errors, completes, or is unsubscribed.
      return () => {
        subscription.unsubscribe();
        // Clean up our timers.
        for (const timerID of allTimerIDs) {
          clearTimeout(timerID);
        }
      };
    });
}

// Try it out!
of(1, 2, 3).pipe(delay(1000)).subscribe(console.log); // 一秒后打印 1，2，3
```

## 六、 Subscription

### 6.1、 unsubscribe

```js
import { interval } from 'rxjs';
const observable = interval(1000);
const subscription = observable.subscribe((x) => console.log(x));
document.addEventListener('click', () => {
  subscription.unsubscribe();
});
```

### 6.2、subscription的add方法

```js
/**
 * @name: 案例02
 * @description: 通过subscription的add添加childSubscription，同时进行取消
 * @date: 2023-05-02
 **/
const observable1 = interval(400);
const observable2 = interval(300);
const subscription = observable1.subscribe((x) => console.log('first: ' + x));
const childSubscription = observable2.subscribe((x) => console.log('second: ' + x));
subscription.add(childSubscription);

setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe();
}, 1000);
```

## 七、 Subjects

### 7.1、Subject

> `Subject`其实是观察者模式的实现，所以当观察者订阅`Subject`对象时，它会把订阅者添加到观察者列表中，每当有接收到新值时，它就会遍历观察者列表，依次调用观察者内部的`next`方法，把值一一送出。

```js
import { Subject } from 'rxjs';

const subject = new Subject();

subject.next(1);
subject.subscribe((value) => {
  console.log(`订阅者A：值为${value}`);
});

subject.next(2);
subject.subscribe((value) => {
  console.log(`订阅者B：值为${value}`);
});

subject.next(3);
```

### 7.2、BehaviorSubject

> 我们会希望`Subject`能代表当下的状态，而不是单纯的事件发送，也就是说如果当前有一个新的订阅，我们希望`Subject`能立即给出最新的值，而不是没有回应。这个时候我们就可以使用到, `BehaviorSubject`继承自`Subject`，它具有存储当前值的特征。这表示你可以始终直接从`BehaviorSubject`获取到最后发出的值。

```js
const behaviorSubject = new BehaviorSubject(0);

behaviorSubject.subscribe((value) => {
  console.log(`behaviorSubject订阅值: 值为${value}`); // 如果不进行next，值为0，进行next之后就是next更新后的值
});
```

### 7.3、ReplaySubject

> 简单来说，ReplaySubject传入一个数字类型，用于保存next传入的值。

```js
const replay$ = new ReplaySubject(3);
replay$.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
replay$.next(1);
replay$.next(2); // 会被存入
replay$.next(3); // 会被存入
replay$.next(4); // 会被存入

replay$.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

replay$.next(5); // 重新发出另外一个值，两个订阅者都接收到值的改变

/*
 * 输出结果：
 * observerA: 1
 * observerA: 2
 * observerA: 3
 * observerA: 4
 * observerB: 2
 * observerB: 3
 * observerB: 4
 * observerA: 5
 * observerB: 5
 * */
```

结果分析：

当进行next调用时，在`new ReplaySubject`中传入了3，所以`next(2)、next(3)、next(4)`会存储起来，当有`observerB`重新订阅时，这时它就会发出这些存储最后的几个值， `replay$`发出另外一个值，这时候，订阅者 A 和订阅者 B 都接收到值的改变，打印出另外一个值

### 7.4、AsyncSubject

```JS
const async$ = new AsyncSubject()

async$.subscribe((value)=>{
  console.log(`订阅者A，值为：${value}`)
})

async$.next(1)
async$.next(2)

async$.subscribe((value)=>{
  console.log(`订阅者B，值为：${value}`)
})

async$.next(3)
async$.complete() // 若不进行complete的调用，不会触发，并且只会触发最后一个订阅的值

/*
* 打印结果：
* 订阅者A，值为：3
* 订阅者B，值为：3
* */
```

## 八、Scheduler(调度器)

什么是调度程序？计划程序控制订阅的开始时间和传递通知的时间。它由三个部分组成。

- 调度程序是一种数据结构。它知道如何根据优先级或其他条件存储和排队任务。
- 调度程序是一个执行上下文。它表示任务执行的位置和时间（例如，立即执行，或在另一种回调机制中，如setTimeout或process.nextTick，或动画帧）。
- 调度程序有一个（虚拟）时钟。它通过调度程序上的 getter 方法 `now()` 提供“时间”的概念。在特定计划程序上计划的任务将仅遵循该时钟指示的时间。

_调度程序允许您定义可观察对象将在哪个执行上下文中向其观察者传递通知。_

案例分析：

```javascript
import { Observable, observeOn, asyncScheduler } from 'rxjs';

const observable = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
}).pipe(observeOn(asyncScheduler));

console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');

/**
 * 打印结果：
 * just before subscribe
 * just after subscribe
 * got value 1
 * got value 2
 * got value 3
 * done
 */
```

依上面例子，如果不使用`asyncScheduler`时，`just after subscribe`应该在`got value`之后，这里却先打印，主要`asyncScheduler`的 `async` 调度程序

### 8.1、Scheduler Types(调度程序类型)

| SCHEDULER 调度          | PURPOSE 目的                                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| null                    | 通过不传递任何计划程序，通知将以同步和递归方式传递。将其用于常量时间操作或尾递归操作。                         |
| queueScheduler          | 在当前事件框架中的队列上计划（蹦床计划程序）。将其用于迭代操作。                                               |
| asapScheduler           | 微任务队列上的计划，该队列与用于承诺的队列相同。基本上是在当前作业之后，但在下一个作业之前。将其用于异步转换。 |
| asyncScheduler          | 时间表与 一起使用 `setInterval` 。将其用于基于时间的操作。                                                     |
| animationFrameScheduler | 计划将在下次浏览器内容重绘之前执行的任务。可用于创建流畅的浏览器动画。                                         |

### 8.2、部分操作符可以将调度程序作为参数

静态创建运算符通常将调度程序作为参数。例如， `from(array, scheduler)` 允许您指定在传递从 . `array` 它通常是运算符的最后一个参数。以下静态创建运算符采用调度程序参数：

- bindCallback
- bindNodeCallback
- combineLatest
- concat
- empty
- from
- fromPromise
- interval
- merge
- of
- range
- throw
- timer
