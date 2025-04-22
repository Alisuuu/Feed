import fetch from 'node-fetch';

export default async function handler(request, response) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  // Refinar busca para focar só em cinema/séries e excluir temas indesejados
  const query = `("cinema" OR "filmes" OR "séries" OR "crítica de filme" OR "estreia de filme" OR "trailer de filme" OR "trailer de série")
  -futebol -esporte -política -economia -mercado -finanças -negócios -ações`;

  const language = 'pt';
  const sortBy = 'publishedAt';

  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=${sortBy}&apiKey=${apiKey}`;

  try {
    const apiResponse = await fetch(newsUrl);
    const data = await apiResponse.json();

    if (data.status === 'ok') {
      response.status(200).json(data);
    } else {
      console.error('Erro da NewsAPI:', data.code, data.message);
      response.status(apiResponse.status).json({ error: data.message || 'Erro ao buscar notícias da NewsAPI.' });
    }

  } catch (error) {
    console.error('Erro ao chamar NewsAPI:', error);
    response.status(500).json({ error: 'Erro interno ao buscar notícias.' });
  }
}
