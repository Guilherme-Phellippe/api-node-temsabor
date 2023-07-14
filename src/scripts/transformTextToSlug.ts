import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const DEFAULT_ACCENTS = [
    { accent: 'á', change: "a" },
    { accent: 'à', change: "a" },
    { accent: 'â', change: "a" },
    { accent: 'ã', change: "a" },
    { accent: 'é', change: "e" },
    { accent: 'è', change: "e" },
    { accent: 'ê', change: "e" },
    { accent: 'ẽ', change: "e" },
    { accent: 'í', change: "i" },
    { accent: 'ì', change: "i" },
    { accent: 'î', change: "i" },
    { accent: 'ĩ', change: "i" },
    { accent: 'ó', change: "o" },
    { accent: 'ò', change: "o" },
    { accent: 'ô', change: "o" },
    { accent: 'õ', change: "o" },
    { accent: 'ú', change: "u" },
    { accent: 'ù', change: "u" },
    { accent: 'ũ', change: "u" },
    { accent: 'û', change: "u" },
    { accent: 'ç', change: "c" }
]

export async function  transformTextToSlug(text: string) {
    return new Promise(async (resolve, reject) => {
        if (!text) reject("Its missing text to transform slug!")

        const lowerCaseText = text.toLowerCase();

        const textNoAccent = lowerCaseText.split("").map(letter => {
            const hasAccent = DEFAULT_ACCENTS.find(accents => accents.accent === letter);
            return hasAccent ? letter.replace(hasAccent.accent, hasAccent.change) : letter
        }).join("")

        const formatText = textNoAccent.replaceAll(" ", "-")

        const existSlug = await prisma.recipe.findMany({
            where: {
                slug: {
                    contains: formatText
                }
            },
            select: {
                slug: true,
            }
        });

        var newSlug = formatText
        if (existSlug.length) newSlug += existSlug.length


        resolve(newSlug)
    })
}
