import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        country: 'br',
        category: 'entertainment' // Aqui você pode ajustar a categoria
      }
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao carregar as notícias.' });
  }
}
