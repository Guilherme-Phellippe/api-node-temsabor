import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const app = Router(); 
const prisma = new PrismaClient();

//CATEGORIES
app.get('/categories', async (req: any, res: any) => {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name_category: true,
            suggestion: true,
            recipe: true,
            createdAt: true
        }
    });


    res.status(200).json(categories.map(cat => {
        return {
            ...cat,
            recipe: Object.keys(cat.recipe).length
        }
    }))
});

app.post('/category', async (req: any, res: any) => {
    const { name_category } = req.body
    
    const existCategory = await prisma.category.findFirst({
        where: {
            name_category
        }
    })

    if(existCategory && existCategory.name_category.includes(name_category)){
        const update = await prisma.category.update({
            where: {
                id: existCategory.id
            }, 
            data:{
                suggestion: {
                    increment: 1
                }
            }
        })

        res.status(200).json({id: update.id , msg: "update with success", suggest: update.suggestion})
    }else{
        const created = await prisma.category.create({
            data: {
                name_category: name_category,
            }
        })
        res.status(201).json({ id: created.id , msg: "create with success"})
    }

});

app.put('/categories/:id', (req: any, res: any) => {
    res.status(200).json([])
});

app.delete('/categories/:id', (req: any, res: any) => {
    res.status(200).json([])
});


export default app