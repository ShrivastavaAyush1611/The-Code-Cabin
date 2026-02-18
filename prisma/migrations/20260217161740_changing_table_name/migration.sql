/*
  Warnings:

  - You are about to drop the column `defficulty` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `description` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "defficulty",
ADD COLUMN     "description" TEXT NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");
