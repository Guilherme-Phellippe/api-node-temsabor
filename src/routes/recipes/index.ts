import { PrismaClient } from "@prisma/client";

import { Router } from "express";
import axios from "axios";
import FormData from "form-data";
import multer from 'multer';
import sharp from 'sharp'

const app = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });


app.get('/recipes', async (req: any, res: any) => {

    const recipes = await prisma.recipe.findMany({
        select: {
            id: true,
            images_recipe: true,
            videos_recipe: true,
            name_recipe: true,
            time: true,
            portion: true,
            ing: true,
            stuffing_ing: true,
            word_key: true,
            prepareMode: true,
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
            category: {
                select: {
                    id: true,
                    name_category: true,
                },
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

    res.status(200).json(recipes);
});

app.get('/recipes/:categoryId/category', async (req: any, res: any) => {
    const { categoryId } = req.params
    const recipes = await prisma.recipe.findMany({
        where: {
            categoryId,
        },
        select: {
            id: true,
            images_recipe: true,
            videos_recipe: true,
            name_recipe: true,
            time: true,
            portion: true,
            ing: true,
            stuffing_ing: true,
            word_key: true,
            prepareMode: true,
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
            category: {
                select: {
                    id: true,
                    name_category: true,
                },
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
        },
    });

    res.status(200).json(recipes)
});

app.get('/recipe/:id', async (req: any, res: any) => {
    const id = req.params.id

    const recipe = await prisma.recipe.findUniqueOrThrow(
        {
            where: { id },
            select: {
                id: true,
                images_recipe: true,
                videos_recipe: true,
                name_recipe: true,
                time: true,
                portion: true,
                ing: true,
                stuffing_ing: true,
                word_key: true,
                prepareMode: true,
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
                category: {
                    select: {
                        id: true,
                        name_category: true
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
            userId: recipe.user.id
        }
    });

    const tips = await prisma.tip.findMany({
        where: {
            userId: recipe.user.id
        }
    })

    const data = [...recipes, ...tips]

    recipe.user.nmr_eyes = data.reduce((total, item) => total + (item.nmr_eyes || 0), 0);
    recipe.user.nmr_hearts = data.reduce((total, recipe) => total + (recipe.nmr_hearts.length || 0), 0)

    res.status(200).json(recipe)
});

app.post('/recipe', async (req: any, res: any) => {
    const recipeInfo = req.body

    const recipe = await prisma.recipe.create({
        data: {
            name_recipe: recipeInfo.name_recipe,
            images_recipe: recipeInfo.images_recipe,
            videos_recipe: recipeInfo.videos_recipe || [],
            time: recipeInfo.time,
            portion: recipeInfo.portion,
            ing: recipeInfo.ing,
            stuffing_ing: recipeInfo.stuffing_ing,
            word_key: recipeInfo.word_key,
            prepareMode: recipeInfo.prepareMode,
            userId: recipeInfo.userId,
            categoryId: recipeInfo.categoryId,
        }
    })

    res.status(201).json(recipe);
});

app.put('/recipe/:id', async (req: any, res: any) => {
    const { id } = req.params
    const {
        name_category,
        name_recipe,
        images_recipe,
        ing,
        stuffing_ing,
        prepareMode,
        portion,
        time,
        videos_recipe,
    } = req.body;

    const existCategory = await prisma.category.findFirst({
        where: {
            name_category
        }
    })

    var response;

    if (existCategory && existCategory.name_category.includes(name_category)) {
        response = await prisma.category.update({
            where: {
                id: existCategory.id
            },
            data: {
                suggestion: {
                    increment: 1
                }
            }
        })
    } else {
        response = await prisma.category.create({
            data: {
                name_category: name_category,
            }
        })
    }

    const updated = await prisma.recipe.update({
        where: {
            id
        },
        data: {
            categoryId: response.id,
            name_recipe,
            images_recipe,
            ing,
            stuffing_ing,
            prepareMode,
            portion,
            time,
            videos_recipe,

        }
    })


    res.status(200).json(updated)
});

//update nmr votes
app.patch('/recipe/:userId/votes/:recipeId', async (req: any, res: any) => {
    const { userId, recipeId } = req.params;

    const response = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        },
        select: {
            votes: true
        }
    })

    if (response) {
        const { votes } = response;

        const hasVote = votes.find(save => save.includes(userId));

        if (!hasVote) {

            votes.push(userId);

            await prisma.recipe.update({
                where: {
                    id: recipeId
                },
                data: {
                    votes,
                }
            });

            res.status(201).json({ msg: "update with success" });

        } else res.status(400).json({ msg: "recipe already has vote" })

    } else {
        const { votes } = await prisma.tip.findUniqueOrThrow({
            where: {
                id: recipeId
            },
            select: {
                votes: true
            }
        })

        const hasVote = votes.find(vote => vote.includes(userId));

        if (!hasVote) {

            votes.push(userId);

            await prisma.tip.update({
                where: {
                    id: recipeId
                },
                data: {
                    votes,
                }
            });

            res.status(201).json({ msg: "update with success" })
        } else res.status(400).json({ msg: "Tip already has loved" })
    }
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

app.post('/upload-images', upload.single('image'), async (req: any, res: any) => {
    const sizes = [800, 450, 220, 100];
    const namesSizes = ["big", "medium", "small", "thumb"];
    const images: { [key: string]: string } = {};

    for (let n = 0; n < 3; n++) {
        try {
            const buffer = await sharp(req.file.buffer).clone().resize({ width: sizes[n] }).webp().toBuffer();

            const form = new FormData();
            form.append('key', process.env.KEY_IMGBB)
            form.append('image', buffer.toString('base64'));

            const response = await axios.post('https://api.imgbb.com/1/upload', form)

            if (response.status === 200) {
                images[namesSizes[n]] = response.data.data.url
            } else {
                res.status(response.status).send(response.data.error)
            }

        } catch (error) {
            console.log(error)
            res.status(500).send("erro ao enviar a imagem")
        }
    };

    res.status(201).json(images)

})

app.delete('/recipe/:id', async (req: any, res: any) => {
    const { id } = req.params

    try {
        const deleted = await prisma.recipe.delete({
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
            prisma.recipe.delete({
                where: {
                    id
                }
            })

        ]).catch(error => res.status(500).json({ error }))
        res.status(200).json({ message: "Recipe deleted with success" })
    }
});


export default app;