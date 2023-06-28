/*
  Warnings:

  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "link",
DROP COLUMN "read",
ADD COLUMN     "isLink" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NotificationUser" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
