import fetch from 'node-fetch';

export default async function handler(request, response) {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
    }

    try {
        const apiUrl = new URL('https://newsapi.org/v2/everything');
        const params = {
            // Tornando a busca mais específica para cinema/séries
            q: '"cinema" OR "filme" OR "filmes" OR "estreias cinema" OR "crítica filme" OR "notícias cinema" OR "bilheteria cinema" OR "box office" OR "marvel" OR "dc comics" OR "netflix" OR "disney plus" OR "prime video" OR "hbo max"',
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
            // Termos que queremos excluir
            const termsToExclude = [
                'futebol', 'novela', 'atriz', 'bbb', 'games', 'tecnologia', 'smartphone', 'celular', 
                'globo', 'musica', 'eua', 'papa', 'tv', 'bet', 'windows', 'one ui', 'gamer', 'comidas', 
                'youtube', 'motorola', 'android', 'nba', 'geopolitica', 'teatro', 'brinquedos', 'gta', 
                'time', 'times', 'documentário', 'transtorno', 'eleições', 'remedio', 'cidade', 'dorama', 
                'doramas', 'partido', 'jejum', 'serviços', 'brf', 'Petrobrás', 'masters', 'pc', 'ps5', 'xbox',
                'aviões', 'avião', 'jogadores', 'anvisa', 'moda', 'galaxy', 'veículos', 'veículo'
            ];

            // Termos que queremos que APAREÇAM obrigatoriamente no título ou descrição
            const requiredTerms = ['cinema', 'filme', 'filmes', 'série', 'séries', 'marvel', 'dc', 'netflix', 'prime video', 'disney plus', 'hbo', 'hbo max'];

            const filteredArticles = apiData.articles.filter(article => {
                const lowerCaseTitle = article.title ? article.title.toLowerCase() : '';
                const lowerCaseDescription = article.description ? article.description.toLowerCase() : '';
                const sourceName = article.source?.name?.toLowerCase() || '';

                // Primeiro: excluir se contiver termos proibidos no título, descrição ou fonte
                const containsExcludedTerm = termsToExclude.some(term => 
                    lowerCaseTitle.includes(term) ||
                    lowerCaseDescription.includes(term) ||
                    sourceName.includes(term)
                );
                if (containsExcludedTerm) return false;

                // Segundo: garantir que o título ou descrição tenha algum termo obrigatório
                const containsRequiredTerm = requiredTerms.some(term => 
                    lowerCaseTitle.includes(term) || 
                    lowerCaseDescription.includes(term)
                );
                return containsRequiredTerm;
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
