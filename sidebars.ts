// sidebars.ts
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    // 首页
    'intro',

    // Getting Started
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        // 这里用新的 ID：authentication（旧的是 getting-started-authentication）
        'authentication',
        'quickstarts',
        'getting-started-examples',
      ],
    },

    // Guides
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides-authentication',
        'guides-rate-limits',
        'guides-errors',
        'guides-versioning',
        'guides-field-dictionary',
      ],
    },

    // Operations / SLA
    {
      type: 'category',
      label: 'Operations',
      collapsed: false,
      items: [
        // 用新的 ID：ops-sla-status（不要再用 ops/sla-status）
        'ops-sla-status',
      ],
    },

    // API Reference
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        // 三个 API 参考页都换成了连字符 ID
        'api-reference-endpoints',
        'api-reference-errors',
        'api-reference-rate-limits',
      ],
    },

    // 其他独立页面
    'csv-etag',
    'changelog',
    'postman',
    'insomnia',
    'methodology',
  ],
};

export default sidebars;