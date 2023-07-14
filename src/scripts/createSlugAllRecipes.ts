import { PrismaClient } from "@prisma/client";
import { transformTextToSlug } from "./transformTextToSlug";

const prisma = new PrismaClient();

async function createSlug() {
    const recipes = await prisma.recipe.findMany();
    console.log(recipes)

    const recipesFiltered = recipes.filter(recipe => !recipe.slug);

    if (recipesFiltered.length) {
        recipesFiltered.forEach(async (recipe, i) => {
            const slug = await transformTextToSlug(recipe.name_recipe) as string

            const result = await prisma.recipe.update({
                where: {
                    id: recipe.id
                },
                data: {
                    slug
                }
            }).catch(err => console.log(err))

            console.log({ index: i })
        })
    }

}

createSlug();