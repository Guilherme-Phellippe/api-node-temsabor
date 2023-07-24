import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import xmlbuilder from "xmlbuilder";

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


export default app