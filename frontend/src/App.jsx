import { useState, useEffect } from 'react';
import api from './api/httpClient';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    api.get('/ping')
      .then((res) => setMessage(res.data.message))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (

    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '4rem' }}>
      <h1>🚀 Fullstack App</h1>
      <p style={{ color: '#888' }}>React + Vite → Laravel API</p>
      <div style={{ marginTop: '2rem' }}>
        {loading && <p>Loading…</p>}
        {error   && <p style={{ color: 'red' }}>Error: {error}</p>}
        {message && (
          <div style={{
            display: 'inline-block', padding: '1rem 2rem',
            background: '#f0fdf4', border: '1px solid #86efac',
            borderRadius: '8px', color: '#166534',
          }}>
            ✓ {message}
          </div>
        )}
      </div>

    <script> console.log("API URL =", import.meta.env.VITE_API_URL); </script>
    </div>
  );
}

export default App;
