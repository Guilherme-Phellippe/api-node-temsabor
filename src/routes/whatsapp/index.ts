import { Router } from "express";
import axios from "axios"

const app = Router();


app.post("/send-recipe", async (req: any, res: any) => {
    const messageBody = req.body
    const token = process.env.TOKEN_WHATSAPP

    try {
        const response = await axios.post(
            ' https://graph.facebook.com/v17.0/114494558332190/messages',
            messageBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        res.send(response.data)
    } catch (error: any) {
        console.error('Erro ao enviar mensagem:', error.response.data);
        res.status(404).json(error.response.data)
    }

})

app.get("/notification-whats", (req, res) => {

    console.log(res)

    res.send("foi")
})


export default app