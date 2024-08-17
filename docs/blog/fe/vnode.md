---
title: Virtual DOM
description: Virtual DOM理解
sidebar_label: Virtual DOM理解
hide_title: true
---

## 一、什么是Virtual DOM

snabbdom 是 Virtual DOM 的一种实现，所以在此之前，你需要先知道什么是 Virtual DOM。通俗的说，Virtual DOM 就是一个 js 对象，它是真实 DOM 的抽象，只保留一些有用的信息，更轻量地描述 DOM 树的结构。 比如在 snabbdom 中，是这样来定义一个 VNode 的：

```ts
export interface VNode {
  sel: string | undefined;
  data: VNodeData | undefined;
  children: Array<VNode | string> | undefined;
  elm: Node | undefined;
  text: string | undefined;
  key: Key | undefined;
}

export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: VNodeStyle;
  dataset?: Dataset;
  on?: On;
  hero?: Hero;
  attachData?: AttachData;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  [key: string]: any; // for any other 3rd party module
}
```

从上面的定义我们可以看到，我们可以用 js 对象来描述 dom 结构，那我们是不是可以对两个状态下的 js 对象进行对比，记录出它们的差异，然后把它应用到真正的 dom 树上呢？答案是可以的，这便是 diff 算法，算法的基本步骤如下：

1. 用 js 对象来描述 dom 树结构，然后用这个 js 对象来创建一棵真正的 dom 树，插入到文档中
1. 当状态更新时，将新的 js 对象和旧的 js 对象进行比较，得到两个对象之间的差异
1. 将差异应用到真正的 dom 上

## 二、Virtual DOM的作用和不足

### 2.1、减少对真实DOM的操作

真实DOM 因为浏览器厂商需要实现众多的规范（各种 HTML5 属性、DOM事件），即使创建一个空的 div 也要付出昂贵的代价。如以下代码，打印空的div属性一共298个。而这仅仅是第一层。真正的 DOM 元素非常庞大。直接操作DOM可能会导致频繁的回流和重绘。

```js
const div = document.createElement('div');
const arr = [];
for (key in div) {
  arr.push(key);
}
console.log(arr.length); // 298
```

对复杂的文档DOM结构（复杂视图情况下提升渲染性能），提供一种方便的工具，进行最小化地DOM操作。既然我们可以用JS对象表示DOM结构，那么当数据状态发生变化而需要改变DOM结构时，我们先通过JS对象表示的虚拟DOM计算出实际DOM需要做的最小变动（Virtual DOM会使用diff算法计算出如果有效的更新dom，只更新状态改变的DOM），然后再操作实际DOM，从而避免了粗放式的DOM操作带来的性能问题，减少对真实DOM的操作。

### 2.2、无需手动操作 DOM，维护视图和状态的关系

我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，MVVM框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率。

### 2.3、跨平台

虚拟DOM是对真实的渲染内容的一层抽象，是真实DOM的描述，因此，它可以实现“一次编码，多端运行”，可以实现SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等。

### 2.4、Virtual DOM有什么不足

上面我们也说到了在复杂视图情况下提升渲染性能。虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟DOM 无法进行针对性的极致优化。首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。

## 三、snabbdom源码浅析

> 一个虚拟DOM库，重点放在简单性，模块化，强大的功能和性能上

核心文件夹是`src目录。`里面包含了如下文件夹及其目录：

- helpers：里面只有一个文件attachto.ts，这个文件主要作用是定义了几个类型在vnode.ts文件中使用。
- modules：里面存放着snabbdom模块，分别是attributes.ts、class.ts、dataset.ts、eventlisteners.ts、props.ts、style.ts这6个模块。另外一个module.ts这个文件为它们提供了钩子函数。
- h.ts：创建Vnode。
- hook.ts：提供钩子函数。
- htmldomapi：提供了DOM API。
- index.ts：snabbdom 入口文件。
- init.ts：导出了patch函数。
- is.ts：导出了两个方法。一个方法是判断是否是数组，另一个判断是否是字符串或数字。
- jsx.ts：与jsx相关。
- thunk.ts：与优化key相关。
- tovnode.ts：真实DOM 转化为 虚拟DOM。
- vnode.ts：定义了Vnode的结构。

## 四、实现一个简易的snabbdom

### 4.1、创建vnode.js文件和is.js文件

#### 4.1.1、is.js文件

代码如下：

```js
// 判断是否为一个数组
export const array = Array.isArray;

// 判断是否为一个字符串类型和数字类型
export function primitive(s) {
  return (
    typeof s === 'string' || typeof s === 'number' || s instanceof String || s instanceof Number
  );
}
```

#### 4.1.2、vnode.js

代码如下：

```js
/**
 * vnode函数用于创建一个虚拟dom节点
 * @params
 * sel：为一个元素标签名(TagName)或者元素标签名加id和class属性，例如：div#app.test
 * data：记录虚拟节点的数据，例如：style，class，props等属性
 * children：该元素下的子节点
 * text：该元素的文本节点
 * elm：存储的真实dom
 */
export function vnode(sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key; // 如果data存在时，取data.key，没有取undefined
  return { sel, data, children, text, elm, key };
}
```

### 4.2、h函数实现

源代码如下：

```js
import { array, primitive } from './is';
import { vnode } from './vnode';

/*
 * h函数实现
 * @Date: 2023-03-06 09:46
 */
export function h(sel, b, c) {
  // sel-选择器，b-data，c表示数组-children
  let data = {};
  let children;
  let text;
  let i;
  // 处理参数，实现重载的机制
  if (c !== undefined) {
    // 处理三个参数的时
    if (b !== null) {
      data = b;
    }
    if (array(c)) {
      // 如果c是数组
      children = c;
    } else if (primitive(c)) {
      // 如果c是字符串和数字
      text = c.toString();
    } else if (c && c.sel) {
      // 如果c是Vnode
      children = [c];
    }
  } else if (b !== undefined && b !== null) {
    // 处理两个参数
    // 如果b是数组
    if (array(b)) {
      children = b;
    } else if (primitive(b)) {
      // 如果b是字符串或者数字
      text = b.toString();
    } else if (b && b.sel) {
      // 如果b是Vnode
      children = [b];
    } else {
      data = b;
    }
  }

  if (children !== undefined) {
    for (i = 0; i < children.length; i++) {
      // 如果children中的原始值(string/number)
      if (primitive(children[i]))
        children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }

  return vnode(sel, data, children, text, undefined);
}
```

🔔注意：<u>这里去除了源码中对SVG元素的支持</u>

测试代码实现：

```js
let vnode = h('div#app', {}, [
  '文本节点',
  h('p', 'p2'),
  h('a', { props: { href: '/' } }, 'Go to'),
  h('!', {}, '这是一个注释节点'),
]);
console.log(vnode, '<____vnode');
```

代码执行结果：

![1678631356912](https://gitee.com/caigh1012/assets/raw/main/blog/fe/vnode/1678631356912.png)

### 4.3、htmldomapi.js

```js
// 创建元素
function createElement(tagName, options) {
  return document.createElement(tagName, options);
}

// 创建文本节点
function createTextNode(text) {
  return document.createTextNode(text);
}

// 创建注释节点
function createComment(text) {
  return document.createComment(text);
}

// 插入节点
function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

// 移除节点
function removeChild(node, child) {
  return node.removeChild(child);
}

// 添加节点
function appendChild(node, child) {
  node.appendChild(child);
}

// 返回一个父节点
function parentNode(node) {
  return node.parentNode;
}

// 返回一个兄弟节点
function nextSibling(node) {
  return node.nextSibling;
}

// 返回元素标签名(tagName)
function tagName(elm) {
  return elm.tagName;
}

// 设置文本text
function setTextContent(node, text) {
  node.textContent = text;
}

// 获取文本text
function getTextContent(node) {
  return node.textContent;
}

// 是否为元素节点
function isElement(node) {
  return node.nodeType === 1;
}

// 是否为文本节点
function isText(node) {
  return node.nodeType === 3;
}

// 是否为注释文本节点
function isComment(node) {
  return node.nodeType === 8;
}

export const htmlDomApi = {
  createElement,
  createTextNode,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isComment,
  isText,
};
```

### 4.4、init.js实现(重要部分)

> 这里去除了源码对SVG元素和文档碎片节点(DocumentFragment)

init.js导出init函数，改函数存在两个参数：1.modules，2.domApi。modules是style.js，class.js等更新和对比新旧节点的属性，类的封装函数。init函数执行返回一个patch函数，该patch函数接收新旧节点，patch内部会对新旧节点进行差异性对比，删除旧节点中新节点没有的属性，同时更新新节点更新的属性。同时init.js文件创建部分utils等函数。

#### 4.4.1、init.js文件结构如下

```js
import { htmlDomApi } from './htmldomapi'
import { vnode } from "./vnode";
import { array, primitive } from "./is";

// 判断是否为undefined
function isUndef(s) {
  return s === undefined
}

// 判断是否不为undefined
function isDef(s) {
  return s !== undefined
}

// 是否为一个元素
function isElement(api, vnode) {
  return api.isElement(vnode)
}

// 创建空的虚拟节点
const emptyNode = vnode('',{},[],undefined,undefined)

// 是否为同一节点，这里去除了源码的is条件
function sameVnode(vnode1, vnode2) {
  ...
}

// 使用节点key作为index，制作map映射
function createKeyToOldIdx(children, beginIdx, endIdx) {
  ...
}

const hooks = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post",
]

export function init(modules, domApi) { // modules：数组，domApi：DOM操作的api
  const api = domApi !== undefined ? domApi : htmlDomApi; // 如果domApi不为undefined就为默认的

  // cbs存储modules执行的钩子函数
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  // 循环为cbs添加钩子函数
  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook]).push(currentHook);
      }
    }
  }

  // 元素转虚拟节点
  function emptyNodeAt(elm) {
    ...
  }

  function createRmCb(childElm, listeners) {
    ...
  }

  // 创建元素
  function createElm(vnode, insertedVnodeQueue) {
    ...
  }

  // 对比子节点更新
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    ...
  }

  // 移除节点
  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    ...
  }

  // 添加节点
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
   	...
  }

  // diff算法, 用来比较两个虚拟节点的子节点并更新其子节点
  function patchVnode(oldVnode, vnode, insertedVnodeQueue) { 对应的真实Dom节点
    ...
  }

  // 返回patch函数
  return function patch(oldVnode, vnode) {
    ...
  }
}
```

#### 4.4.2、源码详细分析

1. init函数执行解析

```js
export function init(modules, domApi) { // modules：数组，domApi：DOM操作的api
  const api = domApi !== undefined ? domApi : htmlDomApi; // 如果domApi不为undefined就为默认的

  // cbs存储modules执行的钩子函数
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  // 循环为cbs添加钩子函数
  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook]).push(currentHook);
      }
    }
  }

  // 返回patch函数
  return patch(oldVnode, vnode) {
      ...
  }
}
```

2. patch函数执行解析

```js
// 返回patch函数
return function patch(oldVnode, vnode) {
  let i;
  let elm;
  let parent;
  const insertedVnodeQueue = [];

  // 先执行cbs.pre钩子函数
  for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

  // 判断是否为元素，如果是就转换为一个虚拟节点
  if (isElement(api, oldVnode)) {
    oldVnode = emptyNodeAt(oldVnode); // 真实元素节点转换为一个虚拟节点，
  }

  // 是否为同一节点
  if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode, insertedVnodeQueue); // 对比同一个节点下的文本和子节点
  } else {
    // 不是同一个节点时，删除旧节点，添加新节点
    elm = oldVnode.elm;
    parent = api.parentNode(elm); // 获取老节点的父节点

    createElm(vnode, insertedVnodeQueue); // 创建新元素，并且新元素存入 vnode.elm 中

    if (parent !== null) {
      api.insertBefore(parent, vnode.elm, api.nextSibling(elm)); // 添加新节点
      removeVnodes(parent, [oldVnode], 0, 0); // 移除旧节点
    }
  }

  // 对比更新完成之后，执行cbs.post钩子函数
  for (i = 0; i < cbs.post.length; ++i) {
    cbs.post[i]();
  }
  return vnode;
};
```

3. isElement和emptyNodeAt执行解析

isElement判断oldVnode是否为一个元素，如果是一个元素，emptyNodeAt函数将元素转换为一个虚拟节点

```js
// 是否为一个元素
function isElement(api, vnode) {
  return api.isElement(vnode);
}

// 元素转虚拟节点
function emptyNodeAt(elm) {
  const id = elm.id ? '#' + elm.id : ''; // 获取id
  const classes = elm.getAttribute('class');
  const c = classes ? '.' + classes.split(' ').join('.') : ''; // 获取类
  return vnode(
    api.tagName(elm).toLowerCase() + id + c, // 转换的形式，例如：div#app.c
    {},
    [],
    undefined,
    elm, // elm 存储真实节点
  );
}
```

4. sameVnode函数判断是否为同一个节点

> 这里sameVnode去除源码的`const isSameIs = vnode1.data?.is === vnode2.data?.is;`和是否为文档碎片节点的判断

```js
// 是否为同一节点，这里去除了源码的is条件
function sameVnode(vnode1, vnode2) {
  const isSameKey = vnode1.key === vnode2.key;
  const isSameSel = vnode1.sel === vnode2.sel;
  const isSameText = !vnode1.sel && isSameSel ? typeof vnode1.text === typeof vnode2.text : true;
  return isSameSel && isSameKey && isSameText;
}
```

5. 如果不是同一个节点时

> 不为同一个节点时，会先添加一个当前节点，然后删除的oldVnode

```js
// 是否为同一节点
if (sameVnode(oldVnode, vnode)) {
  patchVnode(oldVnode, vnode, insertedVnodeQueue); // 对比同一个节点下的文本和子节点
} else {
  // 不是同一个节点时，删除旧节点，添加新节点
  elm = oldVnode.elm;
  parent = api.parentNode(elm); // 获取老节点的父节点

  createElm(vnode, insertedVnodeQueue); // 创建新元素，并且新元素存入 vnode.elm 中

  if (parent !== null) {
    api.insertBefore(parent, vnode.elm, api.nextSibling(elm)); // 添加新节点
    removeVnodes(parent, [oldVnode], 0, 0); // 移除旧节点
  }
}
```

createElm函数解析：

```js
// 创建元素并且更新vnode.elm
function createElm(vnode, insertedVnodeQueue) {
  let i;
  let data = vnode.data;
  const children = vnode.children; // 获取子节点
  const sel = vnode.sel; // 获取选择器

  if (sel === '!') {
    // 如果为注释节点时
    if (isUndef(vnode.text)) {
      // 文本为空时
      vnode.text = '';
    }
    vnode.elm = api.createComment(vnode.text); // 不为空时设置文本节点注释
  } else if (sel !== undefined) {
    // 当sel不是undefined
    // 解析选择器
    const hashIdx = sel.indexOf('#');
    const dotIdx = sel.indexOf('.', hashIdx);
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel; // tag 获取标签名
    const elm = (vnode.elm = isDef(data) && api.createElement(tag, data)); // 创建节点

    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot)); // 设置元素id
    if (dotIdx > 0) {
      // 设置元素类名
      elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
    }
    // 执行cbs的create钩子函数，更新新旧节点style，props，class等，添加时emptyNode充当老节点进行对比
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);

    // 当子节点存在时
    if (array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch != null) {
          api.appendChild(elm, createElm(ch, insertedVnodeQueue)); // 为子节点添加元素
        }
      }
    } else if (primitive(vnode.text)) {
      // 当前节点存在文本节点时，添加文本节点
      api.appendChild(elm, api.createTextNode(vnode.text));
    }
  } else {
    // 当子节点不为虚拟节点时，为字符串文本节点时。例如：h('div', {}, ['文本节点'])
    vnode.elm = api.createTextNode(vnode.text);
  }
  return vnode.elm;
}
```

removeVnodes函数执行解析：

```js
// 移除节点
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    let listeners;
    let rm;
    const ch = vnodes[startIdx];
    if (ch != null) {
      // 当ch不为空时，
      if (isDef(ch.sel)) {
        listeners = cbs.remove.length + 1;
        rm = createRmCb(ch.elm, listeners); // 返回删除节点
        // 执行cbs的remove钩子函数
        for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
        rm(); // 执行删除节点函数
      } else if (ch.children) {
        // 移除子节点
        removeVnodes(parentElm, ch.children, 0, ch.children.length - 1);
      } else {
        // 当为文本节点, 移除文本节点
        api.removeChild(parentElm, ch.elm);
      }
    }
  }
}
```

```js
// 移除节点返回函数
function createRmCb(childElm, listeners) {
  return function rmCb() {
    if (--listeners === 0) {
      const parent = api.parentNode(childElm); // 获取父节点
      api.removeChild(parent, childElm); // 删除子节点
    }
  };
}
```

6. 同一节点时执行patchVnode函数

```js
// 用来比较两个相同虚拟节点的子节点并更新其子节点对应的真实Dom节点
function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
  const elm = (vnode.elm = oldVnode.elm); // 为同一个节点时，老节点的elm给新节点elm，新节点不需要重新创建
  if (oldVnode === vnode) return;

  if (vnode.data !== undefined || (isDef(vnode.text) && vnode.text !== oldVnode.text)) {
    // 执行cbs.update钩子函数
    for (let i = 0; i < cbs.update.length; ++i) {
      cbs.update[i](oldVnode, vnode);
    }
  }

  const oldCh = oldVnode.children;
  const ch = vnode.children;

  if (isUndef(vnode.text)) {
    // 新节点文本为空时
    if (isDef(oldCh) && isDef(ch)) {
      // 新旧子节点都存在时，进行对比更新
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
    } else if (isDef(ch)) {
      // 新的子节点存在时, 旧节点不在时
      if (isDef(oldVnode.text)) api.setTextContent(elm, ''); // 老节点存在文本时，设置为空，与新节点保持为空
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue); // 添加节点
    } else if (isDef(oldCh)) {
      // 旧节点在时, 新的子节点不存在时
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      // 老节点存在文本时，设置为空，与新节点保持为空
      api.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // 新节点文本和老节点文本不同时
    if (isDef(oldCh)) {
      // 老节点存在子节点时
      removeVnodes(elm, oldCh, 0, oldCh.length - 1); // 删除节点
    }
    api.setTextContent(elm, vnode.text); // 添加新文本
  }
}
```

addVnodes执行函数解析：

```js
// 添加节点
function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
  for (; startIdx < endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    if (ch != null) {
      api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before); // 插入节点
    }
  }
}
```

7. 当两个新、旧节点都存在子节点时，核心updateChildren函数进行对比更新

```js
// 对比子节点更新
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    // 旧节点指针
    let oldStartIdx = 0; // 旧的开始节点
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]

    // 新节点指针
    let newStartIdx = 0; // 新的开始节点
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]


    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;

    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if(oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartVnode] // 旧节点左移
      } else if(oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx] // 旧节点尾部右移
      } else if(newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx] // 新节点左移
      } else if(newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx]
        //新节点和老节点的头部进行对比
      } else if(sameVnode(oldStartVnode,newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
        // 新节点和老节点的尾部进行对比
      } else if(sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndVnode]
        // 旧节点的头部和新节点尾部进行对比
      } else if(sameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm)) // 添加节点
        oldStartVnode = oldCh[++oldStartVnode]
        newEndVnode = newCh[--newEndIdx]
        // 老节点尾部和新节点尾部进行对比
      } else if(sameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode,newStartVnode, insertedVnodeQueue)
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if(oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 将旧节点的key做map映射
        }
        idxInOld = oldKeyToIdx[newStartVnode.key] // 使用新节点key在旧节点中在对应的相同的节点key，说明有key相同的节点
        if(isUndef(idxInOld)) { // 如果存在时就添加改节点
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
        } else { // 当新旧节点key值不一致时
          elmToMove = oldCh[idxInOld]
          if(elmToMove.sel !== newStartVnode.sel) { // 当选择器和新旧节点key值不一致时，重新创建新的节点注入
            api.insertBefore(parentElm,createElm(newStartVnode,insertedVnodeQueue), oldStartVnode.elm)
          } else { // 选择器一致时，比较两个相同节点的子元素，(优化，省去重新创建相同选择器时的dom对象)
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
          }
        }
        newStartVnode = newCh[++newStartIdx]; // 新节点的指针右移
      }
    }
```

### 4.5、配置modules目录

#### 4.5.1、modules/attributes.js

```js
// 比较新旧节点的attributes
function updateAttrs(oldVnode, vnode) {
  // 传入旧节点，新节点
  let key;
  const elm = vnode.elm;
  let oldAttrs = oldVnode.data?.attrs; // 老节点属性
  let attrs = vnode.data?.attrs; // 新节点属性

  // 当老节点和新节点都不存在时，return停止
  if (!oldAttrs && !attrs) return;
  // 当新节点等于老节点时，进行return停止
  if (oldAttrs === attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  for (key in attrs) {
    // 遍历新节点属性
    const cur = attrs[key];
    const old = oldAttrs[key];

    // 当老节点属性值不等于新节点属性值时，新节点存在新的属性
    if (old !== cur) {
      if (cur === true) {
        elm.setAttribute(key, '');
      } else if (cur === false) {
        elm.removeAttribute(key); // 移除属性
      } else {
        elm.setAttribute(key, cur); // 设置属性
      }
    }
  }

  // 当老节点属性不存在新节点时，进行删除
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

export const attributesModule = {
  create: updateAttrs,
  update: updateAttrs,
};
```

#### 4.5.2、modules/class.js

```js
// 比较新旧节点的class
// 源码定义的class类型：type Classes = Record<string, boolean>; { active: true, selected: true }
function updateClass(oldVnode, vnode) {
  let cur;
  let name;
  const elm = vnode.elm;
  let oldClass = oldVnode.data.class; // 旧节点的类
  let klass = vnode.data.class; // 新节点的类

  if (!oldClass && !klass) return;
  if (oldClass === klass) return;

  oldClass = oldClass || {};
  klass = klass || {};

  for (name in oldClass) {
    // 遍历老节点类属性
    // 老节点属性存在， 新节点属性不存在时，删除旧节点的相关类属性
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
      elm.classList.remove(name); // 移除老节点类属性
    }
  }

  for (name in klass) {
    // 遍历新节点的属性
    cur = klass[name];
    if (cur !== oldClass[name]) {
      // 当新节点属性值和老节点属性值不同时
      elm.classList[cur ? 'add' : 'remove'](name); // 为true时为添加，为false时删除
    }
  }
}

export const classModule = {
  create: updateClass,
  update: updateClass,
};
```

#### 4.5.3、modules/dataset.js

```js
const CAPS_REGEX = /[A-Z]/g;

// 对比更新新旧节点的自定义属性
function updateDataset(oldVnode, vnode) {
  const elm = vnode.elm;
  let oldDataset = oldVnode.data.dataset;
  let dataset = vnode.data.dataset;
  let key;

  if (!oldDataset && !dataset) return;
  if (oldDataset === dataset) return;
  oldDataset = oldDataset || {};
  dataset = dataset || {};
  const d = elm.dataset;

  for (key in oldDataset) {
    // 遍历老节点
    if (!dataset[key]) {
      // 新节点自定义属性不在时
      if (d) {
        if (key in d) {
          // 该自定义属性已经存在真实节点当中，进行删除
          delete d[key];
        }
      } else {
        // 移除旧节点的属性
        elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
      }
    }
  }

  for (key in dataset) {
    // 遍历新节点
    if (oldDataset[key] !== dataset[key]) {
      // 老节点自定义属性值与新节点属性不一致时
      if (d) {
        d[key] = dataset[key];
      } else {
        elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
      }
    }
  }
}

export const datasetModule = {
  create: updateDataset,
  update: updateDataset,
};
```

#### 4.5.4、modules/eventlisteners.js

```js
function invokeHandler(handler, vnode, event) {
  if (typeof handler === 'function') {
    handler.call(vnode, event, vnode);
  } else if (typeof handler === 'object') {
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}

function handleEvent(event, vnode) {
  const name = event.type;
  const on = vnode.data.on;

  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode); // 接收的event对象和handler的静态属性vnode
  };
}

// 对比更新新旧节点的事件
function updateEventListeners(oldVnode, vnode) {
  const oldOn = oldVnode.data.on;
  const oldListener = oldVnode.listener;
  const oldElm = oldVnode.elm;
  const on = vnode && vnode.data.on;
  const elm = vnode && vnode.elm;
  let name;

  if (oldOn === on) {
    return;
  }

  // 主要是与新节点的事件对比，移除新节点不存在的事件
  if (oldOn && oldListener) {
    // 老节点存在事件时
    if (!on) {
      // 当新节点的on为空时，移除旧节点的事件
      for (name in oldOn) {
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        // 老节点存在某一个事件时，新节点不存在时，对老节点事件进行移除
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  if (on) {
    const listenr = (vnode.listener = oldListener?.listener) || createListener(); // 返回的是一个handler函数
    listenr.vnode = vnode; // handler的静态属性为vnode

    if (!oldOn) {
      // 老节点不存在任何事件
      for (name in on) {
        elm.addEventListener(name, listenr, false);
      }
    } else {
      for (name in on) {
        // 遍历新节点，老节点不存在时，添加新节点事件
        if (!oldOn[name]) {
          elm.addEventListener(name, listenr, false);
        }
      }
    }
  }
}

export const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners,
};
```

#### 4.5.5、modules/props.js

```js
// 比较新旧节点的class
function updateProps(oldVnode, vnode) {
  let key;
  let cur;
  let old;
  const elm = vnode.elm;
  let oldProps = oldVnode.data.props; // 旧节点属性
  let props = vnode.data.props; // 新节点属性

  if (!oldProps && !props) return;
  if (oldProps === props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in props) {
    // 循环新节点的属性
    cur = props[key];
    old = oldProps[key];
    // 老节点props的属性值不等于新节点props的属性值，key不等于value，元素内的key值不等于cur，成立
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

export const propsModule = {
  create: updateProps,
  update: updateProps,
};
```

#### 4.5.6、modules/style.js

```js
let reflowForced = false;

const raf =
  (typeof window !== 'undefined' && window.requestAnimationFrame.bind(window)) || setTimeout;

const nextFrame = function (fn) {
  raf(function () {
    raf(fn);
  });
};

function setNextFrame(obj, prop, val) {
  nextFrame(function () {
    obj[prop] = val;
  });
}

function updateStyle(oldVnode, vnode) {
  let cur;
  let name;
  const elm = vnode.elm;
  let oldStyle = oldVnode.data.style;
  let style = vnode.data.style;

  if (!oldStyle && !style) return;
  if (oldStyle === style) return;

  oldStyle = oldStyle || {};
  style = style || {};
  const oldHasDel = 'delayed' in oldStyle;

  for (name in oldStyle) {
    // 遍历老节点style
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.removeProperty(name);
      } else {
        elm.style[name] = '';
      }
    }
  }

  for (name in style) {
    cur = style[name];
    if (name === 'delayed' && style.delayed) {
      for (const name2 in style.delayed) {
        cur = style.delayed[name2];
        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
          setNextFrame(elm.style, name2, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.setProperty(name, cur);
      } else {
        elm.style[name] = cur;
      }
    }
  }
}

// 销毁style函数
function applyDestroyStyle(vnode) {
  let style;
  let name;
  const elm = vnode.elm;
  const s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
// 移除函数
function applyRemoveStyle(vnode, rm) {
  const s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    vnode.elm.offsetLeft;
    reflowForced = true;
  }
  let name;
  const elm = vnode.elm;
  let i = 0;
  const style = s.remove;
  let amount = 0;
  const applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  const compStyle = getComputedStyle(elm);
  const props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1) amount++;
  }
  elm.addEventListener('transitionend', function (ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

function forceReflow() {
  reflowForced = false;
}

export const styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle,
};
```

### 5.6、实现效果

代码：

```js
import { h } from './h';
import { init } from './init';
import { classModule } from './modules/class';
import { propsModule } from './modules/props';
import { styleModule } from './modules/style';
import { datasetModule } from './modules/dataset';
import { attributesModule } from './modules/attributes';
import { eventListenersModule } from './modules/eventlisteners';

const patch = init([
  styleModule,
  classModule,
  datasetModule,
  propsModule,
  attributesModule,
  eventListenersModule,
]);

function eventHandler() {
  console.log('1');
}

let vnode = h(
  'div#app',
  {
    style: {
      color: 'blue',
    },
    on: {
      click: eventHandler,
    },
    dataset: {
      page: 0,
    },
  },
  [
    '555555',
    h('p', 'p111', [
      h('div', '999999'),
      h('a', { class: { active: true, selected: true } }, 'Toggle'),
    ]),
    h('p', 'p2'),
    h('a', { props: { href: '/' } }, 'Go to'),
    h('!', {}, '这是一个注释节点'),
  ],
);

const app = document.querySelector('#app');
patch(app, vnode);
```

代码执行结果：

![1678766413383](https://gitee.com/caigh1012/assets/raw/main/blog/fe/vnode/1678766413383.png)

## 五、Diff算法原理

> 新旧虚拟DOM对比的时候，Diff算法比较只会在同层级进行, 不会跨层级比较。 所以Diff算法是:`深度优先算法`。 时间复杂度:`O(n)`

![1678766976891](https://gitee.com/caigh1012/assets/raw/main/blog/fe/vnode/1678766976891.png)

流程简述：先通过`sameVnode函数`对比`ul元素`是否为同一个节点，如果是同一个节点，通过`patchVnode`函数判断两个节点是更新了文本节点还是子节点。文本节点更新时改过文本节点，当新旧节点发生变化时，通过`updateChildren`函数对比子节点，如果子节点对比过程中存在相同的子节点时，在通过`patchVnode`对比更新两个节点变化。如此往复进行同层和深度对比。
