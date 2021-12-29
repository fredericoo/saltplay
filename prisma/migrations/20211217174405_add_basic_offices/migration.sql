-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Office_slug_key" ON "Office"("slug");

INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'London', 'london');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Porto', 'porto');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Lisbon', 'lisbon');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Carcavelos', 'carcavelos');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Prague', 'prague');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Budapest', 'budapest');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Croatia', 'croatia');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Slovakia', 'slovakia');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Reykjavik', 'reykjavik');
INSERT INTO "Office" (id, name, slug) VALUES (DEFAULT, 'Milton Keynes', 'milton-keynes');