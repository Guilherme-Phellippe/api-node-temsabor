-- CreateTable
CREATE TABLE "User_data_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "can_send_email" BOOLEAN NOT NULL DEFAULT true,
    "cell_phone" TEXT NOT NULL,
    "can_send_sms" BOOLEAN NOT NULL DEFAULT true,
    "is_whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "can_send_whatsapp" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_data_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_data_notification_email_key" ON "User_data_notification"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_data_notification_cell_phone_key" ON "User_data_notification"("cell_phone");
