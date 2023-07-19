import express from 'express';
import cors from 'cors';
import route from './routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors({
    origin: ["https://temsabor.blog", "http://localhost:3000", "http://127.0.0.0:3000/", "http://localhost:5173", "http://127.0.0.0:5173/"]
}));

app.use(express.json())
app.use(route)


app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));