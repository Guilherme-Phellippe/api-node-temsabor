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

app.get("/recipes-news", async (req, res) => {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    
    const recipes = await prisma.recipe.findMany({
        where:{
            createdAt:{
                gte: date,
            }
        },
        select: {
            slug: true,
            name_recipe: true,
            ing: true,
            images_recipe: true,
            word_key: true,
            user: {
                select: {
                    name: true,
                }
            },
            category: {
                select: {
                    name_category: true,
                }
            },
            comments: {
                select: {
                    comment: true
                }
            },
            createdAt: true
        }
    });


    const root = xmlbuilder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    root.attribute('xmlns:content', 'https://purl.org/rss/1.0/modules/content/');
    root.attribute('xmlns:wfw', 'https://wellformedweb.org/CommentAPI/');
    root.attribute('xmlns:dc', 'https://purl.org/dc/elements/1.1/');
    root.attribute('xmlns:atom', 'https://www.w3.org/2005/Atom');
    root.attribute('xmlns:sy', 'https://purl.org/rss/1.0/modules/syndication/');
    root.attribute('xmlns:slash', 'https://web.resource.org/rss/1.0/modules/slash/');
    root.attribute('version', '2.0');

    const channel = root.ele('channel');
    channel.ele('title', 'Tem sabor | Receitas oficiais');
    channel.ele('atom:link', { href: 'https://api.temsabor.blog/recipes-news.xml', rel: 'self', type: 'application/rss+xml' });
    channel.ele('link');
    channel.ele('description', 'Aqui no blog da Tem Sabor, você irá descobrir uma variedade de receitas deliciosas e também compartilhar as suas receitas, nosso blog é uma rede social, onde todos tem espaço para interagir com suas receitas.');
    channel.ele('lastBuildDate', 'Thu, 25 Jul 2023 10:08:05 +0000');
    channel.ele('language', 'pt-BR');
    channel.ele('sy:updatePeriod', 'hourly');
    channel.ele('sy:updateFrequency', '1');

    const image = channel.ele('image');
    image.ele('url', 'https://i.ibb.co/G5ZcQTs/Design-sem-nome-Photo-Room-png-Photo-Room.png');
    image.ele('title', 'Tem sabor receitas oficiais');
    image.ele('link');
    image.ele('width', '32');
    image.ele('height', '32');

    interface typeImages{
        images_recipe: {
            big: string,
            byteLengthBig: string,
        }[];
    }

    recipes.forEach(recipe => {
        const countComment = recipe.comments.length
        const rssRecipe = channel.ele('item');
        let images: typeImages = { images_recipe: [] }
        if(recipe.images_recipe[0] !== null && typeof recipe.images_recipe[0] === 'object' && 'big' in recipe.images_recipe[0]){
            images.images_recipe.push(recipe.images_recipe[0] as { big: string, byteLengthBig: string,})
        }
        rssRecipe.ele('title', recipe.name_recipe);
        rssRecipe.ele('link', `https://temsabor.blog/receitas/${recipe.slug}`);
        rssRecipe.ele('dc:creator', recipe.user.name);
        rssRecipe.ele('pubDate', moment(recipe.createdAt).toISOString());
        rssRecipe.ele('category', recipe.category.name_category);
        rssRecipe.ele('guid', { isPermaLink: 'false' }, recipe.slug);
        rssRecipe.ele('description', { 'content:encoded': "Você precisa conhecer essa receita! criamos com ingredientes selecionados e medidos para um sabor irresistível." });
        rssRecipe.ele('content:encoded', `<h2>INGREDIENTES:</h2><br><br><ul>${recipe.ing.map(r => `<li>${r}</li>`)}</ul><br><br><p>Acesse nossa rede social para ver a receita completa</p>`);
        rssRecipe.ele('slash:comments', countComment);
        rssRecipe.ele('enclosure', { 
            url: images.images_recipe[0].big,
            type: 'image/webp',
            length: images.images_recipe[0]?.byteLengthBig || "102232"
        });
    })

    const rssFeed = root.end({ pretty: true });
    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.send(rssFeed);
})


app.get("/tips-news.xml", async (req, res) => {
    const tips = await prisma.tip.findMany({
        select: {
            id: true,
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
        const publicationElement = newsData.ele('news:publication')
        publicationElement.ele('news:name', 'Tem sabor receitas');
        publicationElement.ele('news:language', "pt-br");
        newsData.ele('news:publication_date', moment(tip.createdAt).toISOString());
        newsData.ele('news:title').dat(tip.name_tip);
        newsData.ele('news:keywords').dat(`Notícia, Receitas, Google News, ${!!tip.word_key.length && tip.word_key[0]}`);
    })

    const xml = urlset.end({ pretty: true });

    // Envie o sitemap.xml como resposta
    res.set('Content-Type', 'application/xml');
    res.send(xml);
})


export default app