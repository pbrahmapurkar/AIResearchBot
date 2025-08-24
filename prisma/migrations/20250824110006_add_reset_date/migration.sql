/*
  Warnings:

  - Added the required column `resetDate` to the `plan_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_plan_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "monthlyQuota" INTEGER NOT NULL DEFAULT 10,
    "usedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "resetDate" DATETIME NOT NULL,
    "org_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "plan_subscriptions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_plan_subscriptions" ("created_at", "id", "monthlyQuota", "org_id", "plan", "updated_at", "usedThisMonth") SELECT "created_at", "id", "monthlyQuota", "org_id", "plan", "updated_at", "usedThisMonth" FROM "plan_subscriptions";
DROP TABLE "plan_subscriptions";
ALTER TABLE "new_plan_subscriptions" RENAME TO "plan_subscriptions";
CREATE UNIQUE INDEX "plan_subscriptions_org_id_key" ON "plan_subscriptions"("org_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
