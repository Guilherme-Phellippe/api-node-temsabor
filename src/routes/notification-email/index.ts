import { createTransport } from "nodemailer"
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

app.post("/email/send-recipe", (req, res) => {
    const { title, link, ings, emails } = req.body

    if (typeof emails !== "object") {
        res.status(500).json({ Error: "The email inst array type" })
        return
    }


    const emailsToString = emails.join(", ");
    const html = `
        <div style="width: 100%;height: 100%; display: grid; place-items: center;">
            <h1 style="text-align: center; font-size: 40px; margin: 0 10px;">${title}</h1>
            <ul style="margin: 0 20px;">
                ${ings.map((ing: string) => `<li>${ing}</li>`)}
             </ul>
            <a href=${link} style="padding: 5px; background-color: #ff6a28; color: white;">VER RECEITA</a>
        </div>
    `

    const info = transporter.sendMail({
        from: 'receitas.temsabor@gmail.com', // sender address
        to: emailsToString, // list of receivers
        subject: title, // Subject line
        html, // html body
    }, (err: any) => {
        if (!err) res.status(201).json(info)
        else res.status(400).json(err)
    });
})


export default app

