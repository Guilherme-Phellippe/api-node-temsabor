/*
  Warnings:

  - The primary key for the `NotificationUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NotificationUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationUser" DROP CONSTRAINT "NotificationUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "NotificationUser_pkey" PRIMARY KEY ("userId", "notificationId");
