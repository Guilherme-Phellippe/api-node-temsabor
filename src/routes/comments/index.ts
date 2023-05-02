import { PrismaClient } from "@prisma/client";

import { Router } from "express";
import moment from "moment";

const app = Router();
const prisma = new PrismaClient();

app.post('/comment', async (req: any, res: any) => {

    const isRecipeTable = req.body.type || true

    const comment = await prisma.comment.create({
        data: {
            userId: req.body.userId,
            recipeId: isRecipeTable ? req.body.recipeId : null,
            tipId: !isRecipeTable ? req.body.tipId : null,
            comment: req.body.comment,
        }
    });

    res.status(201).json(comment)
});

app.delete('/comment/:id/user/:userId', async (req: any, res: any) => {
    const { id, userId } = req.params

    const comment = await prisma.comment.findUnique({
        where: {
            id
        },
        select: {
            userId: true,
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            admin: true
        }
    })

    if(user && comment){
        if (user.admin || comment.userId === userId) {
            await prisma.comment.delete({
                where: {
                    id
                }
            });
            res.status(201).json({ msg: "comment delete with success" })
        } else res.status(401).json({ error: "User unauthorized delete this comment" })
    }else res.status(404).json({error: "User or comment not found"})
});


app.post('/comment/:id/answer', async (req: any, res: any) => {
    const { id } = req.params;

    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        }
    });

    const user = await prisma.user.findUnique({
        where:{
            id: req.body.userId
        }
    })

    if(!user) {
        res.status(404).json({ error: "user not found" });
        throw new Error("user not found")
    }

    const answerObject = {
        id: comment.answer.length + 1,
        userId: user.id,
        name: user.name,
        photo: user.photo,
        answer: req.body.answer,
        createdAt: moment().format()
    }

    comment.answer.push(answerObject)

    await prisma.comment.update({
        where: {
            id,
        },
        data: {
            answer: comment.answer
        }
    })

    res.status(201).json(answerObject)
})


app.delete('/comment/:id/answer/:answerId/user/:userId', async (req: any, res: any) => {
    const { id, answerId, userId } = req.params

    interface Answer {
        id: string,
        userId: string,
        answer: string[]
    }
    interface Comment {
        userId: string,
        answer: Answer[]
    }

    //SEARCH COMMENT BY ID AND SAVE ON VARIABLE FOR AFTER SEARCH ALL ANSWERS 
    const comment:Comment | null = (await prisma.comment.findUnique({
        where: {
            id
        },
        select: {
            userId: true,
            answer: true
        }
    })) as Comment | null;

    if(!comment) throw new Error("this comment is null");


    //SEARCH USER BY USERID 
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    //SEARCH ALL ANSWERS BY ANSWERID
    const answerData = comment.answer.find((answer) => answer.id.toString() === answerId);
    
    if(!answerData) throw new Error("there is no answer with this id")
    
    //CHECK IF USER IS ADMIN OR USER ID IS SIMILAR TO USERID
    if (user.admin || answerData.userId === userId) {
        const data:any = comment.answer.filter((answer) => answer.id.toString() !== answerId);

        await prisma.comment.update({
            where: {
                id
            },
            data:{
               answer: data
            }
        });

        res.status(201).json({ msg: "Answer delete with success" })
    } else res.status(401).json({ error: "User unauthorized delete this answer" })
});



export default app