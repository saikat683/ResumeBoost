import { GoogleGenAI } from "@google/genai";

/**
 * Gemini client
 * API key MUST be in process.env.GEMINI_API_KEY
 */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Truncate resume text to avoid token overflow
 */
function truncateText(text, maxLength = 8000) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

/**
 * Extract JSON safely from Gemini output
 */
function extractJSON(text) {
  if (!text) return null;

  // Remove markdown if present
  text = text.replace(/```json|```/g, "");

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) return null;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
    return null;
  }
}

/**
 * Analyze Resume using Gemini 3 Flash Preview
 */
export async function analyzeResumeWithGeminiFlash(resumeText) {
  const prompt = `
You are a STRICT JSON API.
Return ONLY valid JSON.
No markdown.
No explanation.

Schema:
{
  "matchScore": number,
  "summary": string,
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- matchScore must be 0–100
- missingSkills must be an array
- suggestions must be an array

Resume:
${truncateText(resumeText)}
`;

  let rawText = "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // 🔑 THIS IS HOW YOU READ OUTPUT IN @google/genai
    rawText = response.text;

    console.log("🔍 RAW GEMINI RESPONSE:\n", rawText);

    const parsed = extractJSON(rawText);
    if (!parsed) throw new Error("Failed to parse Gemini JSON");

    return parsed;
  } catch (err) {
    console.error("❌ Gemini processing error:", err.message);
    console.error("🔍 Raw output:", rawText);

    return {
      matchScore: 0,
      summary: "AI response was unreadable.",
      missingSkills: [],
      suggestions: [],
    };
  }
}
