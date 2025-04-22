import fetch from 'node-fetch';

export default async function handler(request, response) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  // Parâmetros da API NewsAPI para notícias de cinema, filmes e séries em português
  // Usando a Opção 1 para a query mais específica
  const query = '"notícias de cinema" OR "notícias de filmes" OR "notícias de séries" OR "estreia de filme" OR "nova série" OR "crítica de filme" OR "crítica de série" OR "trailer de filme" OR "trailer de série" OR "indústria cinematográfica"';

  const language = 'pt'; // Idioma
  const sortBy = 'publishedAt'; // Ordenar por data de publicação

  // Se quiser focar apenas em notícias do Brasil, descomente a linha abaixo:
  // const country = 'br';
  // const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}${country ? '&country='+country : ''}&sortBy=${sortBy}&apiKey=${apiKey}`;


  // URL sem filtro por país para resultados mais abrangentes sobre cinema/séries
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
