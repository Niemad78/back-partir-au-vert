-- AlterTable
ALTER TABLE `Publication` MODIFY `type` ENUM('histoire', 'seminaire', 'mentions_legales', 'autre') NOT NULL DEFAULT 'autre';
