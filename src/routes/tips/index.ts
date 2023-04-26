import { PrismaClient } from "@prisma/client";

import { Router } from "express";

const app = Router();
const prisma = new PrismaClient();


app.get('/tips', async (req: any, res: any) => {

    const tips = await prisma.tip.findMany({
        select: {
            id: true,
            name_tip: true,
            description_tip:true,
            word_key: true,
            nmr_hearts: true,
            nmr_eyes: true,
            nmr_saved: true,
            votes: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    photo: true,
                    nmr_eyes: true,
                    nmr_hearts: true,
                }
            },
            comments: {
                select: {
                    id: true,
                    comment: true,
                    answer: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            photo: true,
                        }
                    }
                }
            }
        },
    });

    res.status(200).json(tips);
});

app.get('/tip/:id', async (req: any, res: any) => {
    const id = req.params.id

    const tip = await prisma.tip.findUniqueOrThrow(
        {
            where: { id },
            select: {
                id: true,
                name_tip:true,
                description_tip:true,
                word_key: true,
                nmr_hearts: true,
                nmr_eyes: true,
                nmr_saved: true,
                votes: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        nmr_eyes: true,
                        nmr_hearts: true,
                        admin: true,
                        _count: {
                            select: {
                                recipe: true
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        comment: true,
                        answer: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                photo: true
                            }
                        }
                    }
                }

            }
        }
    )

    const recipes = await prisma.recipe.findMany({
        where: {
            userId: tip.user.id
        }
    });

    const tips = await prisma.tip.findMany({
        where: {
            userId: tip.user.id
        }
    })

    const data = [...recipes, ...tips]

    tip.user.nmr_eyes = data.reduce((total, item) => total + (item.nmr_eyes || 0), 0);
    tip.user.nmr_hearts = data.reduce((total, recipe) => total + (recipe.nmr_hearts.length || 0), 0)

    res.status(200).json(tip)
});

app.post('/tip', async (req: any, res: any) => {
    const tipInfo = req.body

    const tip = await prisma.tip.create({
        data: {
            userId: tipInfo.userId,
            name_tip: tipInfo.name_tip,
            description_tip: tipInfo.description_tip,
            word_key: tipInfo.word_key,
        }
    })

    res.status(201).json(tip);
});

app.put('/tip/:id', async (req: any, res: any) => {
    const { id } = req.params
    const { name_tip, description_tip} = req.body;

    const updated = await prisma.tip.update({
        where: {
            id
        }, data: {
            name_tip,
            description_tip
        }
    })


    res.status(200).json(updated)
});

//VERIFY IF USER ALREADY VOTED 
app.get('/recipe/:id/already-voted', async (req: any, res: any) => {

    const { id } = req.params

    const hasVote = await prisma.recipe.findFirst({
        where: {
            votes: {
                has: id
            }
        },

    })

    if (hasVote) res.status(200).send(true)
    else res.status(200).send(false)
});


app.delete('/tip/:id', async (req: any, res: any) => {
    const { id } = req.params

    try {
        const deleted = await prisma.tip.delete({
            where: {
                id
            }
        })
        if (deleted) res.status(200).json({ message: "Recipe deleted with success" })

    } catch {
        Promise.all([
            prisma.comment.deleteMany({
                where: {
                    recipeId: id
                }
            }),
            prisma.tip.delete({
                where: {
                    id
                }
            })

        ]).catch(error => res.status(500).json({ error }))
        res.status(200).json({ message: "Recipe deleted with success" })
    }
});


export default app;