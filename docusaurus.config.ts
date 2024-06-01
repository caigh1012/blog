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

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  /**
   * 静态资源文件
   */
  staticDirectories: ['static', 'assets'],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root.
          sidebarPath: './sidebars.ts',
        },
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
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
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
              label: '网络工程',
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
          href: 'https://github.com/facebook/docusaurus',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
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
