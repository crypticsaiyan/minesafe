import fs from 'fs';
import path from 'path';
import pg from 'pg';
import pgvector from 'pgvector/pg';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---

// Load from environment variables
// export GEMINI_API_KEY="your_gemini_api_key"
// export NEON_DB_CONNECTION_STRING="your_neon_postgres_connection_string"
const NEON_DB_CONNECTION_STRING = "postgresql://neondb_owner:npg_mcUut3XVH9Fn@ep-muddy-band-a1b1ite9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const GEMINI_API_KEY = "AIzaSyA05Jjc60wUPqPf-DB_q-SrAuYBUA37cqY"
// const { GEMINI_API_KEY, NEON_DB_CONNECTION_STRING } = process.env;
const JSON_FILE_NAME = "accident_data.json";
const EMBEDDING_MODEL = "embedding-001"; // This model generates 768-dimension vectors
const DB_TABLE_NAME = "public";

// --- Utility Functions ---

// --- Utility Functions ---

/**
 * A simple promise-based sleep function.
 * @param {number} ms - The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates an embedding for a given text using the Gemini API.
 * Includes simple exponential backoff for retries.
 * @param {GoogleGenerativeAI.GenerativeModel} model - The Gemini model instance.
 * @param {string} textToEmbed - The text to embed.
 * @returns {Promise<number[]|null>} The embedding array or null if failed.
 */
async function generateEmbedding(model, textToEmbed) {
	let delay = 1000; // Initial delay in milliseconds
	for (let i = 0; i < 5; i++) { // Try up to 5 times
		try {
			const result = await model.embedContent(
				textToEmbed,
				"RETRIEVAL_DOCUMENT"
			);
			const embedding = result.embedding;
			return embedding.values; // Returns the number array
		} catch (e) {
			console.error(`Error generating embedding: ${e.message}. Retrying in ${delay / 1000}s...`);
			await sleep(delay);
			delay *= 2; // Exponential backoff
		}
	}
	console.error(`Failed to generate embedding for text after 5 attempts: ${textToEmbed.substring(0, 50)}...`);
	return null;
}

/**
 * Creates a single, descriptive text block ("chunk") for an accident.
 * This replaces `chunkContent` from your example.
 * @param {object} accidentData - The accident data object.
 * @param {string} accidentType - The type of accident ("fatal_2015" or "major_historical").
 * @returns {string} A formatted text block.
 */
function formatAccidentText(accidentData, accidentType = "fatal_2015") {
	if (accidentType === "fatal_2015") {
		const victims = accidentData.victims || [];
		const victimsStr = victims.map(v => `${v.role} ${v.name} (Age ${v.age})`).join(", ");
		return (
			`Fatal Accident Report (2015): \n` +
			`Mine: ${accidentData.mine_name || 'N/A'} (Owner: ${accidentData.owner || 'N/A'}) \n` +
			`Location: ${accidentData.location?.district || 'N/A'}, ${accidentData.location?.state || 'N/A'} \n` +
			`Date: ${accidentData.date || 'N/A'} at ${accidentData.time || 'N/A'} \n` +
			`Cause: ${accidentData.cause_category || 'N/A'} - ${accidentData.cause_specific || 'N/A'} (Code: ${accidentData.cause_code || 'N/A'}) \n` +
			`Victims: ${victimsStr} \n` +
			`Description: ${accidentData.description || 'N/A'} \n` +
			`Findings: ${accidentData.avertable_factors || 'N/A'}`
		);
	} else if (accidentType === "major_historical") {
		return (
			`Major Historical Accident Report: \n` +
			`Mine: ${accidentData.mine_name || 'N/A'} \n` +
			`Date: ${accidentData.date || 'N/A'} \n` +
			`Cause: ${accidentData.cause || 'N/A'} \n` +
			`Casualties: ${accidentData.killed || 0} killed, ${accidentData.seriously_injured || 0} seriously injured.`
		);
	}
	return "";
}

/**
 * Ensures the pgvector extension is enabled and the accidents table exists.
 * @param {pg.Client} client - The Postgres client.
 */
async function setupDatabase(client) {
	console.log("Setting up database...");

	// Register the pgvector type with the client
	await pgvector.registerType(client);

	// 1. Enable the pgvector extension
	await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

	// 2. Create the table
	const tableCreateQuery = `
    CREATE TABLE IF NOT EXISTS ${DB_TABLE_NAME} (
        id SERIAL PRIMARY KEY,
        accident_id VARCHAR(50),
        accident_type VARCHAR(50),
        mine_name VARCHAR(255),
        date VARCHAR(50),
        cause_specific VARCHAR(255),
        content TEXT,
        embedding vector(768)
    );
    `;
	await client.query(tableCreateQuery);

	// 3. Create an index
	// *** FIX: Added an index name 'mine_accidents_embedding_idx' ***
	// The 'IF NOT EXISTS' clause requires an index name.
	const indexCreateQuery = `
    CREATE INDEX IF NOT EXISTS mine_accidents_embedding_idx ON ${DB_TABLE_NAME} 
    USING ivfflat (embedding vector_l2_ops) 
    WITH (lists = 100);
    `;
	await client.query(indexCreateQuery);

	console.log(`Database setup complete (extension, table '${DB_TABLE_NAME}', and index).`);
}

/**
 * Main function.
 */
async function main() {
	// --- 1. Check Prerequisites ---
	if (!GEMINI_API_KEY) {
		console.error("Error: GEMINI_API_KEY environment variable not set.");
		return;
	}
	if (!NEON_DB_CONNECTION_STRING) {
		console.error("Error: NEON_DB_CONNECTION_STRING environment variable not set.");
		return;
	}

	// --- 2. Configure Clients ---
	const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
	const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

	const { Pool } = pg;
	const pool = new Pool({ connectionString: NEON_DB_CONNECTION_STRING });
	pool.on('error', (err) => console.error('Unexpected error on idle client', err));

	// --- 3. Load Data from JSON file ---
	let allAccidentData;
	try {
		const filePath = path.resolve(process.cwd(), JSON_FILE_NAME);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		allAccidentData = JSON.parse(fileContent);
		console.log(`Successfully loaded data from ${JSON_FILE_NAME}.`);
	} catch (e) {
		if (e.code === 'ENOENT') {
			console.error(`Error: The file ${JSON_FILE_NAME} was not found.`);
		} else if (e instanceof SyntaxError) {
			console.error(`Error: Could not decode JSON from ${JSON_FILE_NAME}.`);
		} else {
			console.error(e.message);
		}
		return;
	}

	// --- 4. Connect to DB and Setup ---
	const client = await pool.connect();
	try {
		await setupDatabase(client);

		// --- 5. Process and Insert Data ---
		const fatalAccidents = allAccidentData.fatal_accidents_2015 || [];
		const majorAccidents = allAccidentData.major_accidents_1901_2015 || [];

		const accidentsToProcess = [
			...fatalAccidents.map(acc => ({ data: acc, type: "fatal_2015" })),
			...majorAccidents.map(acc => ({ data: acc, type: "major_historical" }))
		];

		const totalAccidents = accidentsToProcess.length;
		console.log(`Found ${totalAccidents} total accidents to process.`);

		let recordsToInsert = [];
		for (let i = 0; i < totalAccidents; i++) {
			const { data: accident, type: accType } = accidentsToProcess[i];

			// Create the text block to embed (the "chunk")
			const contentToEmbed = formatAccidentText(accident, accType);

			// Generate the embedding
			console.log(`Processing accident ${i + 1} of ${totalAccidents}...`);
			const embedding = await generateEmbedding(embeddingModel, contentToEmbed);

			if (embedding) {
				// Prepare data for insertion
				let acc_id, mine, date, cause;
				if (accType === "fatal_2015") {
					acc_id = `2015_${accident.accident_number || 'N/A'}`;
					mine = accident.mine_name || 'N/A';
					date = accident.date || 'N/A';
					cause = accident.cause_specific || 'N/A';
				} else { // major_historical
					acc_id = `hist_${accident.sl_no || 'N/A'}`;
					mine = accident.mine_name || 'N/A';
					date = accident.date || 'N/A';
					cause = accident.cause || 'N/A';
				}

				recordsToInsert.push({
					acc_id,
					acc_type: accType,
					mine,
					date,
					cause,
					content: contentToEmbed,
					embedding
				});
				console.log(`Successfully embedded: ${acc_id} - ${mine}`);
			}

			// IMPORTANT: Respect API rate limits (60 QPM)
			await sleep(1100); // Wait 1.1 seconds to be safe
		}

		// Insert all records into the database
		console.log(`\nUploading ${recordsToInsert.length} records to the database...`);
		const insertQuery = `
        INSERT INTO ${DB_TABLE_NAME} 
        (accident_id, accident_type, mine_name, date, cause_specific, content, embedding)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
        `;

		// Use a transaction for bulk insert
		await client.query('BEGIN');
		for (const record of recordsToInsert) {
			await client.query(insertQuery, [
				record.acc_id,
				record.acc_type,
				record.mine,
				record.date,
				record.cause,
				record.content,
				pgvector.toSql(record.embedding) // Use pgvector helper
			]);
		}
		await client.query('COMMIT');

		console.log(`\n--- Processing complete! ---`);
		console.log(`Successfully inserted ${recordsToInsert.length} searchable chunks.`);

	} catch (e) {
		await client.query('ROLLBACK');
		console.error(`Error during database operation: ${e.message}`);
	} finally {
		client.release();
		await pool.end();
		console.log("PostgreSQL connection closed.");
	}
}

// Check for prerequisites and run main
if (!GEMINI_API_KEY || !NEON_DB_CONNECTION_STRING) {
	console.error("Please set GEMINI_API_KEY and NEON_DB_CONNECTION_STRING environment variables.");
} else {
	main().catch(console.error);
}
