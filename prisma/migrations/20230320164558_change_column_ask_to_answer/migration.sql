/*
  Warnings:

  - You are about to drop the column `ask` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "ask",
ADD COLUMN     "answer" JSONB[];
