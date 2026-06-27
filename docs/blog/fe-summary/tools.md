# 前端工具收集

## 一、CDN

| 名称 | 介绍 |
| --- | --- |
| [cdnjs](https://cdnjs.com/) | 常用的公共 CDN 资源库，适合快速引入前端库的浏览器版本文件。 |
| [jsDelivr](https://www.jsdelivr.com/) | 支持 npm、GitHub 等来源的免费 CDN，国内外访问速度和稳定性都比较好。 |
| [unpkg](https://unpkg.com/) | 基于 npm 包分发的 CDN，可直接查看和引用包内文件，调试时很方便。 |



## 二、浏览器兼容性排查

| 名称 | 介绍 |
| --- | --- |
| [Can I use](https://caniuse.com/) | 查询 HTML、CSS、JavaScript 特性在各浏览器中的兼容性情况。 |
| [Browserslist](https://browsersl.ist/) | 在线查看 Browserslist 配置对应的浏览器范围，便于校验兼容性目标。 |



## 三、NPM库收集

### 3.1、node开发cli脚本

| 名称 | 介绍 |
| --- | --- |
| [gradient-string](https://www.npmjs.com/package/gradient-string) | 为终端输出添加渐变色效果，适合美化 CLI 文案。 |
| [boxen](https://www.npmjs.com/package/boxen) | 在终端中生成带边框的文本块，适合突出提示信息。 |

### 3.2、node环境开发专用

| 名称 | 介绍 |
| --- | --- |
| [adm-zip](https://www.npmjs.com/package/adm-zip) | 用于在 Node.js 环境中读取、解压和生成 ZIP 文件。 |
| [query-string](https://www.npmjs.com/package/query-string) | 处理 URL 查询参数的解析与序列化，API 简洁。 |
| [nodemon](https://www.npmjs.com/package/nodemon) | 监听文件变更并自动重启 Node 服务，常用于本地开发。 |
| [express](https://www.npmjs.com/package/express) | Node.js 常用的 Web 应用框架，用于构建 HTTP 服务、路由和中间件体系。 |
| [crypto-js](https://www.npmjs.com/package/crypto-js) | 提供常见加密算法与哈希函数，可用于摘要计算、对称加密等场景。 |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 用于生成、签发和校验 JWT，常见于登录鉴权与接口认证。 |
| [express-session](https://www.npmjs.com/package/express-session) | 为 Express 提供服务端 Session 会话管理能力。 |
| [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) | Node.js 进程管理工具，支持应用守护、重启、日志查看与多进程部署。 |

### 3.3、工具类

| 名称 | 介绍 |
| --- | --- |
| [javascript-stringify](https://www.npmjs.com/package/javascript-stringify) | 将 JavaScript 对象安全地转成字符串，适合代码生成场景。 |
| [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) | 检查并批量更新 `package.json` 中依赖版本。 |
| [npm-run-all](https://www.npmjs.com/package/npm-run-all) | 更方便地串行或并行执行多个 npm scripts。 |
| [dompurify](https://www.npmjs.com/package/dompurify) | 清理不安全 HTML 内容，降低 XSS 风险。 |
| [eslint-import-resolver-alias](https://www.npmjs.com/package/eslint-import-resolver-alias) | 让 ESLint 正确识别自定义路径别名导入。 |
| [qrcode](https://www.npmjs.com/package/qrcode#usage) | 用于生成二维码，支持终端、Canvas、Data URL 等输出形式。 |
| [comlink](https://www.npmjs.com/package/comlink) | 简化 Web Worker 与主线程之间的通信调用。 |
| [js-yaml](https://www.npmjs.com/package/js-yaml) | 解析和生成 YAML 内容，常用于配置文件处理。 |
| [tsx](https://www.npmjs.com/package/tsx) | 直接运行 TypeScript/ESM 文件，适合开发和脚本执行。 |
| [whistle](https://www.npmjs.com/package/whistle) | 常用的抓包与代理调试工具，适合前后端联调。 |

## 四、图标库

| 名称 | 介绍 |
| --- | --- |
| [iconfont](https://www.iconfont.cn/) | 阿里巴巴矢量图标库平台，支持图标检索、项目管理与多种前端接入方式。 |
| [lucide](https://lucide.dev/icons/) | 风格统一的开源线性图标库，适合现代 Web 界面使用。 |
| [Font Awesome](https://fontawesome.com/start) | 知名图标库，图标种类丰富，支持 Web、React 等多种接入方式。 |
| [Feather Icons](https://feathericons.com/) | 轻量简洁的开源线性图标集，适合极简风格界面。 |
| [IconPark](https://iconpark.oceanengine.com/official) | 字节跳动出品的图标库，支持多主题风格与多端图标导出。 |
| [Yesicon](https://yesicon.app/?lang=en) | 聚合式图标搜索平台，方便按名称快速查找不同来源的图标资源。 |

## 五、前端动画库

### 5.1、css动画

| 名称 | 介绍 |
| --- | --- |
| [Animista](https://animista.net/) | 可视化生成 CSS 动画效果，并可直接复制对应代码。 |
| [Animate.css](https://animate.style/) | 常用的 CSS 动画类库，开箱即用，适合快速添加入场和强调效果。 |

### 5.2、js动画

| 名称 | 介绍 |
| --- | --- |
| [Anime.js](https://animejs.com/documentation/) | 轻量灵活的 JavaScript 动画库，适合处理 DOM、SVG 和时间轴动画。 |
| [GSAP](https://gsap.com/docs/v3/Installation) | 功能强大的高性能动画库，适合复杂交互与时间线编排。 |
| [Motion](https://motion.dev/) | 面向现代前端框架的动画库，适合声明式交互动效开发。 |

### 5.3、文字相关

| 名称 | 介绍 |
| --- | --- |
| [Textillate.js](http://textillate.js.org/) | 适合制作文字入场与强调效果的动画库，常结合 CSS 动画使用。 |
| [Typed.js](https://mattboldt.com/demos/typed-js/) | 实现打字机文字动画效果，常用于 Banner 或介绍页文案展示。 |
| [Textify](https://textify-js.vercel.app/) | 专注文本动效的 JavaScript 库，适合标题和段落的动态呈现。 |

### 5.4、框架结合动画库

| 名称 | 介绍 |
| --- | --- |
| [React Bits](https://reactbits.dev/get-started/introduction) | 提供适合 React 项目的动效组件与交互示例，便于快速复用。 |
| [Ant Motion](https://motion.ant.design/index-cn) | Ant Design 体系下的动效方案，适合中后台和业务系统接入。 |

## 六、文档库

| 名称 | 介绍 |
| --- | --- |
| [Nextra](https://nextra.site/) | 基于 Next.js 的文档站点框架，适合构建内容站与知识库。 |
| [Dumi](https://d.umijs.org/) | 面向组件库场景的文档框架，适合展示组件示例与 API 文档。 |
| [Docusaurus](https://docusaurus.io/zh-CN/docs) | Meta 出品的静态文档站点生成器，适合产品文档和社区站点。 |
| [VitePress](https://vitepress.dev/zh/) | 基于 Vite 和 Vue 的静态文档生成器，构建速度快，适合技术文档。 |

## 七、框架库需求接入

### 7.1、React库相关

| 名称 | 介绍 |
| --- | --- |
| [react-use](https://streamich.github.io/react-use) | 常用 React Hooks 集合，覆盖状态、生命周期、浏览器能力等场景。 |
| [Ant Motion](https://motion.ant.design/index-cn) | 适合 React + Ant Design 项目的动效解决方案。 |
| [React Bits](https://reactbits.dev/get-started/introduction) | 提供适合 React 场景的交互动效组件与效果示例。 |
| [clsx](https://www.npmjs.com/package/clsx) | 用于按条件拼接 `className`，体积小、写法简洁。 |
| [ahooks](https://ahooks.js.org) | 阿里出品的 React Hooks 库，覆盖业务开发中的高频需求。 |
| [react-hook-form](https://react-hook-form.com/) | 高性能 React 表单库，适合复杂表单状态与校验管理。 |
| [react-fast-marquee](https://www.react-fast-marquee.com/) | React 跑马灯组件，适合制作横向滚动展示效果。 |
| [use-gesture](https://use-gesture.netlify.app/docs/) | 处理拖拽、缩放、滑动等手势交互的 React 工具库。 |
| [react-sortable-hoc](https://clauderic.github.io/react-sortable-hoc/#/basic-configuration/basic-usage?_k=jzb6ec) | 为 React 列表提供拖拽排序能力。 |
| [react-spring](https://www.react-spring.dev/docs/components/use-chain) | 面向 React 的弹簧动画库，适合自然流畅的交互动效。 |
| [FormatJS](https://formatjs.github.io/) | 国际化工具集，支持消息格式化、日期数字本地化等能力。 |
| [Ant Design](https://ant.design/components/overview-cn/) | 企业级 React UI 组件库，适合中后台与业务系统开发。 |

### 7.2、公共（其他框架都可以接入）

| 名称 | 介绍 |
| --- | --- |
| [xgplayer](https://github.com/bytedance/xgplayer) | 字节跳动开源的视频播放器，支持插件扩展与多种播放场景。 |
| [lodash-es](https://www.npmjs.com/package/lodash-es) | 基于 ES Module 的 Lodash 版本，便于按需引入工具函数。 |
| [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite) | 原子化 CSS 框架，适合快速搭建一致的界面样式。 |
| [dayjs](https://www.npmjs.com/package/dayjs) | 轻量日期处理库，API 风格接近 Moment.js。 |
| [file-saver](https://www.npmjs.com/package/file-saver) | 用于在浏览器端触发文件下载与保存。 |
| [zod](https://www.npmjs.com/package/zod) | TypeScript 友好的数据校验与模式定义库。 |
| [loadable-components](https://loadable-components.com/docs/getting-started/) | 支持组件级动态加载与代码分割，适合优化首屏性能。 |
| [TanStack Query](https://tanstack.com/query/latest) | 服务端数据请求、缓存与同步管理方案。 |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | 为 Markdown 解析增加 GitHub Flavored Markdown 支持。 |
| [date-fns](https://date-fns.org/docs/Getting-Started) | 函数式日期处理库，支持按需引入。 |
| [dateformat](https://www.npmjs.com/package/dateformat) | 用于格式化日期字符串，使用方式简单直接。 |
| [Maskito](https://maskito.dev/) | 输入框掩码库，适合手机号、金额、日期等格式约束输入。 |
| [AG Grid](https://www.ag-grid.com/react-data-grid/getting-started/) | 功能强大的表格组件，适合复杂数据展示与交互。 |
| [PixiJS](https://pixijs.com/8.x/guides/getting-started/quick-start) | 高性能 2D 渲染引擎，适合图形、动画和轻量游戏开发。 |
| [Driver.js](https://driverjs.com/docs/installation) | 用于制作页面引导与功能介绍流程。 |
| [currency.js](https://currency.js.org/) | 处理金额计算与格式化，降低浮点数精度问题。 |
| [Lodash](https://lodash.com/docs/4.18.1) | 常用 JavaScript 工具函数库，覆盖数组、对象、函数等操作。 |
| [Radash](https://radash-docs.vercel.app/docs/getting-started) | 现代化 JavaScript 工具库，API 简洁且类型支持较好。 |
| [Emotion](https://emotion.sh/docs/introduction) | CSS-in-JS 方案，适合在组件中编写动态样式。 |

## 八、Markdown相关

| 名称 | 介绍 |
| --- | --- |
| [@mdx-js/mdx](https://www.npmjs.com/package/@mdx-js/mdx) | 将 Markdown 与 JSX 结合，适合构建可嵌入组件的内容系统。 |
| [MDX 中文网](https://www.mdxjs.cn/) | MDX 的中文文档与入门资料站点。 |
| [Mermaid](https://mermaid.js.org/) | 用文本语法生成流程图、时序图等图表，适合文档场景。 |
| [markdown-it](https://markdown-it.github.io/) | 可扩展的 Markdown 解析器，适合自定义渲染规则。 |
| [Typora 指南](https://typorachina.com/guide/) | Typora 中文使用指南，适合了解 Markdown 编辑器的常见能力。 |

