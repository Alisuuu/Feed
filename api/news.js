import fetch from 'node-fetch';

export default async function handler(request, response) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'NEWS_API_KEY não configurada.' });
  }

  // Fontes manuais de cinema (caso a API não as retorne)
  const hardcodedSources = [
    {
      id: "omelete",
      name: "Omelete",
      url: "https://omelete.com.br",
      description: "Cinema, séries, cultura pop e games."
    },
    {
      id: "cinema-com-rapadura",
      name: "Cinema com Rapadura",
      url: "https://www.cinemacomrapadura.com.br",
      description: "Críticas e análises de filmes nacionais e internacionais."
    },
    {
      id: "adorocinema",
      name: "AdoroCinema",
      url: "https://www.adorocinema.com",
      description: "Notícias, trailers e críticas de filmes."
    },
    {
      id: "cineclick",
      name: "CineClick",
      url: "https://www.cineclick.com.br",
      description: "Notícias, entrevistas e críticas de cinema."
    },
    {
      id: "papelpop",
      name: "PapelPOP",
      url: "https://www.papelpop.com",
      description: "Cobertura de cinema, séries e celebridades."
    }
  ];

  try {
    // 1. Busca fontes da API NewsAPI
    const apiUrl = new URL('https://newsapi.org/v2/sources');
    const params = {
      country: 'br',
      language: 'pt',
      apiKey: apiKey
    };
    Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

    const apiResponse = await fetch(apiUrl.toString());
    const apiData = await apiResponse.json();

    // 2. Filtra fontes da API com foco em cinema
    const cinemaKeywords = ['cinema', 'filme', 'série', 'crítica', 'hollywood', 'festival'];
    let apiSources = [];
    
    if (apiData.status === 'ok') {
      apiSources = apiData.sources.filter(source => 
        cinemaKeywords.some(keyword => 
          source.name.toLowerCase().includes(keyword) || 
          source.description.toLowerCase().includes(keyword)
        )
      );
    }

    // 3. Combina fontes manuais + API, removendo duplicatas
    const uniqueSources = [...hardcodedSources];
    apiSources.forEach(apiSource => {
      if (!hardcodedSources.some(hardcoded => hardcoded.id === apiSource.id)) {
        uniqueSources.push({
          id: apiSource.id,
          name: apiSource.name,
          url: apiSource.url,
          description: apiSource.description
        });
      }
    });

    // 4. Ordena por relevância (fontes manuais primeiro)
    const sortedSources = uniqueSources.sort((a, b) => 
      hardcodedSources.some(src => src.id === a.id) ? -1 : 1
    );

    response.status(200).json({
      status: 'ok',
      count: sortedSources.length,
      sources: sortedSources
    });

  } catch (error) {
    console.error('Erro:', error);
    // Retorna apenas as fontes manuais em caso de falha
    response.status(200).json({
      status: 'ok',
      count: hardcodedSources.length,
      sources: hardcodedSources,
      warning: 'Falha na API. Retornando fontes padrão.'
    });
  }
}
