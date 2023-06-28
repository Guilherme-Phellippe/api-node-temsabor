/*
  Warnings:

  - The `images_recipe` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "images_recipe",
ADD COLUMN     "images_recipe" JSONB[];
