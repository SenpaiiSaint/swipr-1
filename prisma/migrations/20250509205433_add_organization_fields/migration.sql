/*
  Warnings:

  - Added the required column `updatedAt` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('PARTS_AND_MATERIALS', 'EQUIPMENT', 'TRAVEL', 'TRAINING', 'MARKETING', 'DIAMOND_INVENTORY', 'SECURITY', 'INSURANCE', 'FABRIC_AND_MATERIALS', 'MANUFACTURING', 'RETAIL_SPACE');

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "alertThreshold" INTEGER NOT NULL DEFAULT 80,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastAlert" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "category",
ADD COLUMN     "category" "BudgetCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "averageTransaction" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "expirationMonth" INTEGER,
ADD COLUMN     "expirationYear" INTEGER,
ADD COLUMN     "lastUsed" TIMESTAMP(3),
ADD COLUMN     "monthlyLimit" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalSpent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'CORPORATE';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "subscriptionTier" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expenseType" TEXT,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "rejectedBy" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "BudgetCategory" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "officeLocation" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultCardId" TEXT,
    "notificationEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationSMS" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardStatusHistory" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStatusHistory" ADD CONSTRAINT "CardStatusHistory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
