import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import moment from "moment";


const app = Router()
const prisma = new PrismaClient()

//get all feeds
app.get('/feeds', async (req: any, res: any) => {
    const tips = await prisma.tip.findMany({
        select: {
            id: true,
            name_tip: true,
            description_tip: true,
            images: true,
            nmr_eyes: true,
            nmr_hearts: true,
            nmr_saved: true,
            createdAt: true,
            votes: true,
            word_key: true,
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

    function organizeFeed(feed: any) {
        const result = [];
        let index = 0;
        while (feed.length) {
            if (index === 0) {
                const randomIndex = Math.floor(Math.random() * feed.length)
                const selectedFeed = feed.splice(randomIndex, 1)[0]
                result.push(selectedFeed)
            } else if (index % 3 === 0 && feed.length) {
                feed.sort((a: any, b: any) => {
                    if(b.comments.length !== a.comments.length) return b.comments.length - a.comments.length
                    else return b.nmr_hearts.length - a.nmr_hearts.length
                })
                
                const firstRecipe = feed.splice(0, 1)[0]
                result.push(firstRecipe);
            } else if (feed.length) {
                feed.sort((a: any, b: any) => moment(b.createdAt).diff(moment(a.createdAt)))
                const firstRecipe = feed.splice(0, 1)[0]
                result.push(firstRecipe);
            }
            index++
        }

        return result
    }

    const feed = organizeFeed([...tips, ...recipes])

    res.status(200).json(feed);
});

// get unique Feed 
app.get('/feed/:id', async (req: any, res: any) => {
    const id = req.params.id
    var recipe;

    const response = await prisma.recipe.findUnique(
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

    if (response) recipe = response
    else {
        const response = await prisma.tip.findUniqueOrThrow(
            {
                where: { id },
                select: {
                    id: true,
                    name_tip: true,
                    description_tip: true,
                    images: true,
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
        );

        recipe = response
    }

    const recipes = await prisma.recipe.findMany({
        where: {
            userId: id
        }
    });
    const tips = await prisma.tip.findMany({
        where: {
            userId: id
        }
    });

    const feeds = [...recipes, ...tips];

    recipe.user.nmr_eyes = feeds.reduce((total, item) => total + (item.nmr_eyes || 0), 0);
    recipe.user.nmr_hearts = feeds.reduce((total, recipe) => total + (recipe.nmr_hearts.length || 0), 0)

    res.status(200).json(recipe)

});

//update nmr eyes
app.patch('/feed/:id/nmr-eyes', async (req: any, res: any) => {
    const { id } = req.params;
    var data;

    const response = await prisma.recipe.findUnique({
        where: {
            id
        }
    });

    if (response) {
        data = await prisma.recipe.update({
            where: {
                id
            },
            data: {
                nmr_eyes: {
                    increment: 1
                }
            }
        });
    } else {
        data = await prisma.tip.update({
            where: {
                id
            },
            data: {
                nmr_eyes: {
                    increment: 1
                }
            }
        });
    }


    res.status(201).json(data)
});

//update nmr hearts
app.patch('/feed/:userId/nmr-hearts/:recipeId', async (req: any, res: any) => {
    const { userId, recipeId } = req.params;

    const response = await prisma.recipe.findUnique({
        where: {
            id: recipeId
        },
        select: {
            nmr_hearts: true
        }
    })

    if (response) {
        const { nmr_hearts } = response;

        const hasHeart = nmr_hearts.find(save => save.includes(userId));

        if (!hasHeart) {

            nmr_hearts.push(userId);

            await prisma.recipe.update({
                where: {
                    id: recipeId
                },
                data: {
                    nmr_hearts,
                }
            });

            res.status(201).json({ msg: "update with success" });

        } else res.status(400).json({ msg: "User already gived loved" })

    } else {
        const { nmr_hearts } = await prisma.tip.findUniqueOrThrow({
            where: {
                id: recipeId
            },
            select: {
                nmr_hearts: true
            }
        })

        const hasTip = nmr_hearts.find(saved => saved.includes(userId));

        if (!hasTip) {

            nmr_hearts.push(userId);

            await prisma.tip.update({
                where: {
                    id: recipeId
                },
                data: {
                    nmr_hearts,
                }
            });

            res.status(201).json({ msg: "update with success" })
        } else res.status(400).json({ msg: "Tip already has loved" })
    }
});

//update nmr save
app.patch('/feed/:id/nmr-saved/:recipeId', async (req: any, res: any) => {
    const { id, recipeId } = req.params;

    const { nmr_saved } = await prisma.recipe.findUniqueOrThrow({
        where: {
            id: recipeId
        },
        select: {
            nmr_saved: true
        }
    });

    const response = await prisma.recipe.update({
        where: {
            id
        },
        data: {
            nmr_saved: nmr_saved.concat(id)
        }
    });

    response ?
    res.status(204).json({ msg: "update with success" })
    :
    res.status(500).json({ msg: "error at update" })
});


export default app

