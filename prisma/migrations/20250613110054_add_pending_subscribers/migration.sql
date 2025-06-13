-- CreateTable
CREATE TABLE "PendingSubscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingSubscriber_email_key" ON "PendingSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingSubscriber_token_key" ON "PendingSubscriber"("token");
