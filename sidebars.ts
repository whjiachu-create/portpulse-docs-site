import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quickstarts',
        'getting-started/examples', 
        'getting-started/authentication',
      ],
    },
    'authentication',
    'rate-limits',
    'csv-etag',
    'errors',
    'methodology',
    'endpoints',
    'examples',
    {
      type: 'category',
      label: 'API Clients',
      items: [
        'postman',
        'insomnia',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/authentication',
        'guides/rate-limits',
        'guides/errors',
        'guides/field-dictionary',
        'guides/versioning',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'ops/sla-status',
      ],
    },
    'changelog',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/endpoints',
        'api-reference/errors',
        'api-reference/rate-limits',
      ],
    },
  ],
};

export default sidebars;
