-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_sourceId_fkey";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
