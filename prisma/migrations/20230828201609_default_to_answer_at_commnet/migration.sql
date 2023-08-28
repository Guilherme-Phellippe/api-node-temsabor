-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "answer" SET DEFAULT ARRAY[]::JSONB[];
