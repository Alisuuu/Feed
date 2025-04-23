import fetch from 'node-fetch';

export default async function handler(request, response) {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
    }

    try {
        // 1. Configurar URL para busca de notícias sobre filmes e séries
        const apiUrl = new URL('https://newsapi.org/v2/everything');
        const params = {
            q: 'cinema OR filme OR série OR hollywood OR crítica',  // Usando palavras-chave para cinema, filmes e séries
            language: 'pt',
            sortBy: 'publishedAt', // <--- ADICIONADO: Ordena por data de publicação (mais recente primeiro)
            apiKey: apiKey
        };
        Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

        const apiResponse = await fetch(apiUrl.toString());
        const apiData = await apiResponse.json();

        // Verificar o status da resposta da API
        if (apiData.status === 'ok') {
            if (apiData.articles && apiData.articles.length > 0) {
                response.status(200).json({
                    status: 'ok',
                    count: apiData.articles.length,
                    articles: apiData.articles
                });
            } else {
                 // API retornou sucesso, mas sem artigos correspondentes encontrados para os critérios e ordenação
                 response.status(200).json({
                    status: 'ok',
                    count: 0,
                    articles: [],
                    message: 'Nenhum artigo encontrado para os critérios de busca recentes.' // Mensagem opcional
                 });
            }
        } else {
             // API retornou um status de erro (e.g., apiKey inválida, limite excedido)
             console.error('Erro da API:', apiData.code, apiData.message);
             // Geralmente a API retorna HTTP 200 mesmo com status='error',
             // então podemos usar 400 para indicar um problema na requisição à API.
             response.status(400).json({
                status: 'error',
                code: apiData.code,
                message: apiData.message || 'Erro desconhecido retornado pela API de notícias.'
             });
        }


    } catch (error) {
        console.error('Erro geral ao buscar notícias:', error);
        response.status(500).json({ status: 'error', message: 'Erro interno do servidor ao processar a requisição.' });
    }
}
