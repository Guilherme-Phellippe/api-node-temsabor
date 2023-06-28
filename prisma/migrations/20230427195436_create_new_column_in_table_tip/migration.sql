-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "images" JSONB[] DEFAULT ARRAY[]::JSONB[];
