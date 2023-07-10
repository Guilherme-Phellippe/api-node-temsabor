import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { Router } from "express"

const prisma = new PrismaClient();
const app = Router();

/**
 * SEND NOTIFICIATION PUSH TO USER THAT SUBSCRIPTION ON ONESIGNAL PLATIFORM
 * @param [message:string, title:string, url:string, image:string]
 */
app.post("/push/send-notification", (req, res) => {
    const { data } = req.body
    // ONESIGNAL'S TOKEN AND KEY 
    const token = process.env.YOUR_REST_API_KEY
    const app_id = process.env.APP_ID
    //REQUEST TO ONESIGNAL'S API
    axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
            "app_id": app_id,
            "contents": { "en": data.message },
            "headings": { "en": data.title },
            "url": data.url,
            "big_picture": data.image,
            "chrome_web_image": data.image,
            "included_segments": ["Subscribed Users"]
        },
        {
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${token}`
            }
        }
    ).then(({ data }) => {
        res.status(200).json({ data })
    }).catch(err => {
        console.log(err)
        res.status(500)
    })
})

//
//  USER DATA NOTIFICATION
//
/**
 * GET ALL USER DATA 
 */
app.get("/user-data-push/data", async (req, res) => {
    try {
        const data = await prisma.user_data_notification.findMany({
            select: {
                email: true,
                can_send_email: true,
                cell_phone: true,
                is_whatsapp: true,
                can_send_sms: true,
                can_send_whatsapp: true,
            }
        });
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})
/**
 * REGISTER A USER DATA 
 */
app.post("/user-data-push/register", async (req, res) => {
    interface userDataTypes {
        email: string,
        cell_phone: string
    }

    const userData: userDataTypes = req.body

    const allDataPush = await prisma.user_data_notification.findMany({
        select:{
            email: true, 
            cell_phone: true,
        }
    });

    const existData = allDataPush.find(data => 
        (data?.email !== "" && data?.email === userData.email) ||
        (data?.cell_phone !== userData.cell_phone && data?.cell_phone === userData.cell_phone)
    )
    
    if(existData){
        res.status(400).json({ Error: "The data already exist!" })
        throw new Error("The data already exist!")
    }

    try {
        const response = await prisma.user_data_notification.create({
            data: {
                email: userData?.email ?? "",
                cell_phone: userData?.cell_phone ?? "",
            }
        })

        res.status(201).json(response)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})


export default app