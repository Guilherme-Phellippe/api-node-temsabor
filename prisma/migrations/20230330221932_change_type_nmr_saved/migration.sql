/*
  Warnings:

  - The `nmr_saved` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "nmr_saved",
ADD COLUMN     "nmr_saved" TEXT[] DEFAULT ARRAY[]::TEXT[];
