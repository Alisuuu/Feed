import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

export default function Home() {
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/news')
      .then(res => {
        setNews(res.data.articles);
      })
      .catch(err => console.error('Erro ao carregar as notícias:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', height: '100vh', overflow: 'hidden' }}>
      <h1 style={{ color: '#593BA2', textAlign: 'center' }}>Últimas Notícias</h1>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {news.map((n, i) => (
          <div
            key={i}
            onClick={() => setSelected(n)}
            style={{
              backgroundColor: 'rgb(12, 12, 12, 0.2)',
              padding: '1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0 0 10px rgba(255, 0, 255, 0.1)',
            }}
          >
            <h3>{n.title}</h3>
            <p style={{ color: '#aaa' }}>{n.source.name}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selected}
        article={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
