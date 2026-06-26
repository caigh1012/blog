---
outline: deep
---

# Nginx 部署单页应用 SPA History 路由

## 一、为什么 SPA 的 history 路由部署容易出问题

在 Vue、React 等前端项目中，如果使用的是 `history` 路由模式，那么页面路由切换通常是由前端路由接管的。例如访问以下地址：

```text
/login
/user/profile
/article/detail/1001
```

在应用运行过程中，浏览器地址虽然变化了，但这些路径并不一定是服务端真实存在的文件路径，它们通常最终都应该返回同一个 `index.html`，然后再交给前端路由去渲染对应页面。

这就带来一个很常见的问题：

1. 浏览器首次访问首页 `/` 时，Nginx 返回 `index.html`，页面正常。

2. 前端跳转到 `/user/profile` 时，由前端路由接管，也正常。

3. 但当用户直接刷新 `/user/profile`，或者直接访问这个链接时，请求会先到 Nginx。

4. 如果 Nginx 按照静态文件查找逻辑处理，会去找服务器上的 `/user/profile` 文件或目录。

5. 由于这个路径通常不存在，所以最终返回 `404`。

所以，`history` 路由模式部署的核心不是“把 dist 丢到 Nginx 就完了”，而是：

`让所有不存在的前端路由请求最终回退到 index.html`

## 二、部署前需要准备什么

假设前端项目已经打包完成，生成目录为 `dist`。

常见构建命令如下：

```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

打包完成后，通常会得到类似以下结构：

```text
dist/
  index.html
  assets/
    index-xxxxx.js
    index-xxxxx.css
```

其中：

1. `index.html` 是 SPA 的入口文件。

2. `assets` 目录存放构建后的静态资源。

3. 浏览器无论访问哪个前端路由，本质上都应该先拿到 `index.html`。

## 三、最核心的 Nginx 配置

如果你的单页应用要直接部署在站点根路径下，例如：

```text
http://example.com/
```

那么最常见也是最核心的配置如下：

```nginx
server {
    listen 80;
    server_name example.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

假设你的 `dist` 目录已经上传到 `/usr/share/nginx/html`，这段配置就可以支持大多数 `SPA + history` 路由场景。

### 3.1、try_files 是什么意思

上面的关键就在这句：

```nginx
try_files $uri $uri/ /index.html;
```

它的含义可以理解为：

1. 先尝试查找当前请求路径对应的文件，例如 `/assets/index.js`。

2. 如果不是文件，再尝试查找同名目录。

3. 如果都找不到，就统一返回 `/index.html`。

这样就能同时满足两种请求：

1. 静态资源请求，例如 `js`、`css`、图片等，正常返回真实文件。

2. 前端路由请求，例如 `/user/profile`、`/order/list`，最终回退到 `index.html`。

这正是 `history` 路由部署的关键所在。

## 四、完整一点的生产配置示例

实际生产环境中，一般不只是简单返回 `index.html`，还会带上一些基础优化配置，例如日志、压缩、缓存、错误页等。下面给出一个更常用的示例：

```nginx
server {
    listen 80;
    server_name example.com;

    root /usr/share/nginx/html;
    index index.html;

    # SPA history 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 对静态资源做缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri =404;
    }

    # 可选：接口反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

其中需要注意：

1. `location /` 中的 `try_files` 是给前端路由兜底。

2. `location /assets/` 使用 `try_files $uri =404;`，表示静态资源文件不存在时应该明确返回 `404`，而不是错误地回退到 `index.html`。

3. 如果你的前端会请求后端接口，可以通过 `/api/` 代理到后端服务。

## 五、部署步骤示例

下面给出一个比较常见的部署流程。

### 5.1、上传构建产物

先将本地打包后的 `dist` 上传到服务器，例如上传到：

```text
/usr/share/nginx/html
```

也可以先上传到临时目录，再复制过去：

```bash
scp -r ./dist/* root@your-server:/usr/share/nginx/html/
```

如果你的目录之前已有旧文件，建议先清理再覆盖，避免旧资源残留导致页面引用错误资源。

例如：

```bash
rm -rf /usr/share/nginx/html/*
cp -r ./dist/* /usr/share/nginx/html/
```

如果你是通过 Docker 部署 Nginx，也可以把宿主机目录挂载到容器中的 `/usr/share/nginx/html`。

### 5.2、检查 Nginx 配置

修改配置文件后，先检查语法：

```bash
nginx -t
```

如果输出类似以下内容，说明配置没有语法问题：

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5.3、重新加载配置

```bash
nginx -s reload
```

或者：

```bash
systemctl reload nginx
```

### 5.4、验证是否部署成功

可以重点验证以下几种场景：

1. 访问首页 `/` 是否正常。

2. 前端点击跳转到 `/user/profile` 是否正常。

3. 直接刷新 `/user/profile` 是否仍然正常。

4. 直接在浏览器地址栏输入深层链接，例如 `/article/detail/1001` 是否正常。

5. 静态资源请求是否返回 `200`，而不是回退到 `index.html`。

## 六、部署在子路径下的配置

有些项目不是部署在根路径，而是部署在某个子路径下，例如：

```text
http://example.com/admin/
```

这种情况比根路径部署更容易出错，因为除了 Nginx 需要配置，前端项目本身也要配置资源基础路径。

### 6.1、Nginx 配置示例

```nginx
server {
    listen 80;
    server_name example.com;

    location /admin/ {
        alias /usr/share/nginx/html/admin/;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

这个配置的含义是：

1. 所有 `/admin/` 开头的请求，都映射到 `/usr/share/nginx/html/admin/` 目录。

2. 如果请求的不是实际静态文件，就回退到 `/admin/index.html`。

### 6.2、前端也要配置基础路径

如果只是改 Nginx，不改前端构建配置，通常会出现首页能打开，但静态资源路径错乱的问题。

例如在不同框架中通常需要类似配置：

#### Vue Router

```javascript
createWebHistory('/admin/')
```

#### Vite

```javascript
export default defineConfig({
  base: '/admin/',
})
```

#### React Router

```javascript
<BrowserRouter basename="/admin">
```

简单来说：

1. Nginx 决定“请求该落到哪里”。

2. 前端构建配置决定“页面里引用的资源路径长什么样”。

这两边都要一致。

## 七、为什么不能把所有 404 都回退到 index.html

很多人一开始会想，既然 `history` 路由要兜底，那是不是所有 `404` 都返回 `index.html` 就行了？

实际上不建议这么做，原因如下：

1. 如果 `js`、`css`、图片文件真的丢了，应该明确返回 `404`，这样更容易排查问题。

2. 如果静态资源也回退到 `index.html`，浏览器会把 HTML 当成 `js` 或 `css` 去解析，最终报出更加迷惑的问题。

3. 只有“前端路由路径”才应该回退到 `index.html`，真实静态资源不存在时就应该直接报错。

所以常见做法是：

1. `location /` 中兜底回退到 `index.html`。

2. `location /assets/`、`/static/` 之类的静态资源路径明确使用 `=404`。

## 八、常见问题排查

### 8.1、刷新页面 404

最常见原因就是没有配置：

```nginx
try_files $uri $uri/ /index.html;
```

或者虽然配了，但配错了位置，没有落在实际处理前端路由的 `location` 中。

### 8.2、首页能打开，但静态资源 404

通常有以下几种原因：

1. 前端项目的 `base`、`basename`、`publicPath` 等基础路径配置不对。

2. 项目部署在子路径下，但资源仍然按根路径去加载。

3. Nginx 的 `root` 或 `alias` 指向目录不对。

4. 上传文件不完整，`assets` 目录缺失。

### 8.3、接口请求 404 或跨域

如果前端通过 `/api/` 请求后端，但 Nginx 没有代理，或者代理路径配置不对，就可能出现 `404`。

如果前端直接请求不同域名、不同端口的接口，则还可能出现跨域问题，这时需要：

1. 让 Nginx 做同源代理。

2. 或者在后端正确配置 CORS。

### 8.4、修改配置后没有生效

优先检查以下几点：

1. 是否执行了 `nginx -t`。

2. 是否执行了 `nginx -s reload` 或 `systemctl reload nginx`。

3. 当前生效的是否真的是你修改的那个配置文件，可以使用 `nginx -T` 查看完整生效配置。

## 九、一个适合直接复用的最简模板

如果你现在只想快速部署一个 `SPA + history` 路由项目，可以直接从下面这个模板开始：

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        expires 30d;
    }
}
```

这个模板适用于：

1. 前端产物已经放到 `/usr/share/nginx/html`。

2. 项目部署在根路径 `/`。

3. 使用 `history` 路由模式。

4. 构建后的静态资源位于 `/assets/` 目录。

## 十、小结

Nginx 部署 `SPA history` 路由模式时，最关键的一点就是：

`前端路由要回退到 index.html，静态资源要按真实文件返回`

可以把这件事理解成两条规则：

1. 浏览器请求的是静态资源文件时，Nginx 应该直接返回真实文件。

2. 浏览器请求的是前端路由地址时，Nginx 应该统一返回 `index.html`，交给前端路由接管。

只要把这两件事区分清楚，`SPA + history` 路由的部署基本就不会出大问题。
