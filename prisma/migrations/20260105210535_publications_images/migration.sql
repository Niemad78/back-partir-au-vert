-- AlterTable
ALTER TABLE `Image` ADD COLUMN `publicationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
