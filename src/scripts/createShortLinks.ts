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

// async function createShortLink(key: string, id: string) {

//     if(!key || !id) throw new Error("Its missing key or id!")

//     const lowerCaseKey = key.toLowerCase();

//     const keyNoAccent = lowerCaseKey.split("").map(letter => {
//         const hasAccent = DEFAULT_ACCENTS.find(accents => accents.accent === letter);
//         return hasAccent ? letter.replace(hasAccent.accent, hasAccent.change) : letter
//     }).join("")

//     const formatKey = keyNoAccent.replaceAll(" ", "-")

//     const keysDataBase = await prisma.link_shortener.findMany({
//         select: {
//             key: true,
//         }
//     });

//     var result = formatKey;
//     var tryCount = 0
//     for (let index = 0; index < keysDataBase.length; index++) {
//         if(keysDataBase[index].key === result){
//             result = formatKey+tryCount
//             index = 0
//             tryCount++
//         }
//     }


//     const link_shortener = await prisma.link_shortener.create({
//         data: {
//             recipeId: id,
//             key: result,
//             short_link: "https://ver-receita.cloud/" + result,
//             origin_link: "https://temsabor.blog/" + result + "/" + id
//         }
//     })

//     return link_shortener
// }


// export default createShortLink

