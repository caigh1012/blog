---
outline: deep
---

# XSS 攻击

## 一、XSS攻击概念

XSS 全称 Cross-site scripting，即`跨站脚本攻击`，千方百计注入并执行恶意脚本。

XSS 的造成的风险：窃取 Cookie、会话截取以及进一步 csrf 攻击、网页篡改等

## 二、XSS分类

XSS 分类分三类：反射型、存储型、DOM型

反射型：先在浏览器提交恶意代码到服务端，然后服务端将恶意代码传回客户端；主要通过 url 参数注入。

存储型：浏览器提交恶意代码到服务端，将恶意代码储存到数据库；主要通过输入框提交恶意代码到服务端，并进行储存，给用户带来的危害的最大的。

### 2.1、反射型

创建一个服务器

```javascript
const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

/**
 * 模拟数据库
 */
const goods = {
  book: [{ name: '变形计' }, { name: '双城记' }],
  electronic: [{ name: 'Android' }, { name: 'Iphone' }],
};

app.get('/goods', function (req, res) {
  let { category } = req.query;
  res.setHeader('Content-type', 'text/html;charset=utf8');
  let currentGoods = goods[category];
  let detail = '';
  if (currentGoods) {
    detail = currentGoods.map((item) => `<li>${item.name}</li>`).join('');
  } else {
    detail = '此分类没有商品';
  }
  res.send(`<h1>你选择的商品分类是：${category}</h1>
    <ul>${detail}</ul>
    `);
});

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080`);
});
```

在浏览器输入 ` http://localhost:8080/goods?category=book` 时就会出现对应内容。但是如果将 category 参数改成 js 注入的代码，例如：`http://localhost:8080/goods?category=<script>alert(1)</script>` 输入完成之后就会弹出弹框；这就说明通过 url 注入恶意代码成功。

反射型XSS能够成功的关键在于：1.能够通过 url 注入成功；2.必须返回给前端

### 2.2、存储型

编写一个简易的评论系统，html内容如下

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous" />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
      crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  </head>
  <body>
    <div class="container">
      <ul class="list-group"></ul>
      <div>
        <div class="mb-3">
          <label
            for="exampleFormControlInput1"
            class="form-label"
            >用户名</label
          >
          <input
            type="email"
            class="form-control"
            id="username"
            placeholder="请输入用户名" />
        </div>
        <div class="mb-3">
          <label
            for="exampleFormControlInput1"
            class="form-label"
            >评论</label
          >
          <input
            type="email"
            class="form-control"
            id="comment"
            placeholder="请输入评论" />
        </div>
        <button
          id="submit"
          type="submit"
          class="btn btn-primary">
          提交
        </button>
      </div>
    </div>
  </body>
  <script>
    $.get('/api/comments', function (data) {
      const container = $('ul.list-group')[0];
      console.log(data);
      console.log(container);

      // 渲染评论列表
      data.data.forEach((element) => {
        console.log(element);
        const dom = `<li class="list-group-item">
          <div class="ms-2 me-auto">
            <div class="fw-bold">${element.username}</div>
            ${element.content}
          </div>
        </li>`;
        $(dom).appendTo(container);
      });
    });

    // 提交添加评论
    $('#submit').click(function () {
      console.log($('#username').val());
      console.log($('#comment').val());
      $.post('/api/comments/add', { username: $('#username').val(), content: $('#comment').val() }, function (data) {
        console.log(data);
        location.reload();
      });
    });
  </script>
</html>
```

配置服务器

```javascript
/**
 * XSS 存储型
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.resolve(__dirname, 'public'))); // 返回 public 的 index.html 内容

/**
 * 模拟数据库
 */
let comments = [
  {
    username: '张三',
    content: '今天下雨了',
    time: new Date().toLocaleString(),
  },
  {
    username: '李四',
    content: '今天没带伞',
    time: new Date().toLocaleString(),
  },
];

app.get('/api/comments', function (req, res) {
  res.json({
    message: '请求成功',
    code: '0000',
    data: comments,
  });
});

app.post('/api/comments/add', function (req, res) {
  let comment = req.body;
  comments.push({
    ...comment,
    time: new Date().toLocaleString(),
  });

  res.json({
    message: '请求成功',
    code: '0000',
    data: null,
  });
});

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080`);
});

// 在评论输入框输入 <script>alert(1)</script>
```

只需要在评论中输入 `<script>alert(1)</script>` 内容就会注入服务器中，于是 Web 应用系统被永久侵入恶意代码。

## 三、如何防御

XSS 攻击是先注入再执行，因此要防止注入、防止执行。

### 3.1、输入验证和过滤

对所有用户输入进行校验，拒绝非法字符，过滤特殊字符：如 `< > " ' & /` 等。

### 3.2、输出编码

将用户输入通过转义后再输出到页面，例如：将 `&`, `<`, `>`, `"`, `'` 分别转换为 `&`, `<`, `>`, `"`, `'`。

### 3.3、使用内容安全策略（CSP）

CSP是一个HTTP响应头（`Content-Security-Policy`），它提供一个 `白名单机制`，告诉浏览器允许加载和执行哪些外部资源。

作用：即使攻击者成功注入了恶意脚本，由于CSP的限制，脚本也不会被浏览器执行。

关键指令

- `default-src 'self'`：默认只允许加载同源资源。
- `script-src 'self' https://trusted.cdn.com`：只允许执行来自同源和指定CDN的脚本。
- `script-src 'self' 'nonce-{random}'`：使用随机数（Nonce）来允许内联脚本。只有nonce值匹配的内联脚本才会执行。这是安全使用内联脚本的最佳方式。
- `script-src 'self' 'unsafe-inline'`：尽量避免使用，因为它会允许所有内联脚本，大大削弱CSP的防护能力。
- `object-src 'none'`：完全禁止 `<object>`, `<embed>`, `<applet>` 等，减少攻击面。
- `base-uri 'none'`：禁止使用 `<base>` 标签，防止攻击者改变相对URL的基准。

示例如下

```tex
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnDoM123'; object-src 'none'; base-uri 'none';
```

### 3.4、其他安全措施

| 措施方案名称       | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| Cookie             | 设置 HttpOnly，静止通过 `document.cookie` 读取到此Cookie，设置 Secure，仅允许 HTTPS 发送 Cookie |
| 现代Web框架        | 静止使用 `dangerouslySetInnerHTML` (React) 或 `v-html` (Vue) 等API时会绕过这种保护，必须格外小心。 |
| 避免拼接HTML字符串 | 绝对不要使用 `innerHTML`、`outerHTML`、 `document.write()` 或字符串拼接的方式直接生成HTML |