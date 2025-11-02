---
outline: deep
---

# 防抖和节流

防抖的核心思想是：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。也就是说，只有当事件停止触发一段时间后，回调才会执行。

节流的核心思想是：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。也就是说，节流会稀释函数的执行频率。

### 4.1、防抖

```javascript
/**
 * 防抖
 */
let btn = document.getElementById('btn');

function debounce(func, wait) {
  let timer;
  return function (...argu) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, argu);
    }, wait);
  };
}

btn.addEventListener(
  'click',
  debounce(function (e) {
    console.log('点击了', e);
  }, 2000),
);
```

### 4.2、节流

```javascript
let btn = document.getElementById('btn');

/**
 * 节流
 */
function throttle(func, wait) {
  let lastTime = null;
  return function (...argu) {
    let now = Date.now(); // 返回的是当前的毫秒数
    if (lastTime === null || now - lastTime > wait) {
      func.apply(this, argu);
      lastTime = now;
    }
  };
}

btn.addEventListener(
  'click',
  throttle(function (e) {
    console.log('点击了', e);
  }, 2000),
);

```

