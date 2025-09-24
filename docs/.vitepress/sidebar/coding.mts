export default {
  '/coding/typescript/': [
    { text: 'TypeScript快速入门', link: '/coding/typescript/basic/index' },
    { text: 'TypeScript高级进阶', link: '/coding/typescript/advance/index' },
    { text: 'tsconfig.json配置讲解', link: '/coding/typescript/tsconfig/index' },
  ],
  '/coding/java/': [
    { text: 'Java学习路线', link: '/coding/java/index' },
    { text: 'Java在Window10环境安装', link: '/coding/java/java-window-install/index' },
    { text: 'Java快速入门', link: '/coding/java/java-se/index' },
    { text: 'MySQL快速入门', link: '/coding/java/mysql/index' },
    { text: 'JDBC连接数据库', link: '/coding/java/jdbc/index' },
    {
      text: 'Maven构建工具',
      items: [
        { text: 'Maven在Window10安装', link: '/coding/java/maven/maven-window-install/index' },
        { text: 'Maven构建工具使用', link: '/coding/java/maven/maven/index' },
        { text: 'Maven私服仓库搭建', link: '/coding/java/maven/nexus/index' },
        { text: '不使用Maven构建jar包', link: '/coding/java/maven/no-maven-build-jar/index' },
        { text: '不使用Maven构建war包', link: '/coding/java/maven/no-maven-build-war/index' },
        { text: 'Maven构建jar包', link: '/coding/java/maven/maven-build-jar/index' },
        { text: 'Maven构建war包', link: '/coding/java/maven/maven-build-war/index' },
      ],
    },
    {
      text: 'Mybatis',
      items: [{ text: 'Mybatis快速入门', link: '/coding/java/mybatis/index' }],
    },
    {
      text: 'SSM项目搭建',
      items: [
        { text: 'SSM注解方式搭建', link: '/coding/java/ssm/ssm-inn' },
        { text: 'SSM的XML方式搭建', link: '/coding/java/ssm/ssm-xml' },
      ],
    },
    {
      text: 'SpringBoot',
      items: [
        { text: '三层架构', link: '/coding/java/springboot/three-tier' },
        { text: 'SpringSession', link: '/coding/java/springboot/session' },
      ],
    },
    {
      text: 'Redis',
      items: [{ text: 'Redis@7快速入门', link: '/coding/java/redis/index' }],
    },
    {
      text: '微服务',
      items: [{ text: '微服务快速入门', link: '/coding/java/microservice/index' }],
    },
    {
      text: '常见字符集',
      link: '/coding/java/unicode/index',
    },
  ],
  '/coding/flutter/': [
    { text: 'Win10搭建Flutter项目开发环境', link: '/coding/flutter/flutter-window-dev/index' },
    { text: 'Dart快速入门', link: '/coding/flutter/dart/index' },
    { text: 'Flutter开发Android和iOS实战', link: '/coding/flutter/flutter-app-template/index' },
  ],
  '/coding/javascript/': [
    {
      text: 'JavaScript',
      items: [
        { text: '值传递和引用传递', link: '/coding/javascript/javascript/reference/index' },
        { text: '正则表达式', link: '/coding/javascript/javascript/regexp' },
        { text: '预解析与变量提升', link: '/coding/javascript/javascript/pre-parser' },
        { text: '作用域和作用域链', link: '/coding/javascript/javascript/scope/index' },
        { text: 'this指向', link: '/coding/javascript/javascript/this' },
        { text: '链式调用', link: '/coding/javascript/javascript/chain-call' },
        { text: '原型和原型链', link: '/coding/javascript/javascript/prototype/index' },
        { text: '继承', link: '/coding/javascript/javascript/extends' },
      ],
    },
    {
      text: '浏览器',
      items: [
        { text: '浏览器加载JavaScript方式', link: '/coding/javascript/browser/load/index' },
        {
          text: 'ES模块的工作原理（浏览器环境）',
          link: '/coding/javascript/browser/esmodule/index',
        },
        { text: 'V8是如何执行JavaScript代码', link: '/coding/javascript/browser/v8/index' },
        { text: '浏览器缓存', link: '/coding/javascript/browser/http/index' },
        {
          text: '浏览器Cookie、LocalStorage和SessionStorage详解',
          link: '/coding/javascript/browser/cookie/index',
        },
        {
          text: 'Cookie和Session共享登录案例',
          link: '/coding/javascript/browser/session/index',
        },
      ],
    },
    {
      text: 'Web安全',
      items: [
        { text: 'XSS攻击', link: '/coding/javascript/web-security/xss' },
        { text: 'CSRF攻击', link: '/coding/javascript/web-security/csrf' },
        { text: '前端存储Token方案', link: '/coding/javascript/web-security/token/index' },
      ],
    },
  ],
  '/coding/node/': [
    { text: 'Node.js快速入门', link: '/coding/node/node/index' },
    { text: 'require模块加载机制', link: '/coding/node/require/index' },
    { text: '模块化对比', link: '/coding/node/require/index' },
    { text: '密码学', link: '/coding/node/crypto/index' },
  ],
  '/coding/rust/': [
    { text: 'Rust在Win10环境下的安装', link: '/coding/rust/rust-window-install/index' },
  ],
  '/coding/patterns/': [{ text: '设计模式', link: '/coding/patterns/index' }],
};
