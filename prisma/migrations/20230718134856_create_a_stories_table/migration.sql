-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "story_title" TEXT NOT NULL,
    "story_publisher" TEXT NOT NULL,
    "story_publisher_logo_src" TEXT NOT NULL,
    "story_poster_portrait_src" TEXT NOT NULL,
    "grid_layer_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);
