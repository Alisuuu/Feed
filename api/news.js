import fetch from 'node-fetch';

export default async function handler(request, response) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  const query = `"cinema" OR "filmes" OR "séries" OR "estreia de filme" OR "nova série" OR "crítica de filme" OR "crítica de série" OR "trailer de filme" OR "trailer de série" OR "indústria cinematográfica"`;
  const language = 'pt';
  const sortBy = 'publishedAt';

  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=${sortBy}&apiKey=${apiKey}`;

  try {
    const apiResponse = await fetch(newsUrl);
    const data = await apiResponse.json();

    if (data.status === 'ok') {
      const unwanted = [
        'economia', 'futebol', 'esporte', 'finanças', 'negócios', 'política',
        'mercado', 'ações', 'tecnologia', 'inteligência artificial', 'ia',
        'monitor', 'celular', 'notebook', 'smartphone', 'dispositivo', 'hardware',
        'música', 'cantor', 'banda', 'álbum', 'lançamento musical',
        'curitiba', 'cidade', 'turismo', 'viagem', 'gastronomia', 'evento local'
      ];

      const filteredArticles = data.articles.filter(article => {
        const text = `${article.title} ${article.description || ''}`.toLowerCase();
        return !unwanted.some(term => text.includes(term));
      });

      response.status(200).json({ ...data, articles: filteredArticles });
    } else {
      console.error('Erro da NewsAPI:', data.code, data.message);
      response.status(apiResponse.status).json({ error: data.message || 'Erro ao buscar notícias da NewsAPI.' });
    }
  } catch (error) {
    console.error('Erro ao chamar NewsAPI:', error);
    response.status(500).json({ error: 'Erro interno ao buscar notícias.' });
  }
}
