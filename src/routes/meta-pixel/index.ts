import { Router, response } from "express"
import axios from "axios";
import dotenv from "dotenv"
import moment from "moment";
import pkg from "bcryptjs"

dotenv.config();
const app = Router();
const { hash } = pkg


const getTheSecondsOfYear = () => {
    const year = moment().year();

    const startOfYear = moment(`${year}-01-01`, "YYYY-MM-DD");
    const endOfYear = moment(`${year}-12-31`, "YYYY-MM-DD");

    return endOfYear.diff(startOfYear, "seconds");
}

app.post("/send-pageview-meta-pixel", async (req, res) => {
    const access_token = process.env.TOKEN_META_PIXEL;
    const api_version = "v17.0";
    const pixel_id = process.env.META_PIXEL;

    const data = {
        event_name: "pageview",
        event_time: getTheSecondsOfYear(),
        action_source: "website",
        user_data: {
            em: [await hash("searby3f@hotmail.com", 5)],
        }
    }

    const response = await axios.post(`https://graph.facebook.com/${api_version}/${pixel_id}/events`, data , {
        headers: {
            'Content-Type': "application/json"
        }, params: {
            access_token
        }
    }).catch(err => res.status(401).json(err))

    res.status(200).json(response)

})


export default app