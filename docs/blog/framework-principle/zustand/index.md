---
outline: deep
---

# Zustand源码解析

## 一、useSyncExternalStore使用

定义一个 store

```javascript
class CounterStore {
  constructor() {
    this.count = 0;
    this.listeners = [];
  }

  // 获取当前值
  getSnapshot = () => {
    return this.count;
  };

  // 订阅变化
  subscribe = (listener) => {
    this.listeners.push(listener);
    // 返回取消订阅的函数
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  // 触发变化通知
  emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };

  // 业务方法
  increment = () => {
    this.count++;
    this.emitChange(); // 关键：通知 React 更新
  };

  decrement = () => {
    this.count--;
    this.emitChange();
  };

  reset = () => {
    this.count = 0;
    this.emitChange();
  };
}

export const counterStore = new CounterStore();
```

在组件中的使用

```jsx
import { useSyncExternalStore } from 'react';
import { counterStore } from '../../helper/counterStore';
import ChildCom from './child-com';

const ZustandUse = () => {
  const count = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot);

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={counterStore.increment}>+1</button>
      <button onClick={counterStore.decrement}>-1</button>
      <button onClick={counterStore.reset}>重置</button>

      <div>
        <ChildCom></ChildCom>
      </div>
    </div>
  );
};

export default ZustandUse;
```

子组件

```jsx
import { counterStore } from '../../helper/counterStore';

const ChildCom = () => {
  return (
    <div>
      <h2>计数器: {counterStore.count}</h2>
    </div>
  );
};

export default ChildCom;
```

## 二、实现 zustand 源码

```jsx
// react.ts
import React from 'react';
import { createStore } from './vanilla';

export function useStore(api, selector) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getInitialState()), [api, selector]),
  );

  // 在 DevTools 中显示当前值
  React.useDebugValue(slice);
  return slice;
}

const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};

export const create = (createState) => createImpl(createState);
```

vanilla.js

```javascript
const createStoreImpl = (createState) => {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    // 如果是方法就传递方法
    const nextState = typeof partial === 'function' ? partial(state) : partial;

    // 比较新旧 state
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        (replace ?? (typeof nextState !== 'object' || nextState === null))
          ? nextState
          : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const getInitialState = () => initialState;

  const subscribe = (listener) => {
    listeners.add(listener);
    // Unsubscribe
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, getInitialState, subscribe };

  const initialState = (state = createState(setState, getState, api));

  return api;
};

export const createStore = (createState) => createStoreImpl(createState);
```



