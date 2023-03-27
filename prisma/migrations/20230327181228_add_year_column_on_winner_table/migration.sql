/*
  Warnings:

  - Added the required column `year` to the `Winner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Winner" ADD COLUMN     "year" INTEGER NOT NULL;
