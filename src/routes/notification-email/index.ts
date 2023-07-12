import { createTransport } from "nodemailer"
import { Router } from "express"

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: "receitas.temsabor@gmail.com",
        pass: process.env.GMAIL_PASSWORD
    }
})

const app = Router();

app.post("/email/send-recipe", async (req, res) => {
    const { title , htmlContent, emails} = req.body
    
    if (typeof emails !== "object") {
        res.status(500).json({ Error: "The email inst array type" })
        return
    }
    

    const emailsToString = emails.join(", ");

    const info = await transporter.sendMail({
        from: 'receitas.temsabor@gmail.com', // sender address
        to: emailsToString, // list of receivers
        subject: title, // Subject line
        html: htmlContent, // html body
    }, (err)=> {
        if(!err) res.status(201).json(info)
        else res.status(400).json(err)
    });
})


export default app

