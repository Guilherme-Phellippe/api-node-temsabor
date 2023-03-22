/*
  Warnings:

  - The `nmr_hearts` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "nmr_hearts",
ADD COLUMN     "nmr_hearts" TEXT[] DEFAULT ARRAY[]::TEXT[];
