import axios from 'axios';

export default async function handler(req, res) {
  const url = `https://newsapi.org/v2/everything?q=filmes%20OR%20séries&language=pt&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
}
