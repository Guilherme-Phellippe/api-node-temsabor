import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const app = Router();
const prisma = new PrismaClient();

app.patch("/notification/:userId/update-read/:notificationId", async (req: any, res: any) => {
    const { userId, notificationId } = req.params;

    await prisma.notificationUser.update({
        where: {
            userId_notificationId: {
                notificationId, userId
            }
        }, data: {
            read: true
        }
    })

    res.status(200).json({ menssage: "read notification updated with success" })
})


app.post("/notification/:userId/new/:notificationId", async (req: any, res: any) => {
    const { userId, notificationId } = req.params;

    const notification = await prisma.notificationUser.create({
        data: {
            userId,
            notificationId
        }
    })

    res.status(201).json(notification)
});

app.delete("/notification/:userId/delete/:notificationId", async (req: any, res: any) => {
    const { userId, notificationId } = req.params;

    const deleted = await prisma.notificationUser.delete({
        where: {
            userId_notificationId:{
                notificationId,
                userId
            }
        }
    })

    if(deleted) res.status(200).json({ message: "notification deleted with success" })
})

export default app
