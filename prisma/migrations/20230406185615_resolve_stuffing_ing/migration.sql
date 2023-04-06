-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "stuffing_ing" TEXT[] DEFAULT ARRAY[]::TEXT[];
