import { defineConfig } from 'vitepress';
import sidebar from './sidebar/sidebar.mts';

export default defineConfig({
  title: 'Tsai',
  description: "Tsai's Blog",
  base: '/',
  lang: 'zh-CN',
  srcExclude: ['assets/**'],
  outDir: '../dist',
  cleanUrls: false,
  appearance: 'force-dark',

  head: [
    [
      'meta',
      {
        name: 'referrer',
        content: 'no-referrer',
      },
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  /**
   * 主题
   */
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '重置搜索',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭',
            },
          },
        },
      },
    },

    nav: [
      {
        text: '编程',
        items: [
          { text: 'JavaScript', link: '/coding/javascript/reference' },
          { text: 'TypeScript', link: '/coding/typescript/basic' },
          { text: 'Node', link: '/coding/node/node' },
          { text: 'Angular', link: '/coding/angular/angular16' },
          { text: 'Webpack', link: '/webpack' },
          { text: 'Rxjs', link: '/rxjs' },
          { text: 'Flutter', link: '/coding/flutter/flutter-window-dev' },
          { text: 'Java', link: '/coding/java' },
          { text: 'Rust', link: '/coding/rust/rust-window-install' },
          { text: '数据库', link: '5454' },
        ],
      },
      {
        text: '博客',
        items: [
          { text: '前端工程化', link: '/blog/devops/devops-blog-v1.0' },
          { text: '框架核心原理', link: '/blog/devops/devops-blog-v1.0' },
          { text: '常用库源码解析', link: '/blog/devops/devops-blog-v1.0' },
          { text: 'DevOps', link: '/blog/devops/devops-blog-v1.0' },
          { text: '其他', link: '/blog/other/picgo' },
        ],
      },
      { text: 'CI/CD', link: '/markdomples' },
      { text: '计算机网络', link: '/markdo' },
      { text: '操作系统', link: '/os/window/win10-os-install' },
      { text: '日常记录', link: '/daily/todo' },
    ],
    sidebar: sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/caigh1012/blog' }],

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    notFound: {
      title: '页面未找到',
      quote: '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页',
    },

    returnToTopLabel: '回到顶部',

    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} by Tsai, Inc. Built with VitePress.`,
    },
  },

  markdown: {
    lineNumbers: true,
    math: true,
    image: {
      lazyLoading: true,
    },
  },
  ignoreDeadLinks: true,
});
