import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import xmlbuilder from "xmlbuilder";
import moment from "moment";

const app = Router();
const prisma = new PrismaClient();


app.get("/sitemap-recipes.xml", async (req, res) => {
    const recipes = await prisma.recipe.findMany({
        select: {
            slug: true,
            createdAt: true
        }
    });

    !recipes && res.status(500).json({ Error: "not founded recipes" })

    const urlset = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');


    recipes.forEach(recipe => {
        const url = urlset.ele("url");
        url.ele('loc', `https://temsabor.blog/receitas/${recipe.slug}`);
        url.ele('changefreq', 'monthly'); // Frequência de mudança da URL (semanal neste exemplo)
        url.ele('priority', '1.0');
    })

    const xml = urlset.end({ pretty: true });

    // Envie o sitemap.xml como resposta
    res.set('Content-Type', 'application/xml');
    res.send(xml);
})

app.get("/recipes-news.xml", async (req, res) => {
    const recipes = await prisma.recipe.findMany({
        select: {
            slug: true,
            name_recipe: true,
            word_key: true,
            createdAt: true
        }
    });

    const urlset = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    urlset.att('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9');


    recipes.forEach(recipe => {
        const news = urlset.ele('url');
        news.ele('loc', `https://temsabor.blog/receitas/${recipe.slug}`);
        news.ele('lastmod', moment(recipe.createdAt).toISOString());

        const newsData = news.ele('news:news');
        newsData.ele('news:publication_date', moment(recipe.createdAt).toISOString());
        newsData.ele('news:title').dat(recipe.name_recipe);
        newsData.ele('news:keywords').dat(`Notícia, Receitas, Google News, ${!!recipe.word_key.length && recipe.word_key[0]}`);
        const publicationElement = newsData.ele('news:publication')
        publicationElement.ele('news:name', 'Tem sabor receitas');
        publicationElement.ele('news:language', "pt-br");
    })

    const xml = urlset.end({ pretty: true });

    // Envie o sitemap.xml como resposta
    res.set('Content-Type', 'application/xml');
    res.send(xml);
})


app.get("/tips-news.xml", async (req, res) => {
    const tips = await prisma.tip.findMany({
        select: {
            id:true,
            name_tip: true,
            word_key: true,
            createdAt: true
        }
    });

    const urlset = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    urlset.att('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9');


    tips.forEach(tip => {
        const news = urlset.ele('url');
        news.ele('loc', `https://temsabor.blog/tip/${tip.name_tip}/${tip.id}`);
        news.ele('lastmod', moment(tip.createdAt).toISOString());

        const newsData = news.ele('news:news');
        newsData.ele('news:publication_date', moment(tip.createdAt).toISOString());
        newsData.ele('news:title').dat(tip.name_tip);
        newsData.ele('news:keywords').dat(`Notícia, Receitas, Google News, ${!!tip.word_key.length && tip.word_key[0]}`);
        const publicationElement = newsData.ele('news:publication')
        publicationElement.ele('news:name', 'Tem sabor receitas');
        publicationElement.ele('news:language', "pt-br");
    })

    const xml = urlset.end({ pretty: true });

    // Envie o sitemap.xml como resposta
    res.set('Content-Type', 'application/xml');
    res.send(xml);
})


export default app