-- CreateEnum
CREATE TYPE "public"."ConnectionRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."get_to_know_me" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Get To Know Me',
    "question" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "get_to_know_me_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConnectionRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" "public"."ConnectionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connection" (
    "id" TEXT NOT NULL,
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "get_to_know_me_userId_key" ON "public"."get_to_know_me"("userId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_senderId_idx" ON "public"."ConnectionRequest"("senderId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_receiverId_idx" ON "public"."ConnectionRequest"("receiverId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_senderId_receiverId_idx" ON "public"."ConnectionRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Connection_userOneId_idx" ON "public"."Connection"("userOneId");

-- CreateIndex
CREATE INDEX "Connection_userTwoId_idx" ON "public"."Connection"("userTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userOneId_userTwoId_key" ON "public"."Connection"("userOneId", "userTwoId");

-- AddForeignKey
ALTER TABLE "public"."get_to_know_me" ADD CONSTRAINT "get_to_know_me_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."get_to_know_me"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
