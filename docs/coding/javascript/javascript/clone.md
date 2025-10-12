---
outline: deep
---

# 浅拷贝和深拷贝

## 一、引用地址赋值示例

在讲浅拷贝和深拷贝之前，先了解一个示例，代码如下

```javascript
let a = {
  name: '张三',
  age: '18',
  firend: [{ name: '李四', age: '20' }],
};
let b = a.firend; // 进行的地址引用赋值
a.firend.push({ name: '王五', age: '23' });
console.log(b, '<___b');
```

具体的了解可以查看 [JavaScript值传递和引用传递]()

## 二、浅拷贝

浅拷贝创建一个对象，这个对象有着原始对象属性值的精确拷贝。如果是属性是基本类型，拷贝的是基本类型的值；如果属性是引用类型，拷贝的是内存地址。

### 2.1、展开运算符

```javascript
// 1. 展开运算符
const original = { a: 1, b: { c: 2 } };
const copy = { ...original };

copy.b.c = 5;
console.log(copy, original, '展开运算符'); // original 的 b.c 都变为了 5
```

### 2.2、Object.assign()

```javascript
const original = { a: 1, b: { c: 2 } };
const copy = Object.assign({}, original);
copy.b.c = 5;
console.log(copy, original, 'Object.assign()'); // original 的 b.c 都变为了 5
```

## 三、深拷贝

深拷贝会创建一个新对象，并且递归地拷贝原始对象内所有对象或数组到新对象内。这意味着无论有多少层嵌套，都会创建一个完全独立的副本。

```javascript
function cloneDeep(source) {
  // 1.处理基本类型 和 null
  if (typeof source !== 'object' || source === null) return source;

  const tag = Object.prototype.toString.call(source).slice(8, -1);

  // 2.处理其他引用类型
  switch (tag) {
    case 'Date':
      return new Date(source.getTime());
    case 'RegExp': {
      const result = new RegExp(source.source, source.flags);
      result.lastIndex = source.lastIndex;
      return result;
    }
    case 'Map': {
      const result = new Map();
      source.forEach((v, k) => result.set(k, cloneDeep(v)));
      return result;
    }
    case 'Set': {
      const result = new Set();
      source.forEach((v) => result.add(cloneDeep(v)));
      return result;
    }
  }

  // 3.处理对象和数组
  const isArray = tag === 'Array';
  const isObject = tag === 'Object';

  if (isObject || isArray) {
    const newValue = isArray ? [] : {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        newValue[key] = cloneDeep(source[key]);
      }
    }
    return newValue;
  }
}

const obj = {
  name: '张三',
  age: 18,
  hobby: ['唱', '跳', 'rap', '篮球'],
  time: new Date(),
  arr: [1, 2, 3],
  set: new Set([1, 2, 3]),
  map: new Map([
    ['a', 1],
    ['b', 2],
  ]),
};

const cloneDeepObj = cloneDeep(obj);

console.log(cloneDeepObj, 'cloneDeep');
```



