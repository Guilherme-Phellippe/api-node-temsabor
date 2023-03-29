import { PrismaClient } from "@prisma/client";
import pkg from 'bcryptjs'
import pkgjwt from "jsonwebtoken";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated.js";

import { Router } from "express";

const app = Router(); 
const prisma = new PrismaClient();
const { compare, hash} = pkg
const { sign } = pkgjwt;

//USERS
app.get('/users', async (req: any, res: any) => {
    const users = await prisma.user.findMany({
        select:{
            email: true,
            createdAt: true,
            name: true,
            nmr_eyes: true,
            nmr_hearts:true,
            photo: true,
            recipe: true,
            admin: true,
            comments: true,

        }
    });
    res.status(200).json(users)
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
            admin: true,
            nmr_eyes: true,
            nmr_hearts: true,
            nmr_saved: true,
            recipe:{
                select:{
                    id: true,
                    name_recipe: true,
                    images_recipe: true,
                    category: {
                        select:{
                            name_category: true
                        }
                    },
                    createdAt: true,
                    nmr_eyes: true,
                    nmr_hearts: true,
                    nmr_saved: true
                }
            },
            notification:{
                select:{
                    title: true,
                    message: true,
                    type: true,
                    id: true,
                    link: true,
                }
            },
            winner:{
                select:{
                    rank: true,
                    month:true,
                    year: true
                }
            },
            _count:{
                select:{
                    comments: true,
                    
                }
            }

            
        }
    });

    const recipes = await prisma.recipe.findMany({
        where:{
            userId: user.id
        }
    });


    user.nmr_eyes = recipes.reduce((total, item) => total + (item.nmr_eyes || 0), 0);
    user.nmr_hearts = recipes.reduce((total, recipe) => total + (recipe.nmr_hearts.length || 0), 0 )
    user.nmr_saved = recipes.reduce((total, recipe) => total + (recipe.nmr_saved || 0), 0 )

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

app.put('/users/:id', async (req: any, res: any) => {
    const { id } = req.params

    const response = await prisma.user.update({
        where:{
            id,
        },
        data:{
            name: req.body?.name,
            email: req.body?.email,
            photo: req.body?.photo,
        }
    })

    res.status(200).json({ menssage: "User updated with success"});
});


app.patch("/users/:id/change-password", async (req: any , res:any) =>{
    const { id } = req.params;

    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id
        },
        select:{
            password: true
        }
    });


    const passwordMath = await compare(req.body.currentPassword, user.password);

    if(passwordMath){
        const hashPassword = await hash(req.body.newPassword, 8)

        const response = await prisma.user.update({
            where:{
                id,
            },
            data:{
                password: hashPassword
            }
        });

        if(response) res.status(201).json({message: "Password update with success"})
    }else res.status(401).json({message: "User unauthorized perform this action"})
    

});

app.delete('/users/:id', async (req: any, res: any) => {
    const { id } = req.params;

    const deletedUser = await prisma.user.delete({
        where:{
            id
        }
    });

    res.status(200).json(deletedUser, {message: "Deleted user with success" })
});



export default app