import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): React.ReactElement {
  return (
    <Layout>
      <header className="hero hero--ocean hero--tall">
        <div className="container">
          <h1 className="hero__title">PortPulse</h1>
          <p className="hero__subtitle">
            API-first port metrics in JSON/CSV with strong edge caching (ETag/304).
          </p>
          <div className="buttons" style={{ gap: 16, marginTop: 8 }}>
            <Link className="button button--primary" to="/docs/intro">Read the Docs</Link>
            <Link className="button button--outline button--secondary" to="/openapi">API Reference</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 0 64px' }}>
        <div className="row">
          <div className="col col--6">
            <h3>Why PortPulse?</h3>
            <ul>
              <li>JSON or CSV with <code>ETag/304</code>.</li>
              <li>Versioned endpoints &amp; deprecation windows.</li>
              <li>Simple header auth: <code>X-API-Key</code>.</li>
              <li>Edge caching for low latency.</li>
            </ul>
          </div>
          <div className="col col--6">
            <h3>Jump in</h3>
            <ul>
              <li><Link to="/docs/quickstarts">Quickstarts</Link></li>
              <li><Link to="/docs/postman">Postman</Link></li>
              <li><Link to="/docs/insomnia">Insomnia</Link></li>
              <li><Link to="/openapi">OpenAPI</Link></li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}