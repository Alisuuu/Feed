import fetch from 'node-fetch';

export default async function handler(request, response) {
  // Fontes fixas (manuais)
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

  // Retorna apenas as fontes manuais
  return response.status(200).json({
    status: 'ok',
    count: hardcodedSources.length,
    sources: hardcodedSources
  });
}
