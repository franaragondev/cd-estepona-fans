-- DropForeignKey
ALTER TABLE "NewsTranslation" DROP CONSTRAINT "NewsTranslation_newsId_fkey";

-- AddForeignKey
ALTER TABLE "NewsTranslation" ADD CONSTRAINT "NewsTranslation_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
