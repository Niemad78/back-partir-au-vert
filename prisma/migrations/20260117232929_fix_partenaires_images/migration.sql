/*
  Warnings:

  - You are about to drop the column `logo` on the `Partenaire` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partenaireId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `partenaireId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Partenaire` DROP COLUMN `logo`;

-- CreateIndex
CREATE UNIQUE INDEX `Image_partenaireId_key` ON `Image`(`partenaireId`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_partenaireId_fkey` FOREIGN KEY (`partenaireId`) REFERENCES `Partenaire`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
