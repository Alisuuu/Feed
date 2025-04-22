import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const [omelete, adorocinema, rapadura, cineclick, papelpop] = await Promise.all([
      buscarOmelete(),
      buscarAdoroCinema(),
      buscarRapadura(),
      buscarCineClick(),
      buscarPapelPop()
    ]);

    const noticias = [...omelete, ...adorocinema, ...rapadura, ...cineclick, ...papelpop];

    res.status(200).json({
      status: 'ok',
      count: noticias.length,
      noticias
    });
  } catch (err) {
    console.error('Erro no scraping:', err);
    res.status(500).json({ status: 'error', message: 'Erro ao buscar notícias' });
  }
}

// ==== Scraping de cada site ====

async function buscarOmelete() {
  const html = await fetch('https://www.omelete.com.br').then(res => res.text());
  const $ = cheerio.load(html);
  const noticias = [];

  $('.featured__content article, .card-default__content').each((_, el) => {
    const title = $(el).find('h2, h3').text().trim();
    const link = 'https://www.omelete.com.br' + $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');
    const sinopse = $(el).find('p').text().trim();
    if (title && link && image) {
      noticias.push({ fonte: 'Omelete', title, link, image, sinopse });
    }
  });

  return noticias;
}

async function buscarAdoroCinema() {
  const html = await fetch('https://www.adorocinema.com/noticias/filmes/').then(res => res.text());
  const $ = cheerio.load(html);
  const noticias = [];

  $('.news-card').each((_, el) => {
    const title = $(el).find('.meta-title-link').text().trim();
    const link = 'https://www.adorocinema.com' + $(el).find('a.meta-title-link').attr('href');
    const image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
    const sinopse = $(el).find('.content-txt').text().trim();
    if (title && link && image) {
      noticias.push({ fonte: 'AdoroCinema', title, link, image, sinopse });
    }
  });

  return noticias;
}

async function buscarRapadura() {
  const html = await fetch('https://cinemacomrapadura.com.br/').then(res => res.text());
  const $ = cheerio.load(html);
  const noticias = [];

  $('.td-big-grid-post').each((_, el) => {
    const title = $(el).find('.entry-title a').text().trim();
    const link = $(el).find('.entry-title a').attr('href');
    const image = $(el).find('img').attr('data-img-url') || $(el).find('img').attr('src');
    const sinopse = $(el).find('.td-excerpt').text().trim();
    if (title && link && image) {
      noticias.push({ fonte: 'Rapadura', title, link, image, sinopse });
    }
  });

  return noticias;
}

async function buscarCineClick() {
  const html = await fetch('https://www.cineclick.com.br/noticias').then(res => res.text());
  const $ = cheerio.load(html);
  const noticias = [];

  $('.box-list .box-movie').each((_, el) => {
    const title = $(el).find('h2').text().trim();
    const link = 'https://www.cineclick.com.br' + $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');
    const sinopse = $(el).find('p').text().trim();
    if (title && link && image) {
      noticias.push({ fonte: 'CineClick', title, link, image, sinopse });
    }
  });

  return noticias;
}

async function buscarPapelPop() {
  const html = await fetch('https://www.papelpop.com/categoria/cinema/').then(res => res.text());
  const $ = cheerio.load(html);
  const noticias = [];

  $('.td-block-span6').each((_, el) => {
    const title = $(el).find('h3.entry-title a').text().trim();
    const link = $(el).find('h3.entry-title a').attr('href');
    const image = $(el).find('img').attr('data-img-url') || $(el).find('img').attr('src');
    const sinopse = $(el).find('.td-excerpt').text().trim();
    if (title && link && image) {
      noticias.push({ fonte: 'PapelPOP', title, link, image, sinopse });
    }
  });

  return noticias;
}
