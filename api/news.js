import fetch from 'node-fetch';

export default async function handler(request, response) {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
    }

    try {
        // Configura a URL para buscar notícias recentes sobre cinema, filmes e séries
        const apiUrl = new URL('https://newsapi.org/v2/everything');
        const params = {
            q: 'cinema OR filme OR série OR hollywood OR crítica',
            language: 'pt',
            sortBy: 'publishedAt', // Garante que as notícias venham ordenadas por data
            pageSize: 30, // Define o número de notícias a retornar (opcional)
            apiKey: apiKey
        };
        Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

        const apiResponse = await fetch(apiUrl.toString());
        const apiData = await apiResponse.json();

        if (apiData.status === 'ok' && apiData.articles && apiData.articles.length > 0) {
            response.setHeader('Cache-Control', 'no-store'); // Evita cache
            response.status(200).json({
                status: 'ok',
                count: apiData.articles.length,
                articles: apiData.articles
            });
        } else {
            response.status(200).json({
                status: 'ok',
                count: 0,
                articles: []
            });
        }

    } catch (error) {
        console.error('Erro:', error);
        response.status(500).json({ error: 'Erro ao buscar notícias' });
    }
}
