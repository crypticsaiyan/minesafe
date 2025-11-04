-- Migration: Update embedding dimensions from 1536 to 768 for Google Gemini
-- WARNING: This will drop and recreate the table, losing all existing data

-- Drop the existing table and index
DROP TABLE IF EXISTS "documents" CASCADE;

-- Create the table with new embedding dimensions
CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768)
);

-- Create the index
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "documents" USING hnsw ("embedding" vector_cosine_ops);
