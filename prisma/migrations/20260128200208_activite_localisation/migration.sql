-- AlterTable
ALTER TABLE `Activite` ADD COLUMN `adresse` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DECIMAL(9, 6) NULL,
    ADD COLUMN `longitude` DECIMAL(9, 6) NULL;
