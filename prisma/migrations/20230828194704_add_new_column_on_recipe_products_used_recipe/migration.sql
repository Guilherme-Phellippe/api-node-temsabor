-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "products_used_recipe" TEXT[] DEFAULT ARRAY[]::TEXT[];
