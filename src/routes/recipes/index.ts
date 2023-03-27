import { PrismaClient } from "@prisma/client";

import { Router } from "express";
import axios from "axios";
import FormData from "form-data";
import multer from 'multer';
import sharp from 'sharp'

const app = Router();

const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();


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
                    user:{
                        select:{
                            id: true,
                            name: true, 
                            photo: true,
                        }
                    }
                }
            }
        },
    });

    res.status(200).json(recipes)
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
                    user:{
                        select:{
                            id:true,
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
                        user:{
                            select:{
                                id:true,
                                name: true,
                                photo: true
                            }
                        }
                    }
                }

            }
        }
    )

    res.status(200).json(recipe)
});

app.post('/recipe', async (req: any, res: any) => {
    const recipeInfo = req.body

    const recipe = await prisma.recipe.create({
        data: {
            name_recipe: recipeInfo.name_recipe,
            images_recipe: recipeInfo.images_recipe,
            videos_recipe: recipeInfo.videos_recipe,
            time: recipeInfo.time,
            portion: recipeInfo.portion,
            ing: recipeInfo.ing,
            word_key: recipeInfo.word_key,
            prepareMode: recipeInfo.prepareMode,
            userId: recipeInfo.userId,
            categoryId: recipeInfo.categoryId
        }
    })

    res.status(201).json(recipe);
});

app.put('/recipes/:id', (req: any, res: any) => {
    res.status(200).json(
        [
            {
                id: 0,
                name_recipe: 'Receita de bolo de fubá ',
            },
            {
                id: 0,
                name_recipe: 'Receita de bolo de cenoura',
            },

        ]
    )
});

app.patch('/recipe/:id/nmr-eyes', async (req: any, res: any) => {
    const { id } = req.params;

    const recipe = await prisma.recipe.update({
        where: {
            id
        },
        data: {
            nmr_eyes: {
                increment: 1
            }
        }
    });

    res.status(204).json(recipe)
})

app.patch('/recipe/:id/nmr-hearts/:idRecipe', async (req: any, res: any) => {
    const { id, idRecipe } = req.params;


    const { nmr_hearts } = await prisma.recipe.findUniqueOrThrow({
        where: {
            id: idRecipe
        },
        select: {
            nmr_hearts: true
        }
    })

    nmr_hearts.push(id);

    await prisma.recipe.update({
        where: {
            id: idRecipe
        },
        data: {
            nmr_hearts,
        }
    });

    res.status(204).json({ msg: "update with success" })
})

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
    const sizes = [1000, 600, 150];
    const namesSizes = ["big", "medium", "small"];
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

app.delete('/recipes/:id', (req: any, res: any) => {
    res.status(200).json(
        [
            {
                id: 0,
                name_recipe: 'Receita de bolo de fubá ',
            },
            {
                id: 0,
                name_recipe: 'Receita de bolo de cenoura',
            },

        ]
    )
});


export default app;