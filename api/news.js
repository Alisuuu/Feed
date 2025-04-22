import fetch from 'node-fetch'; // Importe node-fetch se estiver testando localmente ou usando versões antigas do Node.js
                               // No Vercel Edge Functions e Node.js 18+, fetch é nativo.

export default async function handler(request, response) {
  const apiKey = process.env.NEWS_API_KEY; // Sua chave de API será lida de uma variável de ambiente

  if (!apiKey) {
    return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  // Parâmetros da API NewsAPI para notícias de cinema em português do Brasil
  const query = 'cinema OR filmes OR séries OR streaming'; // Termos de busca
  const language = 'pt'; // Idioma
  const country = 'br'; // País (opcional, pode remover se quiser notícias globais)
  const sortBy = 'publishedAt'; // Ordenar por data de publicação

  const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=${sortBy}&apiKey=${apiKey}`;
  // Se quiser focar em notícias do Brasil, pode usar o endpoint 'top-headlines' com country=br e category=entertainment, mas 'everything' com busca por termos costuma ser mais abrangente para "cinema"

  try {
    const apiResponse = await fetch(newsUrl);
    const data = await apiResponse.json();

    if (data.status === 'ok') {
      response.status(200).json(data);
    } else {
      // Trata erros da NewsAPI
      response.status(apiResponse.status).json({ error: data.message || 'Erro ao buscar notícias da NewsAPI.' });
    }

  } catch (error) {
    console.error('Erro ao chamar NewsAPI:', error);
    response.status(500).json({ error: 'Erro interno ao buscar notícias.' });
  }
}
