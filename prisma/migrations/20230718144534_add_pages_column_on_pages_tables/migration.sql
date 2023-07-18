-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "pages" JSONB[] DEFAULT ARRAY[]::JSONB[];
