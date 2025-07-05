-- AlterTable
ALTER TABLE "News" ADD COLUMN     "newsAlbumId" TEXT;

-- CreateTable
CREATE TABLE "NewsAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverImage" TEXT,

    CONSTRAINT "NewsAlbum_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_newsAlbumId_fkey" FOREIGN KEY ("newsAlbumId") REFERENCES "NewsAlbum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
