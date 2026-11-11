-- DropForeignKey
ALTER TABLE "critic" DROP CONSTRAINT "critic_server_id_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_critic_uuid_fkey";

-- DropForeignKey
ALTER TABLE "score" DROP CONSTRAINT "score_server_id_fkey";

-- DropForeignKey
ALTER TABLE "server_stats" DROP CONSTRAINT "server_stats_server_id_fkey";

-- DropForeignKey
ALTER TABLE "server_tag" DROP CONSTRAINT "server_tag_server_uuid_fkey";

-- DropForeignKey
ALTER TABLE "server_tag" DROP CONSTRAINT "server_tag_tag_uuid_fkey";

-- AddForeignKey
ALTER TABLE "server_stats" ADD CONSTRAINT "server_stats_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critic" ADD CONSTRAINT "critic_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_critic_uuid_fkey" FOREIGN KEY ("critic_uuid") REFERENCES "critic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag" ADD CONSTRAINT "server_tag_server_uuid_fkey" FOREIGN KEY ("server_uuid") REFERENCES "server"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag" ADD CONSTRAINT "server_tag_tag_uuid_fkey" FOREIGN KEY ("tag_uuid") REFERENCES "tag"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
