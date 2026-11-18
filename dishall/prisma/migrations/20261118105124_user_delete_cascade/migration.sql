-- DropForeignKey
ALTER TABLE "critic" DROP CONSTRAINT "critic_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mod_action" DROP CONSTRAINT "mod_action_user_id_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "server" DROP CONSTRAINT "server_user_id_fkey";

-- AlterTable
ALTER TABLE "critic" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mod_action" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "server" ADD CONSTRAINT "server_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critic" ADD CONSTRAINT "critic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mod_action" ADD CONSTRAINT "mod_action_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
