---
outline: deep
---

# 微前端部署总结

## 一、为什么微前端部署比单体应用更复杂

单体前端应用部署时，通常只需要关心一件事：

`把构建产物部署到 Web 服务器，然后保证路由和静态资源可以正常访问`

但微前端不是一个应用，而是由多个部分共同组成：

1. 主应用，负责应用壳、菜单、路由分发、公共能力注入。
2. 子应用，负责具体业务模块，可以独立开发和发布。
3. 网关或 Nginx，负责路径转发、静态资源托管、反向代理。
4. 配置中心或入口注册表，负责告诉主应用“当前该加载哪个子应用地址”。

因此微前端部署时，除了普通前端部署问题，还会额外面对：

1. 子应用资源地址如何被主应用正确加载。
2. 子应用独立发版时，如何避免影响主应用和其他子应用。
3. 多应用之间的路由前缀、鉴权、跨域、缓存如何统一。
4. 出现线上问题时，如何快速回滚某一个子应用，而不是整体回滚。

所以微前端部署的核心不是“把多个 dist 丢到服务器”，而是：

`让主应用和子应用在入口地址、资源路径、路由规则、缓存策略、发布流程上形成稳定约定`

## 二、部署前必须先统一的几个约定

微前端项目在部署前，建议先把下面几件事统一，否则后续大概率会踩坑。

### 2.1、子应用的访问路径

先明确每个子应用最终通过什么地址访问。

常见方式有两类：

1. 同域不同路径

```text
https://example.com/
https://example.com/app-user/
https://example.com/app-order/
```

2. 不同子域或独立域名

```text
https://main.example.com/
https://user.example.com/
https://order.example.com/
```

这一点会直接影响：

1. 前端构建时的 `base`、`publicPath`、`assetPrefix` 配置。
2. Nginx 的 `location`、`root`、`alias`、反向代理规则。
3. 是否需要处理跨域、Cookie、CORS、鉴权透传。

### 2.2、子应用路由前缀

子应用不能和主应用或其他子应用争抢路由前缀。

例如约定：

```text
/app-user
/app-order
/app-finance
```

如果不约定清楚，线上常见问题就是：

1. 刷新页面 404。
2. 主应用和子应用路由互相覆盖。
3. 子应用内部跳转后，主应用识别不到当前激活模块。

### 2.3、静态资源基础路径

微前端部署里最容易出错的一项，就是静态资源路径。

如果子应用部署在：

```text
https://example.com/app-user/
```

那么子应用构建时的资源路径通常也应该和这个前缀匹配，否则很容易出现：

1. 首页打开正常，但 `js`、`css`、图片请求 404。
2. 资源错误地从站点根路径 `/assets/` 加载。
3. 主应用能加载 HTML，但后续 chunk 加载失败。

### 2.4、入口发现方式

主应用必须知道每个子应用该从哪里加载。

常见方式有：

1. 代码写死入口地址。
2. 通过环境变量注入。
3. 通过远程配置中心或 `app-list.json` 动态下发。

如果项目需要频繁发版，通常更推荐：

`主应用读取配置中心或静态注册表，动态获取子应用入口地址`

这样可以让子应用独立切换版本，而不必每次都重新发布主应用。

## 三、常见的三种部署模式

## 3.1、同域同站点，不同路径部署

这是很多公司最先采用的方式，结构直观，也更容易统一鉴权和 Cookie。

例如：

```text
https://example.com/              -> 主应用
https://example.com/app-user/     -> 用户子应用
https://example.com/app-order/    -> 订单子应用
```

这种模式的优点是：

1. 天然同源，跨域问题少。
2. SSO、Cookie、网关鉴权更容易统一。
3. Nginx 层可以统一管理和转发。

不足也很明显：

1. 所有资源通常会汇聚到同一个站点配置里，运维规则耦合更强。
2. 路径前缀必须管理严格，否则容易互相污染。
3. 子应用如果静态资源路径配置错误，问题会直接暴露在线上。

下面给出一个常见的 Nginx 示例：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /data/www/main-app;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /app-user/ {
        alias /data/www/app-user/;
        index index.html;
        try_files $uri $uri/ /app-user/index.html;
    }

    location /app-order/ {
        alias /data/www/app-order/;
        index index.html;
        try_files $uri $uri/ /app-order/index.html;
    }
}
```

这个配置适合：

1. 每个子应用都是独立构建产物。
2. 每个子应用都有各自的路由前缀。
3. 刷新子应用页面时，需要回退到各自的 `index.html`。

## 3.2、不同域名或 CDN 独立部署

如果团队更强调子应用独立发版、独立缓存、独立回滚，通常会采用：

`主应用部署一份，子应用分别部署到各自域名或 CDN 路径`

例如：

```text
https://main.example.com/
https://cdn.example.com/micro/user/20260626/
https://cdn.example.com/micro/order/20260626/
```

或者：

```text
https://main.example.com/
https://user-static.example.com/
https://order-static.example.com/
```

这种模式的优点：

1. 子应用完全独立发版，互不影响。
2. 静态资源可以走 CDN，性能更好。
3. 回滚时只需要切换某个子应用的入口地址。

需要注意的问题：

1. 可能涉及跨域。
2. 如果入口地址写死，切换版本不灵活。
3. 主应用与子应用的缓存控制必须非常谨慎。

实际项目中，常见做法是让主应用先请求一份注册表：

```json
{
  "user": "https://cdn.example.com/micro/user/20260626/",
  "order": "https://cdn.example.com/micro/order/20260626/"
}
```

然后主应用根据这份配置去加载对应的子应用入口。

这种设计的好处是：

1. 发版时只更新子应用资源和注册表。
2. 主应用不需要重新打包。
3. 回滚时只要把注册表切回旧版本地址即可。

## 3.3、Module Federation 远程模块部署

如果项目基于 Webpack Module Federation 或 Rspack Federation，一般会多一个关键入口：

`remoteEntry.js`

主应用通过它去发现并加载远程模块，例如：

```javascript
remotes: {
  userApp: 'userApp@https://cdn.example.com/user/remoteEntry.js',
}
```

这种模式的关键点不在普通静态站点路由，而在：

1. `remoteEntry.js` 是否可访问。
2. 对应 chunk 是否能被继续正确加载。
3. 共享依赖版本是否兼容。

部署时最容易出现的不是首页 404，而是：

1. `remoteEntry.js` 被缓存，主应用一直拿到旧版本。
2. `remoteEntry.js` 更新了，但后续 chunk 地址仍指向旧目录。
3. 主应用和子应用共享的 `react`、`vue`、`router` 版本冲突。

所以 Federation 类方案通常更适合：

1. 团队工程化能力较强。
2. 依赖版本控制比较严格。
3. 有清晰的灰度、回滚和资源版本管理机制。

## 四、生产环境更推荐的部署思路

如果是中大型项目，比较稳妥的思路通常是：

1. 主应用单独部署，尽量保持稳定，不频繁改入口逻辑。
2. 子应用独立构建、独立部署、独立版本目录。
3. 主应用不写死子应用地址，而是通过配置中心动态读取。
4. 静态资源采用带 hash 的文件名。
5. 入口配置支持快速切换版本，便于灰度和回滚。

一个比较常见的目录结构如下：

```text
/data/micro/
  main-app/
  app-user/
    20260620/
    20260626/
    current -> 20260626
  app-order/
    20260618/
    20260625/
    current -> 20260625
```

如果不使用软链接，也可以通过配置文件或注册表来指定当前生效版本。

推荐这样做的原因是：

1. 新版本发布时不会覆盖旧版本目录。
2. 回滚时只需要切换 `current` 或切换配置。
3. 已经发布出去的资源路径稳定，不容易出现旧页面引用新资源导致的错乱。

## 五、Nginx 层常见配置思路

微前端项目里，Nginx 往往不仅是静态文件服务器，还会承担这些角色：

1. 主应用和子应用静态资源托管。
2. 前端路由 history 模式回退。
3. `/api/` 后端接口反向代理。
4. 鉴权头透传、真实 IP 透传。
5. 缓存策略控制。

一个相对完整的示例如下：

```nginx
server {
    listen 80;
    server_name example.com;

    # 主应用
    location / {
        root /data/www/main-app;
        index index.html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # 用户子应用
    location /app-user/ {
        alias /data/www/app-user/current/;
        index index.html;
        try_files $uri $uri/ /app-user/index.html;
    }

    # 订单子应用
    location /app-order/ {
        alias /data/www/app-order/current/;
        index index.html;
        try_files $uri $uri/ /app-order/index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # 接口代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

这里要特别注意两件事：

1. `index.html`、入口清单、注册表配置不宜强缓存。
2. 带 hash 的静态资源适合长缓存。

否则线上非常容易出现“入口已更新，但浏览器还拿着旧入口”的问题。

## 六、缓存策略是微前端部署成功的关键

很多微前端线上问题，本质上都不是“部署失败”，而是“缓存策略错误”。

建议将资源分成两类处理。

### 6.1、不应该强缓存的内容

以下内容通常应该设置为 `no-cache` 或较短缓存：

1. 主应用 `index.html`
2. 子应用 `index.html`
3. 子应用注册表，例如 `app-list.json`
4. `remoteEntry.js`
5. 运行时配置文件

原因很简单：

这些文件决定了“当前该加载哪个版本”，一旦缓存过久，就会让用户继续访问旧入口。

### 6.2、适合长缓存的内容

以下内容通常适合设置长缓存：

1. 带 hash 的 `js`
2. 带 hash 的 `css`
3. 图片、字体等静态资源

因为这些文件名一旦带有 hash，内容变化后文件名也会变化，所以适合使用长期缓存来提升性能。

可以简单记住一条经验：

`决定版本切换的文件短缓存，真正带 hash 的产物长缓存`

## 七、一套更稳妥的发布流程

如果想让微前端部署真正可维护，建议把发布流程设计成“先上传，再切换”，而不是“直接覆盖线上目录”。

一个比较常见的流程如下：

1. CI 构建子应用产物。
2. 产物上传到版本目录，例如 `app-user/20260626-153000/`。
3. 执行基本烟雾测试，确认入口文件和关键资源可访问。
4. 更新配置中心或切换软链接，让新版本对外生效。
5. 观察监控、日志、前端埋点和接口错误率。
6. 如果发现问题，快速切回旧版本目录。

这种流程的核心优点是：

1. 发布动作和上线生效动作分离。
2. 回滚速度快。
3. 几乎不需要重新上传旧资源。

## 八、微前端部署中的常见坑

## 8.1、子应用刷新页面 404

这通常是因为子应用使用了 `history` 路由，但服务端没有给对应路径做 `index.html` 回退。

例如子应用地址是：

```text
/app-user/profile
```

刷新时，Nginx 会先把它当成真实文件路径去找，如果没有配置：

```nginx
try_files $uri $uri/ /app-user/index.html;
```

就会直接返回 `404`。

## 8.2、主应用能打开，但子应用资源 404

常见原因有：

1. 子应用构建时 `base`、`publicPath` 配错。
2. 子应用部署在子路径下，但资源按根路径去加载。
3. `remoteEntry.js` 能访问，但后续 chunk 地址不对。
4. Nginx `alias` 配置与前端资源路径不一致。

## 8.3、切换新版本后出现 Chunk Load Error

这在微前端项目中非常常见。

常见场景是：

1. 用户打开了旧页面。
2. 你发布了新版本，并覆盖了旧目录。
3. 用户页面里的旧入口文件还在，但后续懒加载 chunk 已经不存在。
4. 浏览器请求旧 chunk 失败，于是报 `ChunkLoadError`。

解决思路通常是：

1. 不覆盖旧版本目录。
2. 使用版本化目录发布。
3. 入口文件短缓存。
4. 异常时提示用户刷新页面。

## 8.4、跨域和鉴权问题

如果主应用和子应用不是同域部署，就容易遇到：

1. Cookie 丢失。
2. CORS 被拦截。
3. 登录态不能共享。
4. 接口网关校验失败。

这种情况下需要结合项目实际，统一设计：

1. 是否使用同域网关代理。
2. 是否改用 Token 透传，而不是依赖 Cookie。
3. 是否给子应用静态资源域名配置 CORS。
4. 是否需要 `withCredentials`。

## 8.5、主应用和子应用版本不兼容

例如主应用升级了公共通信协议、全局状态字段、共享依赖版本，但某个子应用还没同步升级，这时就可能出现：

1. 子应用启动失败。
2. 生命周期钩子不兼容。
3. 全局数据结构变化导致运行时错误。

因此微前端项目除了资源部署，还要管理：

1. 应用契约版本。
2. 共享依赖版本。
3. 主子应用兼容矩阵。

## 九、一个适合多数团队的落地建议

如果你的团队目前还在微前端早期阶段，可以优先采用下面这套方案：

1. 主应用保持单独部署。
2. 子应用使用独立版本目录部署。
3. 主应用通过配置文件读取子应用入口。
4. `index.html`、注册表、`remoteEntry.js` 不做强缓存。
5. 静态资源全部使用 hash 文件名并长缓存。
6. Nginx 统一负责路由回退和 `/api/` 代理。
7. 发布流程采用“上传新版本 -> 验证 -> 切流量/切配置 -> 观察 -> 可回滚”。

这套方案的优点是：

1. 实现成本不算高。
2. 运维和前端职责边界清晰。
3. 后期扩展到灰度发布、配置中心、CDN 也比较平滑。

## 十、上线前检查清单

每次发布前，建议至少确认以下事项：

1. 子应用入口地址是否正确。
2. 子应用路由前缀是否与线上配置一致。
3. 构建后的资源基础路径是否正确。
4. `index.html`、注册表、`remoteEntry.js` 是否未被强缓存。
5. 带 hash 的静态资源是否可以长缓存。
6. Nginx 是否正确处理了子应用刷新回退。
7. `/api/` 代理、鉴权头、Cookie 或 Token 是否正常。
8. 是否保留了上一个可回滚版本。
9. 是否做过至少一次线上等价环境的烟雾验证。

## 十一、小结

微前端部署的难点，从来都不只是把文件传到服务器，而是同时管理好：

1. 主应用和子应用的入口关系。
2. 路由前缀和资源路径。
3. 缓存和版本切换策略。
4. 网关、鉴权、跨域和回滚能力。

如果只记住一句话，可以记成：

`微前端部署的本质，是让多个可独立发布的前端应用，在统一入口和统一规则下稳定协作`

只要把入口发现、资源路径、缓存控制、版本回滚这四件事处理好，微前端部署就会稳定很多。
