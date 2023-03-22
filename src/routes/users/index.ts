import { PrismaClient } from "@prisma/client";
import pkg from 'bcryptjs'
import pkgjwt from "jsonwebtoken";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated.js";

import { Router } from "express";

const app = Router(); 
const prisma = new PrismaClient();
const { compare, hash} = pkg
const { sign } = pkgjwt

//USERS
app.get('/users', async (req: any, res: any) => {
    const users = await prisma.user.findMany({
        select:{
            email: true,
            createdAt: true,
            name: true,
            nmr_eyes: true,
            nmr_hearts:true,
            nmr_prizes_won: true,
            photo: true,
            recipe: true,
            admin: true,
            comments: true,
        }
    });
    res.status(200).json(users);
});

app.get('/user/:id', async (req: any, res: any) => {
    const id = req.params.id
    const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            createdAt: true,
            nmr_eyes: true,
            nmr_hearts: true,
            nmr_prizes_won: true,
        }
    })

    res.status(200).json({
        token: '',
        user
    })
});

app.post('/authenticate', async (req: any, res: any) => {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
        where: { email },
    })

    if (user) {

        const passwordMath = await compare(password, user.password);

        if (passwordMath) {
            const token = sign({}, "gui34/35julia38/39", {
                subject: user.id,
                expiresIn: "48h",
            });

            res.status(200).json({ token, id: user.id })
        } else res.status(400).json({ menssage: "Password or e-mail incorrect!" })
    } else res.status(400).json({ menssage: "E-mail or password incorrect!" });

})

app.get('/authenticate-login/:id', ensureAuthenticated, async (req: any, res: any) => {

    const { id } = req.params

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            nmr_eyes: true,
            nmr_hearts: true,
            nmr_prizes_won: true,
        }
    });

    res.status(200).json(user)
});

//CREATE NEW USER
app.post('/users', async (req: any, res: any) => {
    const body = req.body;


    //VERIFY IF USER ALREADY EXIST
    const userAlreadyExist = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    })

    if (!userAlreadyExist) {
        //CREATE USER
        const passwordHash = await hash(body.password, 8);
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: passwordHash,
            }
        });

        const token = sign({}, "gui34/35julia38/39", {
            subject: user.id,
            expiresIn: "48h"
        });

        res.status(200).json({ token, id: user.id })
    } else res.status(200).json({ error: "User already exists" })


});

app.put('/users/:id', (req: any, res: any) => {
    res.status(200).json([])
});

app.delete('/users/:id', (req: any, res: any) => {
    res.status(200).json([])
});


export default app