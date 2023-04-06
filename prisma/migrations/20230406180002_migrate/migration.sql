/*
  Warnings:

  - Added the required column `stuffing_ing` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "stuffing_ing" JSONB NOT NULL;
