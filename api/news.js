import { getNews } from 'gollum';

export default async function handler(req, res) {
  try {
    // Chama a função de scraping para obter as notícias de cinema
    const noticias = await getNews(); 

    // Retorna as notícias no formato esperado
    res.status(200).json({
      noticias: noticias.map(article => ({
        title: article.title,
        link: article.link,
        image: article.image || '',  // Se não houver imagem, retorna uma string vazia
        sinopse: article.synopsis || 'Sem descrição disponível.',
      }))
    });
  } catch (error) {
    console.error('Erro ao obter notícias:', error);
    res.status(500).json({ error: 'Erro ao obter notícias.' });
  }
}
