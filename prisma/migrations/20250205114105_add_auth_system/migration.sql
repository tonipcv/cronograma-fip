/*
  Warnings:

  - Added the required column `password` to the `Cronograma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cronograma" ADD COLUMN     "password" TEXT NOT NULL;
