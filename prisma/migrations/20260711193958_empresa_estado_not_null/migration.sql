/*
  Warnings:

  - Made the column `estado` on table `empresas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "empresas" ALTER COLUMN "estado" SET NOT NULL;
