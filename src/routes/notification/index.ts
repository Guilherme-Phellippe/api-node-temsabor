import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const app = Router();
const prisma = new PrismaClient();

app.patch("/notification/:userId/update-read/:notificationId", async (req: any, res:any)=>{
    const { userId, notificationId } = req.params;

    const updated = await prisma.notificationUser.update({
        where:{
            userId_notificationId:{
                notificationId, userId
            }
        }, data:{
            read: true
        }
    })

    res.status(200).json({menssage: "read notification updated with success"})
})


export default app
