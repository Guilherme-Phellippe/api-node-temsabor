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
    const { title, link, ingredients, emails } = req.body

    if (typeof emails !== "object" || typeof ingredients !== "object") {
        res.status(500).json({ Error: "The email or ingredients isnt array type" })
        return
    }

    console.log(ingredients)
    const ing = ingredients.map((ing: string) => `<li>${ing}</li>`).join("");
    console.log(ing)
    const html = `
        <div style="width: 100%;height: 100%; display: grid; place-items: center;">
            <h1 style="text-align: center; font-size: 40px; margin: 0 10px;">${title}</h1>
            <h2 style="text-align: left; font-size: 25px; margin: 0 10px;">INGREDIENTES:</h2>
            <ul style="margin: 0 20px;">
                ${ing}
             </ul>
            <a href=${link} style="padding: 5px; background-color: #ff6a28; color: white;">VER RECEITA</a>
        </div>
    `


    emails.forEach((email: string) => {
        transporter.sendMail({
            from: 'receitas.temsabor@gmail.com', // sender address
            to: email, // list of receivers
            subject: title, // Subject line
            html, // html body
        }, (err: any) => res.status(400).json(err));
    });
   
    res.status(201).json({ success: true})
})


export default app

