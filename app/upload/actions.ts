"use server";

import { PDFParse } from "pdf-parse";
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const pdfParse = new PDFParse({ data: buffer });
    const result = await pdfParse.getText();
    const text = result.text;

    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: "No text in PDF",
      };
    }

    const chunks = await chunkContent(text);
    const embeddings = await generateEmbeddings(chunks);
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    await db.insert(documents).values(records);
    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("PDF processing error", error);
    return {
      success: false,
      error: "Failed to process the given PDF",
    };
  }
}
