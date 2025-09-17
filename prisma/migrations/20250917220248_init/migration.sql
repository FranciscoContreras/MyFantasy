-- CreateEnum
CREATE TYPE "public"."ScoringType" AS ENUM ('STANDARD', 'PPR', 'HALF_PPR', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."Position" AS ENUM ('QB', 'RB', 'WR', 'TE', 'FLEX', 'DST', 'K', 'IDP', 'BENCH');

-- CreateEnum
CREATE TYPE "public"."InjuryStatus" AS ENUM ('HEALTHY', 'QUESTIONABLE', 'DOUBTFUL', 'OUT', 'IR');

-- CreateEnum
CREATE TYPE "public"."TradeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT,
    "scoringType" "public"."ScoringType" NOT NULL DEFAULT 'PPR',
    "rosterConfig" JSONB NOT NULL,
    "scoringSettings" JSONB,
    "season" INTEGER NOT NULL,
    "commissionerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeagueMember" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" VARCHAR(4),
    "avatarUrl" TEXT,
    "winTotal" INTEGER NOT NULL DEFAULT 0,
    "lossTotal" INTEGER NOT NULL DEFAULT 0,
    "tieTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "nflId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" "public"."Position" NOT NULL,
    "team" TEXT NOT NULL,
    "byeWeek" INTEGER,
    "age" INTEGER,
    "injuryStatus" "public"."InjuryStatus" DEFAULT 'HEALTHY',
    "depthChartOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerStats" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "week" INTEGER,
    "opponent" TEXT,
    "fantasyPoints" DECIMAL(6,2),
    "data" JSONB NOT NULL,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Projection" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "projectedPoints" DECIMAL(6,2) NOT NULL,
    "floorPoints" DECIMAL(6,2),
    "ceilingPoints" DECIMAL(6,2),
    "confidence" INTEGER,

    CONSTRAINT "Projection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Matchup" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "homeScore" DECIMAL(7,2),
    "awayScore" DECIMAL(7,2),
    "scheduledDate" TIMESTAMP(3),
    "location" TEXT,

    CONSTRAINT "Matchup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RosterSlot" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "slot" "public"."Position" NOT NULL,
    "season" INTEGER NOT NULL,
    "week" INTEGER,
    "isBench" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RosterSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TradeProposal" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "proposerTeamId" TEXT NOT NULL,
    "recipientTeamId" TEXT NOT NULL,
    "status" "public"."TradeStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "respondedAt" TIMESTAMP(3),
    "ownerRecordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TradeItem" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "fromTeamId" TEXT NOT NULL,
    "toTeamId" TEXT NOT NULL,
    "playerId" TEXT,
    "draftPick" JSONB,

    CONSTRAINT "TradeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TradeAudit" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InjuryReport" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "leagueId" TEXT,
    "status" "public"."InjuryStatus" NOT NULL,
    "designation" TEXT,
    "notes" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InjuryReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeatherReport" (
    "id" SERIAL NOT NULL,
    "gameId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "stadium" TEXT,
    "temperature" INTEGER,
    "windSpeed" INTEGER,
    "precipitationChance" INTEGER,
    "conditions" TEXT,
    "kickoff" TIMESTAMP(3),

    CONSTRAINT "WeatherReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoricalSync" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payload" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "HistoricalSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "public"."LeagueMember"("leagueId", "userId");

-- CreateIndex
CREATE INDEX "Team_leagueId_idx" ON "public"."Team"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nflId_key" ON "public"."Player"("nflId");

-- CreateIndex
CREATE INDEX "PlayerStats_season_week_idx" ON "public"."PlayerStats"("season", "week");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_season_week_key" ON "public"."PlayerStats"("playerId", "season", "week");

-- CreateIndex
CREATE INDEX "Projection_season_week_idx" ON "public"."Projection"("season", "week");

-- CreateIndex
CREATE UNIQUE INDEX "Projection_playerId_provider_season_week_key" ON "public"."Projection"("playerId", "provider", "season", "week");

-- CreateIndex
CREATE INDEX "Matchup_leagueId_week_idx" ON "public"."Matchup"("leagueId", "week");

-- CreateIndex
CREATE INDEX "RosterSlot_teamId_season_idx" ON "public"."RosterSlot"("teamId", "season");

-- CreateIndex
CREATE UNIQUE INDEX "RosterSlot_teamId_playerId_season_week_key" ON "public"."RosterSlot"("teamId", "playerId", "season", "week");

-- CreateIndex
CREATE INDEX "TradeProposal_leagueId_idx" ON "public"."TradeProposal"("leagueId");

-- CreateIndex
CREATE INDEX "TradeItem_tradeId_idx" ON "public"."TradeItem"("tradeId");

-- CreateIndex
CREATE INDEX "InjuryReport_reportDate_idx" ON "public"."InjuryReport"("reportDate");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherReport_gameId_week_key" ON "public"."WeatherReport"("gameId", "week");

-- CreateIndex
CREATE INDEX "HistoricalSync_source_scope_idx" ON "public"."HistoricalSync"("source", "scope");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."League" ADD CONSTRAINT "League_commissionerId_fkey" FOREIGN KEY ("commissionerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projection" ADD CONSTRAINT "Projection_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matchup" ADD CONSTRAINT "Matchup_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matchup" ADD CONSTRAINT "Matchup_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matchup" ADD CONSTRAINT "Matchup_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RosterSlot" ADD CONSTRAINT "RosterSlot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RosterSlot" ADD CONSTRAINT "RosterSlot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeProposal" ADD CONSTRAINT "TradeProposal_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeProposal" ADD CONSTRAINT "TradeProposal_proposerTeamId_fkey" FOREIGN KEY ("proposerTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeProposal" ADD CONSTRAINT "TradeProposal_recipientTeamId_fkey" FOREIGN KEY ("recipientTeamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeProposal" ADD CONSTRAINT "TradeProposal_ownerRecordId_fkey" FOREIGN KEY ("ownerRecordId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeItem" ADD CONSTRAINT "TradeItem_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."TradeProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeItem" ADD CONSTRAINT "TradeItem_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TradeAudit" ADD CONSTRAINT "TradeAudit_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "public"."TradeProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InjuryReport" ADD CONSTRAINT "InjuryReport_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InjuryReport" ADD CONSTRAINT "InjuryReport_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
