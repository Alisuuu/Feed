import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  try {
    // Realiza a requisição para a NewsAPI com foco em cinema
    const url = new URL('https://newsapi.org/v2/everything');
    const params = {
      q: 'cinema OR filme OR série', // Filtrando notícias relacionadas a cinema, filmes e séries
      sortBy: 'publishedAt',         // Ordena pelas notícias mais recentes
      language: 'pt',                // Filtra para notícias em português
      apiKey: apiKey
    };
    
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'ok' && data.articles) {
      // Formata os dados antes de enviar ao frontend
      const articles = data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage || '',  // Caso não tenha imagem, retorna uma string vazia
        source: article.source.name,
        publishedAt: new Date(article.publishedAt).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }),
      }));

      res.status(200).json({
        status: 'ok',
        articles
      });
    } else {
      res.status(200).json({ 
        status: 'ok',
        articles: [],
        message: 'Nenhuma notícia encontrada.' 
      });
    }

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao carregar as notícias. Tente novamente mais tarde.' });
  }
}
