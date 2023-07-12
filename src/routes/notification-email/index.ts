import { createTransport } from "nodemailer"
import { PrismaClient } from "@prisma/client";
import { Router } from "express"

const transporter = createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: "receitas.temsabor@gmail.com",
        pass: process.env.GMAIL_PASSWORD
    }
})

const app = Router();
const prisma = new PrismaClient();
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
        select: {
            email: true,
            cell_phone: true,
        }
    });

    const existData = allDataPush.find(data =>
        (data?.email !== "" && data?.email === userData.email) ||
        (data?.cell_phone !== userData.cell_phone && data?.cell_phone === userData.cell_phone)
    )

    if (existData) {
        res.status(400).json({ Error: "The data already exist!" })
        throw new Error("The data already exist!")
    }

    try {
        const response = await prisma.user_data_notification.create({
            data: {
                email: userData?.email || "",
                cell_phone: userData?.cell_phone || "",
            }
        })

        res.status(201).json(response)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})


app.post("/email/send-recipe", async (req, res) => {
    const { title, link, ingredients, image } = req.body
    const emails = await prisma.user_data_notification.findMany({
        select: {
            email: true,
            can_send_email: true
        }
    })

    if (typeof ingredients !== "object") {
        res.status(500).json({ Error: "The ingredients isnt array type" })
        return
    }

    const ing = ingredients.map((ing: string) => `<li style='margin: 4px 0;width:100%'>${ing}</li>`).join("");
    const html = `
        <div style="width: 100vw;height: 100%; display: flex;flex-direction: column; justify-content: center;align-items: center;">
            <div style="width: 100%;display: flex; justify-content: center;">
                <img src=${image} alt="Imagem da receita" style="width: 100%;object-fit: cover;">
            </div>
            <h1 style="text-align: center; font-size: 22px; margin: 20px 0;">${title}</h1>
            <h2 style="text-align: left; font-size: 18px; margin-bottom: 30px;">INGREDIENTES:</h2>
            <ul style="width:100%;display:flex;flex-direction: column;">
                ${ing}
             </ul>
            <p style="text-align: left; font-size: 16px; margin: 30px 0;">Clique no botão abaixo para ver a receita completa em nossa rede social.</p>
            <div style="width: 100%;display: flex; justify-content: center;margin-top:50px;">
                <a 
                    href=${link} 
                    style="padding: 15px 25px;margin:0 auto;font-size: 22px;font-weight:bold; background-color: #ff6a28; color: #fff; text-align:center; border-radius: 20px; text-decoration: none;"
                >VER RECEITA COMPLETA</a>
            </div>
        </div>
    `


    emails.forEach((data: any) => {
        console.log(data.email, data.can_send_email)
        data.can_send_email && data.email !== "" &&
            transporter.sendMail({
                from: 'receitas.temsabor@gmail.com', // sender address
                to: data.email, // list of receivers
                subject: title, // Subject line
                html, // html body
            }, (err: any) => res.status(400).json(err));
    });

    res.status(201).json({ success: true })
})


export default app

