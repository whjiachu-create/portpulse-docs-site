// docs-site/docusaurus.config.ts
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'PortPulse Docs',
  url: 'https://docs.useportpulse.com',
  baseUrl: '/',
  favicon: 'img/favicon.svg',

  onBrokenLinks: 'warn', // 临时改为 warn 而不是 throw
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    ['classic', {
      docs: { sidebarPath: require.resolve('./sidebars.ts') },
      blog: false,
      theme: { customCss: require.resolve('./src/css/custom.css') },
    }],
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
        { href: 'https://github.com/whjiachu-create/portpulse01', label: 'GitHub', position: 'right' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;