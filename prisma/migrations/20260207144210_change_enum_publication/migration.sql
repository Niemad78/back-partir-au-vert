-- AlterTable
ALTER TABLE `Publication` MODIFY `type` ENUM('histoire', 'seminaire', 'mentions_legales', 'cgv', 'autre') NOT NULL DEFAULT 'autre';
