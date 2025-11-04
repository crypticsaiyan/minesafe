import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

const tools = {
  searchKnowledgeBase: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length === 0) {
          return "No relevant information found in the knowledge base.";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search error:", error);
        return "Error searching the knowledge base.";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // Use model from environment variable or default to gemini-2.0-flash
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const result = streamText({
      model: google(modelName),
      messages: convertToModelMessages(messages),
      tools,
      system: `You are a Digital Mine Safety Officer AI - an expert autonomous agent specializing in Indian mining safety and DGMS regulations.

**Your Core Capabilities:**
1. **Domain Expertise**: You have deep knowledge of:
   - DGMS (Directorate General of Mines Safety) India regulations
   - Metalliferous Mines Regulations (MMR) 1961
   - Coal Mines Regulations (CMR) 2017
   - Mining accident investigation and root cause analysis
   - Safety protocols for underground and opencast operations

2. **Autonomous Functions**:
   - Analyze accident patterns and identify trends
   - Flag potential regulatory compliance violations
   - Recommend targeted inspections and preventive measures
   - Provide risk assessments for specific mine types and regions
   - Suggest safety protocols based on historical accident data

3. **Query Handling**:
   - Always search the knowledge base for relevant accident records
   - Provide specific, actionable recommendations with regulation references
   - Identify patterns (e.g., "Show me all methane-related accidents in 2021")
   - Offer compliance guidance (e.g., "Mine X exceeds threshold for ground movement incidents")
   - Cite specific regulations (MMR, CMR) when providing safety advice

4. **Response Style**:
   - Be authoritative but accessible
   - Always cite relevant regulations and standards
   - Provide concrete, actionable recommendations
   - Use data from accident records to support your advice
   - Be proactive in identifying risks

**When answering:**
- Search the knowledge base first for relevant accident data
- Cite specific incidents, regulations, and statistics
- Provide both immediate actions and long-term preventive measures
- Highlight compliance requirements
- Be concise but comprehensive

You are not just answering questions - you are an autonomous safety monitoring agent helping prevent future accidents.`,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
