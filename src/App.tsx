import { useMemo, useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('RezaFab');

  const normalizedUsername = username.trim();
  const encodedUsername = encodeURIComponent(normalizedUsername || 'RezaFab');

  const cardUrl = useMemo(() => `/api/card?username=${encodedUsername}`, [encodedUsername]);
  const markdown = `![GitHub Stack Mapping](${window.location.origin}/api/card?username=${encodedUsername})`;

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
