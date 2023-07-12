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
        <div style="width: 100%;height: 100%; display: flex;flex-direction: column; justify-content: center;align-items: center;">
            <div style="width: 100%;display: flex; justify-content: center;">
                <img src=${image} alt="Imagem da receita" style="width: 80%;object-fit: cover;">
            </div>
            <h1 style="text-align: center; font-size: 22px; margin: 20px 0;">${title}</h1>
            <h2 style="text-align: left; font-size: 16px; margin-bottom: 30px;">INGREDIENTES:</h2>
            <ul style="margin-bottom: 20px; width:100%;display:flex;justify-content:center">
                ${ing}
             </ul>
            <div style="width: 100%;display: flex; justify-content: center;">
                <a 
                    href=${link} 
                    style="padding: 10px 15px; background-color: #ff6a28; color: white; text-align:center; border-radius: 20px; text-decoration: none;"
                >VER RECEITA</a>
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

