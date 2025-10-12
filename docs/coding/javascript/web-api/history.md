---
outline: deep
---

# Window的history属性

## 一、history概述

### 1.1、history定义

Window.history 提供了对浏览器会话历史的访问，它暴露了很多有用的方法和属性，允许你在用户浏览历史中向前和向后跳转，同时（从 HTML5 开始）提供了对 history 栈中内容的操作。

### 1.2、history属性

| 属性   | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| length | history 栈中页面的数量。                                     |
| state  | history 栈中当前页面的状态值。可在 popstate 事件的 callback 中获取（event.state），也可通过 history.state 获取。 |

### 1.3、history方法

| 方法         | 说明                                                         | 调用                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| forward      | 向前跳转，和用户点击浏览器前进按钮的效果相同，无参数。       | history.forward()                                            |
| back         | 向后跳转，和用户点击浏览器回退按钮的效果相同，无参数。       | history.back()                                               |
| go           | 载入会话历史中的某一特定页面， 通过与当前页面的相对位置来标志 (当前页面的相对位置为0)。 | history.go(-1) // 等同于调用了 back() <br/>history.go(1) // 等同于调用了 forward() |
| pushState    | 添加历史记录。通常与 window.onpopstate 配合使用。            |                                                              |
| replaceState | 修改当前历史记录。通常与 window.onpopstate 配合使用。        |                                                              |

更多详细了解参考：https://developer.mozilla.org/zh-CN/docs/Web/API/History

#### 1.3.1、pushState

```javascript
history.pushState(state, title, url); // 往 history 栈栈顶压入一条新的历史记录，并改变当前指针至栈顶
```

+ state：状态对象 state 是一个 JavaScript 对象，必填。用户导航到新的状态，popstate 事件就会被触发
+ title：由于历史原因，该参数存在且不能忽略；传递一个空字符串是安全的，以防将来对该方法进行更改。
+ url： 该参数定义了新的历史 URL 记录。注意，调用 pushState() 后浏览器并不会立即加载这个 URL，但可能会在稍后某些情况下加载这个 URL，比如在用户重新打开浏览器时。新 URL 不必须为绝对路径。如果新 URL 是相对路径，那么它将被作为相对于当前 URL 处理。新 URL 必须与当前 URL 同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前 URL。

#### 1.3.2、replaceState

参数与 pushState 相同，含义也相同。

区别在于 replaceState 是修改了当前的历史记录而不是新建一个。

注意：这并不会阻止其在全局浏览器历史记录中创建一个新的历史记录项。

#### 1.3.3、popstate

当历史记录发生变化时，将触发 popstate 事件。如果被激活的历史记录是通过调用 history.pushState() or history.replaceState() 创建的，popstate 事件的 state 属性包含历史记录的状态对象的副本。

直接调用 history.pushState() or history.replaceState() 不会触发 popstate 事件。只有在作出浏览器动作时，才会触发该事件，如用户去点击浏览器的前进/回退按钮，或者在 JavaScript 代码中调用 history.forward() / history.back()。

不同的浏览器在加载页面时处理 popstate 事件的形式存在差异。页面加载时 Chrome 和 Safari 通常会触发 popstate 事件，但 Firefox 则不会。

### 1.4、代码实践

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
    <meta
      http-equiv="X-UA-Compatible"
      content="ie=edge" />
    <title>Document</title>
    <style>
      .btn {
        margin: 10px;
        font-size: 18px;
        border: 1px solid #ccc;
        padding: 5px 10px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div
        id="back"
        class="btn">
        history.back
      </div>
      <div
        id="forward"
        class="btn">
        history.forward
      </div>
      <div
        id="go"
        class="btn">
        history.go
      </div>
      <div
        id="pushState"
        class="btn">
        history.pushState
      </div>
      <div
        id="replaceState"
        class="btn">
        history.replaceState
      </div>
    </div>
    <script src="./src/main.js"></script>
    <script>
      // console.log(document.defaultView)

      console.log(window.history, '<----history');
      console.log(window.location, '<---location');

      function createKey() {
        return Math.random().toString(36).substr(2, 8);
      }

      // 返回
      document.getElementById('back').addEventListener('click', function () {
        console.log('back');
        window.history.back();
      });

      // 前进
      document.getElementById('forward').addEventListener('click', function () {
        console.log('forward');
        window.history.forward();
      });

      // go
      document.getElementById('go').addEventListener('click', function () {
        console.log('go');
        window.history.go(-2);
      });

      // pushState
      document.getElementById('pushState').addEventListener('click', function () {
        console.log('pushState');
        const key = createKey();
        history.pushState({ page: key }, 'title 1', `/${key}`);
      });

      // replaceState
      document.getElementById('replaceState').addEventListener('click', function () {
        console.log('replaceState');
        history.replaceState({ replace: 1 }, 'title-replace', '/replace');
      });

      window.addEventListener('popstate', function (e) {
        console.log(e, '<____e');
      });
    </script>
  </body>
</html>
```

## 二、SPA实现路由变化切换UI基础原理

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>history对象</title>
    <link
      rel="stylesheet"
      href="./src/index.css" />
  </head>
  <body>
    <div class="navbar">
      <div class="navbar_item">
        <span
          data-path="/page1"
          class="page1"
          >page1</span
        >
      </div>
      <div class="navbar_item">
        <span
          data-path="/page2"
          class="page2"
          >page2</span
        >
      </div>
      <div class="navbar_item">
        <span
          data-path="/page3"
          class="page3"
          >page3</span
        >
      </div>
    </div>
    <div id="container"></div>
  </body>
  <script src="./src/index.js"></script>
</html>
```

```css
#container {
  width: 400px;
  text-align: center;
  margin: 100px auto;
  color: red;
}

.navbar {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  width: 300px;
}
```

```javascript
class HistoryRouter {
  constructor(dom) {
    this.dom = document.getElementById(dom);
    this.listenClick();
    this.listenPopstate();
  }

  updateUrl(path) {
    window.history.pushState({ path: path }, null, path);
    this.dom.innerHTML = path;
  }

  listenClick() {
    window.addEventListener('click', (e) => {
      e.preventDefault();
      const path = e.target.getAttribute('data-path');
      this.updateUrl(path); // 更新state，同事更新UI
    });
  }

  // 通过监听 popstate 事件来处理 history.back()或 history.forward() 时的页面渲染
  listenPopstate() {
    window.addEventListener('popstate', (e) => {
      const path = e.state.path;
      this.updateUrl(path);
    });
  }
}

new HistoryRouter('container');
```

