import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string) {
  const input = text.replace("\n", " ");

  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(text: string[]) {
  const inputs = text.map((text) => text.replace("\n", " "));
  const batchSize = 1000; // Google API limit
  const allEmbeddings: number[][] = [];

  // Process in batches of 100
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel("text-embedding-004"),
      values: batch,
    });
    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}
