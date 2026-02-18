/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description",
ADD COLUMN     "difficulty" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
