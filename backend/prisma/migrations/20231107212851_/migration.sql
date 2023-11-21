-- CreateTable
CREATE TABLE "public"."temporary_associations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_email" TEXT NOT NULL,
    "user_role" "public"."Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driver_id" UUID NOT NULL,

    CONSTRAINT "temporary_associations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."temporary_associations" ADD CONSTRAINT "temporary_associations_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
