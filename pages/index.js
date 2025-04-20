import { useEffect, useState } from 'react';

export default function Home() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(setNoticias);
  }, []);

  return (
    <div style={{ background: '#000', color: '#fff', padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ color: 'violet' }}>Notícias de Filmes e Séries</h1>
      {noticias.map((n, i) => (
        <div key={i} style={{ marginBottom: '2rem' }}>
          <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            <h2>{n.title}</h2>
            {n.urlToImage && <img src={n.urlToImage} style={{ width: '100%', borderRadius: '8px' }} />}
            <p>{n.description}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
