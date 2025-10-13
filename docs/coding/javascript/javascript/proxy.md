---
outline: deep
---

# Proxy代理与Reflect

## 一、Proxy使用

Proxy 会对目标（target）对象进行包装。它可以是任何类型的对象，包括原生的数组、函数甚至是另一个代理对象。

```javascript
/**
 * Proxy 代理
 */

let target = { name: '张三', age: 18 };

/**
 * 创建 target 代理
 * new Proxy(target, handler)
 * target 为目标元素
 * handler 为一个对象，其属性是定义了在对代理执行操作时的行为的函数
 */
let targetProxy = new Proxy(target, {
  // 用于监听获取对象值的操作
  get: function (target, prop) {
    console.log(target, prop);
    return target[prop];
  },
  // 用于监听对象的某个属性被设置时触发
  set: function (target, prop, value) {
    target[prop] = value;
  },
});

let n = targetProxy.name;

console.log(n);
```

对于更多的 handler 的处理函数参考 [MDN Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)

## 二、Object.defineProperty

Object.defineProperty 可以实现设定 getter、setter 方法进行监听和拦截，前提是需要对对象的每个属性逐个设置，比较繁琐。

```javascript
/**
 * 在 ES5 中使用 Object.defineProperty （对象属性描述符）对对象的监听，将一个对象进行遍历，并设定getter、setter方法进行监听和拦截。
 */
let obj = {
  name: '李四',
  age: 19,
};

Object.keys(obj).forEach((key) => {
  let val = obj[key];

  Object.defineProperty(obj, key, {
    get: function () {
      console.log(key + '调用了get方法');
      return val;
    },
    set: function (newVal) {
      console.log(key + '调用了set方法');
      val = newVal;
    },
  });
});

// 操作obj对象
obj.name = '王五';

obj.age = 30;

console.log(obj.name);

/**
 * Object.defineProperty的设计初衷并不是为了去监听拦截一个对象中的属性，且他也实现不了更加丰富的操作，
 * 例如添加、删除属性等操作。所以在ES6中新增了Proxy对象，用于监听Object、Function的操作。
 */
```

更多细节的使用参考 [MDN defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

## 三、Reflect

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 [Proxy handler](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) 的方法相同。`Reflect` 不是一个函数对象，因此它是不可构造的。

### 3.1、Reflect使用

```javascript
/**
 * Reflect
 */
const duck = {
  name: 'Maurice',
  color: 'white',
  greeting: function () {
    console.log(`Quaaaack! My name is ${this.name}`);
  },
};

// 判断属性是否存在
console.log(Reflect.has(duck, 'color'));
// 获取属性列表
console.log(Reflect.ownKeys(duck));

// 设置 duck 的 eyes 属性值
Reflect.set(duck, 'eyes', 'black');

console.log(duck);
```

Reflect 一般是一些写法上的更替，内容如下

```javascript
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);

// 旧写法
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});

// 新写法
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});
```

### 3.2、Reflect写法与常规写法差异

#### 3.2.1、返回值设计差异

成功/失败返回方式不同

```javascript
const obj = {};

// Object.defineProperty - 失败时抛出错误
try {
  Object.defineProperty(obj, 'readonly', {
    value: 42,
    writable: false
  });
  console.log('成功');
} catch (e) {
  console.log('失败:', e.message);
}

// Reflect.defineProperty - 返回布尔值
const success = Reflect.defineProperty(obj, 'readonly', {
  value: 42,
  writable: false
});
console.log(success ? '成功' : '失败');
```

设置操作返回值

```javascript
const obj = {};

// Object 方式 - 返回传入的对象
const result1 = Object.defineProperty(obj, 'name', { value: 'John' });
console.log(result1 === obj); // true

// Reflect 方式 - 返回布尔值表示成功与否
const result2 = Reflect.defineProperty(obj, 'age', { value: 25 });
console.log(result2); // true 或 false
```

#### 3.2.2、函数式 vs 命令式

```javascript
const obj = { name: 'Alice' };

// Object 方式 - 更多是命令式操作
if ('name' in obj) {
  const value = obj.name;
  delete obj.name;
}

// Reflect 方式 - 函数式风格，易于组合
const operations = [
  () => Reflect.has(obj, 'name'),
  () => Reflect.get(obj, 'name'),
  () => Reflect.deleteProperty(obj, 'name')
];

operations.forEach(op => console.log(op()));
```

#### 3.2.3、与 Proxy 的完美配合

```javascript
const target = { name: 'Alice', age: 25 };

const proxy = new Proxy(target, {
  get(obj, prop, receiver) {
    console.log(`读取属性: ${prop}`);
    
    // 不好的做法：直接返回 obj[prop]
    // return obj[prop]; // 这样会丢失 receiver
    
    // 好的做法：使用 Reflect.get
    return Reflect.get(obj, prop, receiver); // 保持正确的 this 绑定
  },
  
  set(obj, prop, value, receiver) {
    console.log(`设置属性: ${prop} = ${value}`);
    
    // 直接设置：obj[prop] = value
    // 但使用 Reflect.set 更一致
    return Reflect.set(obj, prop, value, receiver);
  }
});
```



