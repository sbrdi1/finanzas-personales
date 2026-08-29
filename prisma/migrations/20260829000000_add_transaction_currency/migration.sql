CREATE TYPE "Currency" AS ENUM ('CLP', 'USD');

ALTER TABLE "Transaction"
ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'CLP';
