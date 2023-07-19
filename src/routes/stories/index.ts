import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { transformTextToSlug } from "../../scripts/transformTextToSlug";

const app = Router();
const prisma = new PrismaClient

app.get("/stories/", async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  //push all database 
  const story = await prisma.stories.findMany({
    select: {
      id: true,
      slug: true,
      story_title: true,
      story_poster_portrait_src: true,
    },
    where: {
      updated_at: {
        gte: sevenDaysAgo
      }
    }
  });

  if (story) res.status(200).json(story)
  else res.status(500)
});

app.post("/stories/create", async (req: any, res: any) => {
  try {
    const {
      story_title,
      story_publisher,
      story_publisher_logo_src,
      story_poster_portrait_src,
      pages } = req.body

    const slug = await transformTextToSlug(story_title, "stories") as string


    const result = await prisma.stories.create({
      data: {
        slug,
        story_title,
        story_publisher,
        story_publisher_logo_src,
        story_poster_portrait_src,
        pages

      }
    })

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json(error)
  }

})


export default app