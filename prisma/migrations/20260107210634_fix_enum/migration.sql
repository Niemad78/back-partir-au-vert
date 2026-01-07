/*
  Warnings:

  - You are about to alter the column `type` on the `Publication` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Publication` MODIFY `type` ENUM('histoire', 'seminaire', 'autre') NOT NULL DEFAULT 'autre';
