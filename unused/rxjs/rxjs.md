---
outline: deep
---

# Rxjs入门指南

## 一、Rxjs介绍

Rxjs 最早发布于2012年，它是微软 `ReactiveX编程` 理念的 JavaScript 版本， Rxjs 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序， 它结合了 `观察者模式`、`迭代器模式`  和 `使用集合的函数式编程` 

RxJS解决异步事件管理的的基本概念

| 概念                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| Observable (可观察对象) | 表示一个概念，这个概念是一个可调用的未来值或事件的集合       |
| Observer (观察者)       | 一个回调函数的集合，它知道如何去监听由 Observable 提供的值   |
| Subscription (订阅)     | 表示 Observable 的执行，主要用于取消 Observable 的执行       |
| Operators (操作符)      | 用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合 |
| Subject (主体)          | 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式 |
| chedulers (调度器)      | 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他 |

## 二、Rxjs案例使用分析

### 2.1、Observable 使用

```javascript
import { Observable } from 'rxjs';

// 通过 new Observable() 创建一个可观察对象, 参数传入一个函数，函数参数为 subscriber，可以调取 next 方法进行连续通信
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

### 2.2、基于事件程序处理

```javascript
/**
 * 基于事件程序处理
 */
// 1. 基于Javascript的API处理
document.addEventListener('click', () => console.log('Clicked!'));

// 2. Rxjs处理事件，替代Javascript的API
fromEvent(document, 'click').subscribe(() => console.log('Clicked!'));
```

### 2.3、Rxjs的纯函数处理

```javascript
/**
 * Rxjs的纯函数
 */

// 基于Javascript的API处理
let count = 0;
document.addEventListener('click', () => console.log(`Clicked ${++count} times`));

// Rxjs的处理
fromEvent(document, 'click')
  .pipe(scan((count) => count + 1, 0))
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

### 2.4、Rxjs的流处理

主要是通过 Observer 的`pipe` 函数进行流处理

```javascript
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

/**
 * 获取Values值
 */
fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    scan((count) => count + 1, 0),
  )
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

### 2.5、获取事件值

```javascript
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

## 三、Rxjs的Observable(可观察对象)

### 3.1、通过 new 创建 Observable

```javascript
import { Observable } from 'rxjs';

//  new Observable创建一个可观察对象
const observable = new Observable((subscriber) => {
  console.log('Hello');
  subscriber.next(42);
  subscriber.next(100);
  subscriber.next(200);
  setTimeout(() => {
    subscriber.next(300); // happens asynchronously
  }, 1000);
});

console.log('before');
observable.subscribe((x) => {
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

### 3.2、next | error | complete

```javascript
const observable = new Observable((subscriber) => {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // complete 之后不会再执行 next
  } catch (err) {
    subscriber.error(err); // delivers an error if it caught one
  }
});

observable.subscribe((x) => {
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

因为 Observable 的执行可能是无限的，而且观察者通常希望在有限的时间内终止执行，所以我们需要一个API来取消执行。由于每次执行只对一个 Observer 独占，因此一旦 Observer 完成接收值，它必须有一种方法来停止执行，以避免浪费计算能力或内存资源。

```javascript
const observable = new Observable((subscriber) => {
  // Keep track of the interval resource
  const intervalId = setInterval(() => {
    subscriber.next('hi');
  }, 1000);

  // Provide a way of canceling and disposing the interval resource
  return function unsubscribe() {
    clearInterval(intervalId);
  };
});

const subscription = observable.subscribe({ next: (x) => console.log(x) });

document.addEventListener('click', () => {
  subscription.unsubscribe();
  console.log('定时器结束');
});
```

## 四、Rxjs的Observer(观察对象)

使用 new Observable 构造出来的可观察对象。调用 subscribe 方法时，可以传入一个函数，该函数为一个 next 回调函数，也可以传入一个对象，该对象包含 error、next、complete 属性。

```javascript
import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.complete();
  } catch (e) {
    subscriber.error(e);
  }
});

// 当 subscribe 函数为一个对象时
observable.subscribe({
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('done'),
});

// 当subscribe 函数为一个函数时，默认为 next
observable.subscribe((x) => console.log(x));
```

## 五、Rxjs的Operators(操作符)

### 5.1、操作符介绍

操作符就是一个函数，该操作符存在两种功能操作符：

1. Pipeable Operators：官方解释为 operatorFactory 函数，具体主要在 pipe 的使用，操作符工厂函数包括 filter 和 mergeMap。
2. Creation Operators：该操作符会创建 new Observable 可观察对象

```javascript
import { of, map } from 'rxjs';

of(1, 2, 3) // of为Creation Operators，返回的是一个Observable可观察对象
  .pipe(map((x) => x * x)) // map为Pipeable Operators
  .subscribe((v) => console.log(`value: ${v}`));
```

### 5.2、管道操作符pipe

可管道操作符，可以接受多个Pipeable Operators

```javascript
obs.pipe(op1(), op2(), op3(), op4());
```

### 5.3、操作符按用途分类

详细使用可参考官网 [RxJS](https://rxjs.dev/) 地址

| 操作符用途分类                       | 操作符                                                       |
| ------------------------------------ | ------------------------------------------------------------ |
| Creation Operators                   | ajax、bindCallback、bindNodeCallback、from、empty、fromEvent、generate、interval、of等 |
| Join Creation Operators              | combineLatest、concat、forkJoin、merge、partition            |
| Transformation Operators             | buffer、exhaust、map、pairwise、scan、window                 |
| Filtering Operators                  | filter、first、last、throttle、take、skip                    |
| Join Operators                       | combineLatestAll、mergeAll、switchAll、startWith             |
| Multicasting Operators               | multicast、publish、publishBehavior、publishReplay、share    |
| Error Handling Operators             | catchError、retry、retryWhen                                 |
| Utility Operators                    | tap、delay、timeInterval、timeout、timeoutWith、toArray      |
| Conditional and Boolean Operators    | defaultIfEmpty、every、find、findIndex、isEmpty              |
| Mathematical and Aggregate Operators | count、max、min、reduce                                      |

### 5.4、创建自定义操作符

#### 5.4.1、使用 pipe() 函数创建新运算符

```javascript
/**
 * 创建自定义操作符
 */
// 使用自定义创建的操作符
function discardOddDoubleEven() {
  return pipe(
    filter((v) => !(v % 2)),
    map((v) => v + v),
  );
}

of(1, 2, 3)
  .pipe(discardOddDoubleEven())
  .subscribe((v) => console.log(`value: ${v}`)); // 输出：4
```

注意：该 pipe() 函数类似于可观察量上 `.pipe()` 的方法，但不是一回事。

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

## 六、Subscription

### 6.1、unsubscribe

```javascript
const observable = interval(1000);
const subscription = observable.subscribe((x) => console.log(x));
document.addEventListener('click', () => {
  subscription.unsubscribe();
});
```

### 6.2、subscription的add方法

```javascript
/**
 * 2. subscription
 * 用 Subscription.add() 方法来将多个 Subscription 合并管理
 */
const observable1 = interval(400);
const observable2 = interval(300);

const subscription = observable1.subscribe((x) => console.log('first: ' + x));
const childSubscription = observable2.subscribe((x) => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
  // 统一关联 subscription，可以通过 unsubscribe() 可以取消多个订阅
  subscription.unsubscribe();
}, 1000);
```

## 七、Subjects

### 7.1、Subject

Subject 其实是观察者模式的实现，所以当观察者订阅 Subject 对象时，它会把订阅者添加到观察者列表中，每当有接收到新值时，它就会遍历观察者列表，依次调用观察者内部的 next 方法，把值一一送出。 

```javascript
/**
 * 1. Subjects
 */
const subject = new Subject();

subject.subscribe((value) => {
  console.log(`订阅者A：值为${value}`);
});

subject.subscribe((value) => {
  console.log(`订阅者B：值为${value}`);
});

subject.next(1);
subject.next(2);
subject.next(3);
```

### 7.2、BehaviorSubject

我们会希望 `Subject` 能代表当下的状态，而不是单纯的事件发送，也就是说如果当前有一个新的订阅，我们希望 `Subject` 能立即给出最新的值，而不是没有回应。这个时候我们就可以使用到， `BehaviorSubject` 继承自 `Subject`，它具有存储当前值的特征。这表示你可以始终直接从 `BehaviorSubject` 获取到最后发出的值。 

```javascript
/**
 * 2. BehaviorSubject
 */
const behaviorSubject = new BehaviorSubject(0);

behaviorSubject.subscribe((value) => {
  console.log(`behaviorSubject订阅值: 值为${value}`); // 如果不进行next，值为0，进行next之后就是next更新后的值
});xxxxxxxxxx12 1const behaviorSubject = new BehaviorSubject(0);23behavio/**4 * 2. BehaviorSubject5 */6const behaviorSubject = new BehaviorSubject(0);78behaviorSubject.subscribe((value) => {9  console.log(`behaviorSubject订阅值: 值为${value}`); // 如果不进行next，值为0，进行next之后就是next更新后的值10});rSubject.subscribe((value) => {11  console.log(`behaviorSubject订阅值: 值为${value}`); // 如果不进行next，值为0，进行next之后就是next更新后的值12});
```

### 7.3、ReplaySubject

简单来说，ReplaySubject 传入一个数字类型，用于保存 next 传入的值。

```javascript
/**
 * 3.ReplaySubject
 * 简单来说，ReplaySubject传入一个数字类型，用于保存next传入的值。
 */
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
 * */
```

### 7.4、AsyncSubject

```javascript
const async$ = new AsyncSubject();

async$.subscribe((value) => {
  console.log(`订阅者A，值为：${value}`);
});

async$.next(1);
async$.next(2);

async$.subscribe((value) => {
  console.log(`订阅者B，值为：${value}`);
});

async$.next(3);
async$.complete(); // 若不进行complete的调用，不会触发，并且只会触发最后一个订阅的值

/*
 * 打印结果：
 * 订阅者A，值为：3
 * 订阅者B，值为：3
 * */
```

