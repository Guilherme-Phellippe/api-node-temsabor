-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "tipId" TEXT;

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name_tip" TEXT NOT NULL,
    "description_tip" TEXT NOT NULL,
    "votes" TEXT[],
    "word_key" TEXT[],
    "nmr_hearts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nmr_saved" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nmr_eyes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
