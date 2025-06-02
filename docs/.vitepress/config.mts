import { defineConfig } from 'vitepress';

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
          { text: 'JavaScript', link: '/item-1' },
          { text: 'TypeScript', link: '/item-2' },
          { text: 'Node', link: '/item-3' },
          { text: 'Angular', link: '/item-3' },
          { text: 'Webpack', link: '/item-3' },
          { text: 'Rxjs', link: '/item-3' },
          { text: 'Flutter', link: '/item-3' },
          { text: 'Java', link: '/item-3' },
          { text: 'Rust', link: '/item-3' },
        ],
      },
      { text: '博客', link: '/sda' },
      { text: 'CI/CD', link: '/markdomples' },
      { text: '计算机网络', link: '/markdo' },
      { text: '操作系统', link: '/sda' },
      { text: '日常记录', link: '/markdmples' },
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

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
  ignoreDeadLinks: true,
});
