import { PrismaClient } from "@prisma/client"

import { Router } from "express"
import createShortLink from "../../scripts/createShortLinks";

const app = Router();
const prisma = new PrismaClient();


/**
 * ROUTE TO CREATE A SHORT LINK
 */
app.post("/create-short-link", async (req, res) => {
    //need to send origin_link which will be shortened url 
    const { name_recipe, id } = req.body

    const response = await createShortLink(name_recipe, id)

    res.status(200).json(response);
})

export default app;