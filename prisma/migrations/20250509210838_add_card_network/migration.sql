-- CreateEnum
CREATE TYPE "CardNetwork" AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "network" "CardNetwork" NOT NULL DEFAULT 'VISA';

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Card_network_idx" ON "Card"("network");
