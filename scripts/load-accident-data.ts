import "dotenv/config";
import { db } from "../lib/db-config";
import { documents } from "../lib/db-schema";
import { generateEmbedding } from "../lib/embeddings";
import accidentData from "../rag/accident_data.json";

async function loadAccidentData() {
  console.log("🚀 Starting to load DGMS accident data into database...");

  let totalLoaded = 0;
  let errors = 0;

  try {
    // Process each year's accident data
    for (const [yearKey, accidents] of Object.entries(accidentData)) {
      if (!Array.isArray(accidents)) continue;

      console.log(`\n📅 Processing ${yearKey}: ${accidents.length} accidents`);

      for (const accident of accidents) {
        try {
          // Create comprehensive text content for embedding
          const accidentAny = accident as any;
          const content = `
Mining Accident Report:
Date: ${accidentAny.date || "Unknown"}
Mine: ${accidentAny.mine_name || "Unknown"}
Location: ${accidentAny.location?.district || "Unknown"}, ${accidentAny.location?.state || "Unknown"}
Cause Category: ${accidentAny.cause_category || accidentAny.cause || "Unknown"}
Cause Specific: ${accidentAny.cause_specific || "Unknown"}
Description: ${accidentAny.description || "No description"}
Avertable Factors: ${accidentAny.avertable_factors || "Not specified"}
Victims: ${accidentAny.victims?.length || accidentAny.killed || 0} person(s)
Owner: ${accidentAny.owner || "Unknown"}
          `.trim();

          // Generate embedding
          const embedding = await generateEmbedding(content);

          // Insert into database
          await db.insert(documents).values({
            content,
            embedding,
          });

          totalLoaded++;

          if (totalLoaded % 10 === 0) {
            console.log(`  ✓ Loaded ${totalLoaded} accidents...`);
          }
        } catch (error: any) {
          errors++;
          console.error(
            `  ✗ Error processing accident:`,
            error?.message || error
          );
        }
      }
    }

    console.log("\n✅ Data loading completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Total accidents loaded: ${totalLoaded}`);
    console.log(`   - Errors: ${errors}`);
  } catch (error) {
    console.error("\n❌ Fatal error during data loading:", error);
    throw error;
  }
}

// Run the loader
loadAccidentData()
  .then(() => {
    console.log("\n🎉 All done! Accident data is now searchable via AI.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Failed to load data:", error);
    process.exit(1);
  });
