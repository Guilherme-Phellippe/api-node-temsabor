/*
  Warnings:

  - The `suggestion` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "suggestion",
ADD COLUMN     "suggestion" INTEGER NOT NULL DEFAULT 0;
