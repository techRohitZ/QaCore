const axios = require('axios');
const Groq = require('groq-sdk');

// --- CONFIGURATION ---
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const LOCAL_MODEL = 'llama3.2';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * AGGRESSIVE JSON EXTRACTOR
 * Ensures that even if the AI adds "Here is your JSON:", the code still works.
 */
function extractJSON(text) {
  try {
    // 1. Clean markdown and whitespace
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 2. Use Regex to find the first '{' and last '}'
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ AI Service: JSON Extraction Failed. Raw text:", text);
    return null;
  }
}

/**
 * Main Service: Generates QA Tests
 * Now accepts 'url' and 'customPrompt' for targeted testing.
 */
exports.generateTestCases = async (url, customPrompt = "") => {
  // Build a sophisticated prompt that respects user instructions
  const focusDirective = customPrompt
    ? `SPECIFIC USER FOCUS: "${customPrompt}"`
    : `GENERAL SCAN: Provide a high-level E2E sanity check.`;

  const systemPrompt = `
    You are a Senior QA Automation Lead.
    TASK: Generate 3-5 high-value Playwright-style test scenarios for: ${url}

    GUIDELINES:
    - ${focusDirective}
    - Focus on accessibility and critical user paths.
    - You have no live DOM access. Use the user-provided requirements; do not claim to inspect the page.
    - Steps must use ONLY these exact formats: Open page; Click "accessible button name"; Fill "field label" with "value"; Verify text "exact visible text"; Verify title "exact page title".
    - Every scenario must contain at least one Verify step. Never use raw JavaScript.
    - Prefer explicit labels and expected text provided by the user. Inferred labels require human review.

    STRICT OUTPUT FORMAT (JSON ONLY):
    {
      "testCases": [
        {
          "title": "Clear scenario name",
          "steps": ["Step 1 description", "Step 2 description"],
          "expectedResult": "Success criteria",
          "priority": "HIGH|MEDIUM|LOW"
        }
      ]
    }
    DO NOT provide any text other than the JSON object.
  `;

  try {
    let rawResponse = "";

    // --- STRATEGY 1: GROQ CLOUD (High Intelligence) ---
    if (groq) {
      console.log(`⚡ [GROQ] Generating suite for: ${url}`);
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are a machine-readable JSON generator. Never output conversational text." },
            { role: "user", content: systemPrompt }
          ],
          model: GROQ_MODEL,
          temperature: 0.1, // Near-zero for strict structural adherence
        });
        rawResponse = completion.choices[0]?.message?.content || "";
      } catch (cloudErr) {
        console.error("⚠️ Groq unavailable, falling back to Local.");
      }
    }

    // --- STRATEGY 2: LOCAL OLLAMA (Privacy/Development) ---
    if (!rawResponse) {
      console.log(`💻 [OLLAMA] Generating suite for: ${url}`);
      const res = await axios.post(
        OLLAMA_URL,
        {
          model: LOCAL_MODEL,
          prompt: systemPrompt,
          stream: false,
          options: { temperature: 0.3 }
        },
        { timeout: 90000 }
      );
      rawResponse = res.data.response;
    }

    // --- PARSE & VALIDATE ---
    const parsedData = extractJSON(rawResponse);

    if (parsedData && Array.isArray(parsedData.testCases)) {
      return JSON.stringify(parsedData);
    }

    throw new Error("Invalid AI Response Structure");

  } catch (err) {
    console.error("🔥 AI Service Critical Error:", err.message);

    throw new Error('AI provider unavailable or returned invalid test cases. Please retry.');
  }
};
