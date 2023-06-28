-- CreateTable
CREATE TABLE "link_shortener" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "origin_link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_shortener_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "link_shortener_key_key" ON "link_shortener"("key");
