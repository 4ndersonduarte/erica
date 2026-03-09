-- CreateTable
CREATE TABLE "HomeVideo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeVideo_pkey" PRIMARY KEY ("id")
);

-- RLS
ALTER TABLE "HomeVideo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for HomeVideo"
  ON "HomeVideo"
  FOR ALL
  USING (true)
  WITH CHECK (true);
