export default {
  /**
   * 前端编译原理
   */
  '/blog/compile/': [
    { text: 'AST抽象语法树', link: '/blog/compile/ast/index' },
    { text: 'Babel@7使用入门', link: '/blog/compile/babel@7/index' },
    { text: 'SWC编译器使用入门', link: '/blog/compile/swc/index' },
  ],
  /**
   * 前端构建工具
   */
  '/blog/build/': [
    { text: 'Webpack基础入门', link: '/blog/build/webpack/base/index' },
    { text: 'Webpack高级', link: '/blog/build/webpack/advance/index' },
    { text: 'Webpack源码执行过程分析', link: '/blog/build/webpack/source-code/index' },
    { text: '工程化中import被编译了什么', link: '/blog/build/webpack/import/index' },
    { text: 'Webpack热更新原理', link: '/blog/build/webpack/dev-server/index' },
    { text: 'style-css-loader原理', link: '/blog/build/webpack/style-css-loader/index' },
  ],
  /**
   * 框架使用
   */
  '/blog/framework/': [
    // {
    //   text: 'React框架',
    //   items: [],
    // },
    {
      text: 'Angular框架',
      items: [{ text: 'Angular@16快速入门', link: '/blog/framework/angular/angular16/index' }],
    },
    // {
    //   text: 'Vue框架',
    //   items: [],
    // },
  ],
  /**
   * 前端框架核心原理分析
   */
  '/blog/framework-principle/': [
    { text: 'Singal源码分析', link: '/blog/framework-principle/signals/index' },
    // { text: '虚拟Dom原理分析', link: '/blog/framework-principle/vnode/index' },
    { text: 'React合成事件', link: '/blog/framework-principle/vnode/index' },
    { text: 'React的Fiber架构', link: '/blog/framework-principle/vnode/index' },
    { text: 'React渲染原理', link: '/blog/framework-principle/vnode/index' },
    { text: 'React-Router原理分析', link: '/blog/framework-principle/vnode/index' },
    { text: 'zustand源码', link: '/blog/framework-principle/vnode/index' },
  ],
  /**
   * 源码分析
   */
  '/blog/source-code-analysis/': [
    { text: 'ant-design源码', link: '/blog/source-code-analysis/ant-design' },
    { text: 'axios源码', link: '/blog/source-code-analysis/ant-design' },
    { text: 'Promise源码', link: '/blog/source-code-analysis/ant-design' },
  ],
  /**
   * DevOps
   */
  '/blog/devops/': [
    { text: 'DevOps自动化部署实战V1.0', link: '/blog/devops/devops-blog-v1.0' },
    { text: 'DevOps自动化部署实战V2.0', link: '/blog/devops/devops-blog-v2.0' },
  ],
  /**
   * 前端图表
   */
  '/blog/graphics/': [
    { text: 'SVG文档入门', link: '/blog/graphics/svg/index' },
    { text: 'SVG.js入门指南', link: '/blog/graphics/svg.js/index' },
  ],
  /**
   * 其他
   */
  '/blog/other/': [{ text: 'PicGo使用', link: '/blog/other/picgo/index' }],
};
