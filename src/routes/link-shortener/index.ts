import { PrismaClient } from "@prisma/client"

import { Router } from "express"

const app = Router();
const prisma = new PrismaClient();


/**
 * ROUTE TO CREATE A SHORT LINK
 */
app.post("/create-short-link", async (req, res) => {
    //need to send origin_link which will be shortened url 
    const { origin_link } = req.body
    //this line will thrown an Error if the url: https://temsabor.blog/ 
    // was not sent or the https was not sent either
    if (!origin_link.includes("https://temsabor.blog/")) throw new Error("format link incorrect, the link need has 'https://' and no 'www'")
    // if url was sent correctly, we remove the url: https://temsabor.blog/ 
    // if the url to be sent with the 'recipe' or 'tip' parameter, we also remove it
    const key: string = origin_link.replace("https://temsabor.blog/", "").replace("recipe/", "").replace("tip/", "")
    //remove text accent
    const defaultAccent = [
        { regex: /[\u00E0-\u00E5]/g, substituto: 'a' },
        { regex: /[\u00E8-\u00EB]/g, substituto: 'e' },
        { regex: /[\u00EC-\u00EF]/g, substituto: 'i' },
        { regex: /[\u00F2-\u00F6]/g, substituto: 'o' },
        { regex: /[\u00F9-\u00FC]/g, substituto: 'u' },
        { regex: /[\u00E7]/g, substituto: 'c' },
        { regex: "ç", substituto: 'c' },
    ]
    var newKey: string = key;
    for (let n = 0; n < defaultAccent.length; n++) {
        newKey = key.replace(defaultAccent[n].regex, defaultAccent[n].substituto)
    }
    // in this line we only get key name, we know that it can have a '/' after the name, 
    // so we create the variable 'getOnlyKey', if it has a '/' ,
    // we only get the key name before the '/'
    const getOnlyKey = newKey.indexOf("/") >= 0 ? newKey.indexOf("/") : newKey.length
    var formatKey = newKey.substring(0, getOnlyKey).replace(/%20/g, "-").replace(/\s/g, "-");
    //on the next two lines we declare two variables, a count to count how many times 
    //we try to create a unique key and isFounded variable to know when we find a unique key
    console.log(formatKey)
    var count = 0;
    var isFounded: boolean = false;
    //this is a 'while' loop that will only stop when we find the unique key
    while (!isFounded) {
        //this line we look for the key in the database
        const existLink = await prisma.link_shortener.findUnique({
            where: {
                key: formatKey
            }
        })
        //if we find the key name this condition will be true and we assign the true in variable isFounded
        if (!existLink) isFounded = true
        else {
            //case we not find the key name, we create a new key name
            if (count < formatKey.length) {
                //in this first condition, we transform the key name string into toUpperCase,
                //first we try to transform the first letter, if it also exist in the database, 
                //we try transform the second letter and so on until the end of the last letter
                var formatKey = count === 0 ?
                    formatKey.charAt(count).toUpperCase() + formatKey.substring((count + 1), formatKey.length)
                    :
                    formatKey.substring(0, count) + formatKey.charAt(count).toUpperCase() + formatKey.substring((count + 1), formatKey.length)
            } else if (count === formatKey.length) {
                //case no letter isnt available, we transform to whole string to UpperCase
                var formatKey = formatKey.toUpperCase();
            } else {
                //if the uppercase key name isnt available, we add the count number to the after last letter of key name
                //in this line we check if there is already a number in the key name
                var hasNumber = /\d/.test(formatKey)
                //if there is already a number, we remove the last letter that will be a number and
                // we replace with the next number of 'count'
                var formatKey = hasNumber ?
                    formatKey.substring(0, (formatKey.length - 1)) + (count - newKey.substring(0, getOnlyKey).length)
                    :
                    formatKey + (count - newKey.substring(0, getOnlyKey).length)
            }
            //this line we add one more number
            count++
        }
    }
    //now we know that key is unique and we create a new short link in database
    const response = await prisma.link_shortener.create({
        data: {
            key: formatKey,
            short_link: "https://ver-receita.cloud/" + formatKey,
            origin_link
        }
    });

    res.status(200).json(response);
})

export default app;