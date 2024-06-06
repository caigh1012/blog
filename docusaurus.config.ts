import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Kyler Tsai‘s Blogs and Notes',
  favicon: 'images/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  headTags: [
    /**
     * 处理图片加载失败
     */
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'no-referrer',
      },
    },
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Kyler Tsai', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  /**
   * 静态资源文件
   */
  staticDirectories: ['static', 'assets'],

  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn'],
    localeConfigs: {
      'zh-cn': {
        htmlLang: 'zh',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/', // Serve the docs at the site's root.
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/entry.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  /**
   * markdown扩展
   */
  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    navbar: {
      title: 'Kyler Tsai',
      logo: {
        alt: 'Kyler Tsai’s Logo',
        src: 'images/logo.png',
      },
      items: [
        {
          type: 'dropdown',
          position: 'left',
          label: '学习笔记',
          items: [
            {
              label: 'JavaScript',
              type: 'docSidebar',
              sidebarId: 'javascript',
            },
            {
              label: 'JQuery',
              type: 'docSidebar',
              sidebarId: 'jquery',
            },
            {
              label: 'TypeScript',
              type: 'docSidebar',
              sidebarId: 'typescript',
            },
            {
              label: 'Node',
              type: 'docSidebar',
              sidebarId: 'node',
            },
            {
              label: 'Angular',
              type: 'docSidebar',
              sidebarId: 'angular',
            },
            {
              label: 'Webpack',
              type: 'docSidebar',
              sidebarId: 'webpack',
            },
            {
              label: 'Rxjs',
              type: 'docSidebar',
              sidebarId: 'rxjs',
            },
            {
              label: '计算机网络',
              type: 'docSidebar',
              sidebarId: 'network',
            },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'blog',
          label: '博客',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'devops',
          label: 'DevOps专题',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'daily',
          label: '日常记录',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/caigh1012/blog',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    algolia: {
      // If Algolia did not provide you any appId, use 'BH4D9OD16A'
      appId: 'W0V4B3VI2C',
      apiKey: 'c3aa19958ce2373940a05438a746daad',
      indexName: 'caigh',
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} by Kyler Tsai, Inc. Built with Docusaurus.`,
    },
    prism: {
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      content: '🚀 本网址如有侵权，请速联系我删除 ~ 联系方式QQ：523492108@qq.com',
      textColor: '#091E42',
      isCloseable: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
