import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const app = Router();
const prisma = new PrismaClient();


app.get("/notification/:id", async (req: any, res: any) => {
    const { id } = req.params

    const notifications = await prisma.notificationUser.findMany({
        where:{
            userId: id
        }, select:{
            notification:{
                select:{
                    id: true,
                    title: true,
                    message: true,
                    link: true,
                    type: true,
                    _count: true
                }
            }
        }
    });

    res.status(200).json(notifications)
})


export default app
