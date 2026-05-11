---
outline: deep
---

# history库源码

为什么会了解 history 源码，而不是 react-router 源码，主要 react-router 的核心就是依赖 history 库进行实现的。其内部依赖 history 做了很多组件（Link、NavLink、BrowserRouter等），以及自定义 hooks（useLocation、useNavigate ）等

## 一、history基础使用

### 1.1、需要安装 history

```bash
npm i history
```

### 1.2、简单使用

```html
 <body>
    <h2>history源码解读</h2>
    <div>
      <p id="btns">
        <a href="/home">Home page</a>
        <a href="/about">About page</a>
        <a href="/user">User page</a>
      </p>
      <div id="root"></div>
    </div>
    <script
      type="module"
      src="./src/main.js"></script>
  </body>
```

```javascript
// import the browser history singleton instance.
import history from 'history/browser';

let location = history.location;

// 容器
let root = document.getElementById('root');
console.log(root);

// 进行 history.listen 监听，当使用 history.push 和 history.replace 会触发
let unlisten = history.listen(({ location, action }) => {
  console.log(location, '<___location');
  root.innerHTML = '当前组件' + location.pathname + JSON.stringify(location.state);
});

let btns = document.getElementById('btns');

btns.addEventListener('click', (e) => {
  // 阻止 a 标签默认行为
  e.preventDefault();
  const pathname = e.target.pathname;
  history.push(pathname, { some: 'state', now: Math.random() });
});
```

详细见：https://github.com/remix-run/history/blob/dev/docs/getting-started.md

## 二、核心原理解读

history 实际就是对 Browser 路由以及 hash 路由 进行的改造，最主要的就是 createBrowserHistory 和 createHashHistory‎ 以及 createMemoryHistory‎ 。

```javascript
// BrowserHistory
export interface BrowserHistory extends History {}

// HashHistory
export interface HashHistory extends History {}

// MemoryHistory
export interface MemoryHistory extends History {
  readonly index: number;
}


export interface History {
  readonly action: Action;

  readonly location: Location;

  createHref(to: To): string;

  push(to: To, state?: any): void;

  replace(to: To, state?: any): void;

  go(delta: number): void;

  back(): void;

  forward(): void;

  listen(listener: Listener): () => void;

  block(blocker: Blocker): () => void;
}
```

这里以 createBrowserHistory 为例（简化版）

```tsx
export function createBrowserHistory(
  options: BrowserHistoryOptions = {} // export type BrowserHistoryOptions = { window?: Window };
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {}; // 等同于 window.history.state
    
    // 组装成 Location
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      }),
    ];
  }
  
  function handlePop() {
     let nextAction = Action.Pop;
     applyTx(nextAction);
  }

  window.addEventListener('popstate', handlePop);

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents<Listener>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  function createHref(to: To) {
    return typeof to === "string" ? to : createPath(to);
  }

  // state defaults to `null` because `window.history.state` does
  // 获取下一次的 Location 进行组装 Location
  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      hash: "",
      search: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  // 触发 listeners 监听器（重要）
  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    // 获取下一次的 Location 进行组装 Location
    let nextLocation = getNextLocation(to, state);
    let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
 		globalHistory.pushState(historyState, "", url);
    applyTx(nextAction);
  }

  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);
    globalHistory.replaceState(historyState, "", url);
    applyTx(nextAction);
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  // 返回的 history
  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
  };

  return history;
}

export function createPath({
  pathname = "/",
  search = "",
  hash = "",
}: Partial<Path>) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}

export function parsePath(path: string): Partial<Path> {
  let parsedPath: Partial<Path> = {};

  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}
```

## 三、在 react-router 中的使用

```tsx
export function BrowserRouter({
  basename,
  children,
  useTransitions,
  window,
}: BrowserRouterProps) {
  // 存储 history 实例
  let historyRef = React.useRef<BrowserHistory>();
  // 若 historyRef.current 不存在就会创建 createBrowserHistory，实现单例
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }

  let history = historyRef.current;
  
  let [state, setStateImpl] = React.useState({
    action: history.action,
    location: history.location,
  });
  
  let setState = React.useCallback(
    (newState: { action: NavigationType; location: Location }) => {
      if (useTransitions === false) {
        setStateImpl(newState);
      } else {
        React.startTransition(() => setStateImpl(newState));
      }
    },
    [useTransitions],
  );

  // 实现对 history 监听
  React.useLayoutEffect(() => history.listen(setState), [history, setState]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
      useTransitions={useTransitions}
    />
  );
}
```

