import axios from "axios";
import { Router } from "express"
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


export default app