import { PrismaClient } from "@prisma/client";

import { Router } from "express";

const app = Router(); 
const prisma = new PrismaClient();

//PRIZES
app.get('/prizes', async (req: any, res: any) => {
    const prizes = await prisma.prize.findMany();
    res.status(200).json(prizes)
});

app.post('/prizes', async (req: any, res: any) => {
    const body = req.body
    const prize = await prisma.prize.create({
        data:{
            image: body.image,
            name: body.name,
            price: body.price,
            available: body.available
        }
    })
    res.status(200).json(prize)
});

app.put('/prizes/:id', (req: any, res: any) => {
    res.status(200).json([])
});

app.delete('/prizes/:id', (req: any, res: any) => {
    res.status(200).json([])
});


export default app