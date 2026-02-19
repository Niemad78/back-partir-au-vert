/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Activite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Activite` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Activite_slug_key` ON `Activite`(`slug`);
