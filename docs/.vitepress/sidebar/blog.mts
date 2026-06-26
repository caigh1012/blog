export default {
  /**
   * 前端核心原理总结
   */
  '/blog/fe/': [
    {
      /**
       * AST原理
       */
      text: 'AST原理',
      items: [
        { text: 'AST抽象语法树', link: '/blog/fe/compile/ast/index' },
        { text: 'Babel@7使用入门', link: '/blog/fe/compile/babel@7/index' },
        { text: 'SWC编译器使用入门', link: '/blog/fe/compile/swc/index' },
      ],
    },
    {
      /**
       * 前端构建工具
       */
      text: '前端构建工具',
      items: [
        { text: 'Webpack基础入门', link: '/blog/fe/build/webpack/base/index' },
        { text: 'Webpack高级', link: '/blog/fe/build/webpack/advance/index' },
        { text: 'Webpack源码执行过程分析', link: '/blog/fe/build/webpack/source-code/index' },
        { text: '工程化中import被编译了什么', link: '/blog/fe/build/webpack/import/index' },
        { text: 'Webpack热更新原理', link: '/blog/fe/build/webpack/dev-server/index' },
        { text: 'style-css-loader原理', link: '/blog/fe/build/webpack/style-css-loader/index' },
      ],
    },
    {
      /**
       * 前端框架使用
       */
      text: '前端框架使用',
      items: [
        // {
        //   text: 'React框架',
        //   items: [],
        // },
        {
          text: 'Angular框架',
          items: [
            { text: 'Angular@16快速入门', link: '/blog/fe/framework/angular/angular16/index' },
          ],
        },
        // {
        //   text: 'Vue框架',
        //   items: [],
        // },
      ],
    },
    {
      /**
       * 前端框架核心原理分析
       */
      text: '前端框架核心原理分析',
      items: [
        { text: 'Singal源码分析', link: '/blog/fe/framework-principle/signals/index' },
        // { text: '虚拟Dom原理分析', link: '/blog/framework-principle/vnode/index' },
        { text: 'React渲染原理', link: '/blog/fe/framework-principle/react-render/index' },
        { text: 'React合成事件', link: '/blog/fe/framework-principle/react-synthetic-event/index' },
        { text: 'React-Router原理分析', link: '/blog/fe/framework-principle/history/index' },
        { text: 'zustand源码', link: '/blog/fe/framework-principle/zustand/index' },
      ],
    },
    {
      /**
       * 源码分析
       */
      text: '前端库源码分析',
      items: [
        { text: 'axios源码分析', link: '/blog/fe/source-code-analysis/axios/index' },
        // { text: 'antd源码分析', link: '/blog/fe/source-code-analysis/ant-design/index' },
      ],
    },
    {
      /**
       * 前端图表
       */
      text: '前端图表',
      items: [
        { text: 'SVG文档入门', link: '/blog/fe/graphics/svg/index' },
        { text: 'SVG.js入门指南', link: '/blog/fe/graphics/svg.js/index' },
      ],
    },
  ],
};
