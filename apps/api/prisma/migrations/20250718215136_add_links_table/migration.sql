/*
  Warnings:

  - Added the required column `generated` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "description" TEXT,
ADD COLUMN     "generated" BOOLEAN NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
