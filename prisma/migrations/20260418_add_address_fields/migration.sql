-- CreateMigration
SELECT '20260418_add_address_fields' AS migration_name;

-- AddAddressFields
ALTER TABLE "Contact" ADD COLUMN "address" TEXT;
ALTER TABLE "Contact" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Contact" ADD COLUMN "city" TEXT;