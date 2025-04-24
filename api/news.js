import fetch from 'node-fetch';

export default async function handler(request, response) {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
    }

    try {
        const apiUrl = new URL('https://newsapi.org/v2/everything');
        const params = {
            q: 'cinema OR séries OR marvel OR dc OR filme OR netflix OR "disney plus" OR "prime video"',
            language: 'pt',
            sortBy: 'publishedAt',
            apiKey: apiKey
        };

        Object.keys(params).forEach(key => {
            apiUrl.searchParams.append(key, params[key]);
        });

        const apiResponse = await fetch(apiUrl.toString());
        const apiData = await apiResponse.json();

        if (apiData.status === 'ok') {
            if (apiData.articles && apiData.articles.length > 0) {
                response.status(200).json({
                    status: 'ok',
                    count: apiData.articles.length,
                    articles: apiData.articles
                });
            } else {
                response.status(200).json({
                    status: 'ok',
                    count: 0,
                    articles: [],
                    message: 'Nenhum artigo encontrado para os critérios de busca recentes.'
                });
            }
        } else {
            console.error('Erro da API:', apiData.code, apiData.message);
            response.status(400).json({
                status: 'error',
                code: apiData.code,
                message: apiData.message || 'Erro desconhecido retornado pela API de notícias.'
            });
        }

    } catch (error) {
        console.error('Erro geral ao buscar notícias:', error);
        response.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor ao processar a requisição.'
        });
    }
}
