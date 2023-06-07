import { Router } from "express";
import axios from "axios"

const app = Router();


app.post("/send-recipe", async (req: any, res: any) => {
    const messageBody = req.body

    try {
        const response = await axios.post(
            ' https://graph.facebook.com/v17.0/114494558332190/messages',
            messageBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer EAAIcM33Jzm0BAGXIRePjusQjJfJ14jZArt7ZB7J0i5HDOA5wpRFf4WXueMj13yoJmk7g2KWdfj5FActqlMsbGyg8ZChDOI4GzDWA3hlKaxcg2xBlxx8J7JLut10BSo2KMGXrKCMxmCHp22lvlh7BzEkK4ZAiPnwfGSCxCtQPC5yupC5ZArEifZBnb7wgSB85gmNoZBv8mYlZAw6Us2q7qzKs7K27mAXPuZA0ZD',
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