/*
  Warnings:

  - The `stuffing_ing` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "stuffing_ing",
ADD COLUMN     "stuffing_ing" TEXT[] DEFAULT ARRAY[]::TEXT[];
