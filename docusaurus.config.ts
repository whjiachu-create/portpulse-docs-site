// docs-site/docusaurus.config.ts
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'PortPulse Docs',
  url: 'https://docs.useportpulse.com',
  baseUrl: '/',
  favicon: 'img/favicon.svg',

  // 不因偶发无关链接中断构建（仍建议后续清理）
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          // 默认 /docs 路由；如需根路由，改为 routeBasePath: '/'
          sidebarPath: require.resolve('./sidebars.ts'),
          // 明确关闭“Edit this page”按钮
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  // Redoc for /openapi
  themes: ['docusaurus-theme-redoc'],

  themeConfig: {
    navbar: {
      title: 'PortPulse',
      logo: {
        alt: 'PortPulse',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 24,
        height: 24,
      },
      items: [
        { to: '/docs/intro', label: 'Docs', position: 'left' },
        { to: '/openapi', label: 'API Reference', position: 'left' },
        // ✅ 去掉 GitHub 入口（如后续需要可以换成 status/console 链接）
        // { href: 'https://github.com/whjiachu-create/portpulse01', label: 'GitHub', position: 'right' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
