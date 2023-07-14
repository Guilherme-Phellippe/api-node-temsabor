/*
  Warnings:

  - You are about to drop the `link_shortener` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "link_shortener" DROP CONSTRAINT "link_shortener_recipeId_fkey";

-- AlterTable
ALTER TABLE "User_data_notification" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "cell_phone" DROP NOT NULL,
ALTER COLUMN "cell_phone" DROP DEFAULT;

-- DropTable
DROP TABLE "link_shortener";
