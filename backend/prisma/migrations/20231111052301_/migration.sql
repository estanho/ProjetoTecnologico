-- CreateTable
CREATE TABLE "public"."shifts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "morning" BOOLEAN DEFAULT false,
    "afternoon" BOOLEAN DEFAULT false,
    "night" BOOLEAN DEFAULT false,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);
