module.exports = {
  // ...existing config...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/docs',
          // 确保 slug 唯一
          editUrl: 'https://github.com/your-repo/edit/main/website/',
        },
        // ...existing config...
      },
    ],
  ],
};
