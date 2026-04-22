/*
  Warnings:

  - The `amount` column on the `Devis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Devis" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION;
