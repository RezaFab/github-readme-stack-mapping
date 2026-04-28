import { useMemo, useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('RezaFab');
  const [mode, setMode] = useState<'techstack' | 'languages' | 'all'>('techstack');
  const [section, setSection] = useState<'all' | 'frontend' | 'backend' | 'tools' | 'mobile' | 'other'>('all');

  const normalizedUsername = username.trim();
  const effectiveUsername = normalizedUsername || 'RezaFab';

  const apiOrigin = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      return 'http://localhost:3000';
    }

    return window.location.origin;
  }, []);

  const queryString = useMemo(() => {
    const query = new URLSearchParams({
      username: effectiveUsername,
      mode,
      section,
    });

    return query.toString();
  }, [effectiveUsername, mode, section]);

  const cardUrl = useMemo(() => `${apiOrigin}/api/card?${queryString}`, [apiOrigin, queryString]);
  const markdown = `![GitHub Stack Mapping](${apiOrigin}/api/card?${queryString})`;

  return (
    <main className="app">
      <section className="panel">
        <h1>GitHub Stack Mapping</h1>
        <p className="subtitle">Generate an embeddable SVG card from your public repositories.</p>

        <label htmlFor="username">GitHub Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="RezaFab"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label htmlFor="mode">Mode</label>
        <select id="mode" value={mode} onChange={(event) => setMode(event.target.value as 'techstack' | 'languages' | 'all')}>
          <option value="techstack">techstack</option>
          <option value="languages">languages</option>
          <option value="all">all</option>
        </select>

        <label htmlFor="section">Section</label>
        <select
          id="section"
          value={section}
          onChange={(event) =>
            setSection(event.target.value as 'all' | 'frontend' | 'backend' | 'tools' | 'mobile' | 'other')
          }
        >
          <option value="all">all</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="tools">tools</option>
          <option value="mobile">mobile</option>
          <option value="other">other</option>
        </select>

        <h2>Preview</h2>
        <p className="subtitle">Local dev needs `npx vercel dev --listen 3000` so `/api/card` can be served.</p>
        <img className="card-preview" src={cardUrl} alt="GitHub Stack Mapping SVG preview" />

        <h2>Markdown Embed</h2>
        <pre>{markdown}</pre>
      </section>
    </main>
  );
}

export default App;
