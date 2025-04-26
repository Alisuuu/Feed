import fetch from 'node-fetch';

export default async function handler(request, response) {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
    }

    try {
        const apiUrl = new URL('https://newsapi.org/v2/everything');
        const params = {
            // Usando o prefixo '-' antes de cada termo a ser excluído
            // Para termos múltiplos ("big brother brasil", por exemplo), use aspas: -"big brother brasil"
            q: 'cinema OR séries OR marvel OR dc OR filme OR netflix OR "disney plus" OR "prime video" OR hbo OR max -futebol -novela -atriz -bbb -games',
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
             // Manter o filtro no código é uma boa prática
            const termsToExclude = ['futebol', 'novela', 'atriz', 'bbb', 'games', 'tecnologia', 'smartphone', 'celular', 'globo', 'musica', 'eua', 'papa', 'tv', 'bet', 'windows', 'one ui', 'gamer', 'comidas', 'youtube', 'motorola', 'android', 'nba', 'geopolitica', 'teatro', 'brinquedos', 'gta', 'time', 'times', 'documentário', 'transtorno', 'eleições', 'remedio', 'cidade', 'dorama', 'doramas', 'partido', 'jejum', 'serviços', 'brf', 'Petrobrás', 'masters', 'pc', 'ps5', 'xbox','aviões', 'avião', 'jogadores', 'anvisa', 'musica', 'musicas', 'moda', 'galaxy', 'músicas', 'músicas', 'veículos', 'veículo'];
         const filteredArticles = apiData.articles.filter(article => {
                const lowerCaseTitle = article.title ? article.title.toLowerCase() : '';
                const lowerCaseDescription = article.description ? article.description.toLowerCase() : '';
                
                // Verifica se algum termo a ser excluído está presente no título ou descrição
                const containsExcludedTerm = termsToExclude.some(term => 
                    lowerCaseTitle.includes(term) || lowerCaseDescription.includes(term)
                );
                
                // Retorna true apenas se o artigo NÃO contiver os termos a serem excluídos
                return !containsExcludedTerm;
            });

            if (filteredArticles.length > 0) {
                response.status(200).json({
                    status: 'ok',
                    count: filteredArticles.length,
                    articles: filteredArticles
                });
            } else {
                response.status(200).json({
                    status: 'ok',
                    count: 0,
                    articles: [],
                    message: 'Nenhum artigo relevante encontrado após a filtragem.'
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
