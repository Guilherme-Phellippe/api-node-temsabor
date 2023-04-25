import { Router } from "express"
import { PrismaClient }  from "@prisma/client"


const app = Router()
const prisma = new PrismaClient()

app.get('/tips', async (req: any, res: any) => {
    const recipes = await prisma.tip.findMany({
        select: {
            id:true,
            name_tip: true, 
            description_tip:true,
            nmr_eyes:true,
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

    res.status(200).json(recipes)
});

export default app