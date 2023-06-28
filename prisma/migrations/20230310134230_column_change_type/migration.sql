/*
  Warnings:

  - The `ing` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `word_key` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ing",
ADD COLUMN     "ing" TEXT[],
DROP COLUMN "word_key",
ADD COLUMN     "word_key" TEXT[];
