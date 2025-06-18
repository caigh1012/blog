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
          { text: 'JavaScript', link: '/javaScript' },
          { text: 'TypeScript', link: '/coding/typescript/basic' },
          { text: 'Node', link: '/node' },
          { text: 'Angular', link: '/angular' },
          { text: 'Webpack', link: '/webpack' },
          { text: 'Rxjs', link: '/rxjs' },
          { text: 'Flutter', link: '/coding/flutter/flutter-window-dev' },
          { text: 'Java', link: '/coding/java' },
          { text: 'Rust', link: '/rust' },
          { text: '数据库', link: '5454'}
        ],
      },
      { text: '博客', link: '/blog' },
      { text: 'CI/CD', link: '/markdomples' },
      { text: '计算机网络', link: '/markdo' },
      { text: '操作系统', link: '/os/window/win10-os-install' },
      { text: '日常记录', link: '/daily/todo' },
    ],
    sidebar: {
      '/daily/': [
        {
          items: [
            { text: '待办记录', link: '/daily/todo' },
            { 
              text: '操作系统', 
              items: [
                { text: 'Linux的CentOS和ubuntu镜像', link: '/daily/os/linux-system-iso', collapsed: true },
              ] 
            },
            { 
              text: '编辑器', 
              items: [
                { text: 'VSCode终端权限问题', link: '/daily/idea/vscode-terminal', collapsed: true },
              ] 
            },
          ]
        }
      ],
      '/os/': [
        {
          text: 'Windows操作系统',
          items: [
            { text: 'Win10将动态分区转成基本分区', link: '/os/window/win10-os-install'  },
          ]
        },
        {
          text: 'MacOS操作系统',
          items: [
            { text: 'MacOS操作系统', link: '/os/macos/macos'  },
          ]
        },
        {
          text: 'Linux操作系统',
          items: [
            { text: 'Linux必备基础常识', link: '/os/linux/linux-base'  },
            { text: 'Linux常用命令', link: '/os/linux/linux-cmd'  },
            { text: 'Linux系统的软件安装方式', link: '/os/linux/linux-software-install/index'  },
          ]
        },
        {
          text: 'VMware',
          items: [
            { text: 'VMware安装CentOS系统', link: '/os/vmware/vmware-install-centos' },
            { text: 'VMware安装Ubuntu系统', link: '/os/vmware/vmware-install-ubuntu' },
          ]
        }
      ],
      '/coding/typescript/': [
        {
          items: [
            { text: 'TypeScript快速入门', link: '/coding/typescript/basic' },
            { text: 'TypeScript高级进阶', link: '/coding/typescript/advance' },
            { text: 'TypeScript的tsconfig配置讲解', link: '/coding/typescript/tsconfig' },
          ]
        }
      ],
      '/coding/java': [
         { text: 'Java学习路线', link: '/coding/java' },
      ],
      '/coding/flutter': [
         { text: 'Win10搭建Flutter项目开发环境', link: '/coding/flutter/flutter-window-dev' },
      ]
    },

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
      lazyLoading: true
    },
  },
  ignoreDeadLinks: true,
});
