import { PrismaClient } from "@prisma/client"

import { Router } from "express"

const app = Router();


app.get("/l/", (req, res)=>{
    res.send("foi")
})

export default app;