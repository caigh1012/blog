---
outline: deep
---

# Web Worker使用介绍

## 一、Web Worker简单说明

Web Worker 是 HTML5 规范引入的浏览器多线程技术，允许 JavaScript 脚本在独立的后台线程中运行，从而避免计算密集型任务阻塞主线程，保持用户界面的响应性 。它通过创建独立的工作线程，将耗时操作从主线程分离，有效解决 JavaScript 单线程模型导致的页面卡顿问题。

1、并行运行：Worker 线程拥有独立的内存空间、消息对列、和事件循环，与主线程并行执行，互不干扰

2、消息通信：主线程与 Worker 之间无法之间访问变量，必须通过 postMessage 发送消息和 onmessage 监听事件进行异步通信。

3、同源策略：Worker 脚本必须与主线程共享相同的来源（协议、主机、端口），以确保安全性

Worker 运行js的环境和主线程环境的异同：

不同点：

1. Worker 是无 UI 线程，无法调用 UI 相关的 DOM/BOM API
2. Worker 线程和主线程内存独立，Worker 线程无法访问页面上的全局变量（window，document等）和 JS 函数
3. Worker 线程不能调用 alert 和 confirm 等ui相关的 BOM API
4. Worker 线程被主线程控制，主线程可以新建和销毁 Worker；
5. Worker 线程可以通过 `self.close` 自行销毁

相同点：

1. 包含完整的 JS 运行时，支持 ES 规范定义的语言语法和内置对象
2. 支持 XMLHTTPRequest，能独立发送网络请求和后端进行交互
3. 包含只读的 Location，指向 Worker 线程执行的 script url，可通过 url 传递参数给 Worker 环境
4. 包含只读的 Navigator，用于获取浏览器信息
5. 支持 setTimeout / setInterval 计时器，可用于实现异步逻辑
6. 支持 WebSocket 进行网络 I / O，支持 IndexDB 进行文件 I / O

## 二、简单实用

主线程中使用

```javascript
/**
 * 创建 worker
 */
let worker = new Worker(new URL('worker.js', import.meta.url), { type: 'module' });

// fetch('http://127.0.0.1:8080/api/example')
//   .then((rsp) => rsp.json())
//   .then((data) => {
//     /**
//      * 将请求来的数据发送给 work 进行处理
//      */
//     worker.postMessage({ data, type: 'Calculation' });
//   });

/**
 * 接受 worker 发送过来的消息
 */
worker.onmessage = function (event) {
  console.log(event.data.result); // 输出：Completed!
};
```

worker 线程使用

```javascript
import axios from 'axios';

self.onmessage = function (e) {
  console.log(e.data);
  dealType(e.data);
};

/**
 * 对于发送过来的 type 拆分不同方法进行处理
 */
function dealType(dto) {
  const { type, data } = dto;

  if (!type) {
    throw new Error('type 不能为空');
  }

  switch (type) {
    case 'Calculation': {
      Calculation(data);
      break;
    }
    default: {
      console.warn('触发');
    }
  }
}

function Calculation(data) {
  console.log(data.data);

  /**
   * 返回结果给 主线程
   */
  self.postMessage({ result: 'Completed!' });
}
```

## 三、项目中如何推荐使用

在实际的项目过程中建议使用 comlink 库来使用，简化 API 的调用

```javascript
import { wrap } from 'comlink';

import { ComlinkWorkerApi } from './worker/comlink.worker';

export const comlinkWorker = wrap<ComlinkWorkerApi>(
  new Worker(new URL('./worker/comlink.worker', import.meta.url), {
    type: 'module',
  }),
);
```

在对应的 Worker 中

```javascript
import { expose } from 'comlink';

export interface ComlinkWorkerApi {
  counter: number;
  inc: () => number;
}

class ComlinkWorker implements ComlinkWorkerApi {
  counter: number = 1;

  inc() {
    return this.counter++;
  }
}

expose(new ComlinkWorker());
```

组件中的使用

```tsx
useEffect(() => {
  comlinkWorker.inc().then((res) => {
    console.log(res);
  });
}, []);
```

## 四、Worker 使用场景

1. 处理海量数据

2. 执行复杂数据计算或数据分析

3. 图像、视频数据的滤镜应用

4. 实时数据处理

