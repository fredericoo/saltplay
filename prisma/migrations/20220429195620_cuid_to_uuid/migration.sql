UPDATE "User" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Account" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Session" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Match" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Game" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Office" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "PlayerScore" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
UPDATE "Feedback" SET "id" = md5(random()::text || clock_timestamp()::text)::uuid;
