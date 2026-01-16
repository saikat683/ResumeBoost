const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const modelId = "models/gemini-2.5-flash";
const modelId = "models/gemini-1.5-pro";


function truncateText(text, maxLength = 12000) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function extractJSON(text) {
  try {
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

const analyzeResumeWithGeminiFlash = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
You are an API that ONLY outputs valid JSON.

{
  "matchScore": number,
  "summary": string,
  "missingSkills": string[],
  "suggestions": string[]
}

Resume:
${truncateText(resumeText)}
`;

  let rawText = "";

  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();

    if (!rawText || rawText.trim() === "") {
      throw new Error("Empty Gemini response");
    }

    const parsed = extractJSON(rawText);
    if (!parsed) throw new Error("JSON parse failed");

    return parsed;
  } catch {
    return {
      matchScore: 0,
      summary: "AI response was unreadable.",
      missingSkills: [],
      suggestions: [],
    };
  }
};

module.exports = { analyzeResumeWithGeminiFlash };
