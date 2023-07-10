-- DropIndex
DROP INDEX "User_data_notification_cell_phone_key";

-- DropIndex
DROP INDEX "User_data_notification_email_key";

-- AlterTable
ALTER TABLE "User_data_notification" ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "cell_phone" SET DEFAULT '';
