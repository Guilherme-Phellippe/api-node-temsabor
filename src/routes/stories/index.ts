import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const app = Router();
const prisma = new PrismaClient


interface storyTypes {
  id: string,
  story_title: string,
  story_poster_portrait_src: string,
  updated_at: string,
}


app.get("/stories/", async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  //push all database 
  const story = await prisma.stories.findMany({
    select: {
      id: true,
      story_title: true,
      story_poster_portrait_src: true,
    },
    where: {
      updated_at: {
        gte: sevenDaysAgo
      }
    }
  }) as unknown;

  if (story) res.status(200).json(story)
  else res.status(500)
});


export default app