import express from 'express';
import cors from 'cors';
import route from './routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json())
app.use(cors());
app.use(route)


app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));