const axios = require('axios');

// CONFIGURATION
// Use 127.0.0.1 to avoid Node.js IPv6 resolution issues
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'llama3.2'; // Ensure you have run: ollama pull llama3.2

/**
 * Low-level function to talk to Ollama
 */
async function callLLM(prompt) {
  try {
    const res = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature = more deterministic/valid JSON
          num_predict: 1500 // Limit output size to prevent timeouts
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000 // 2 Minutes Timeout
      }
    );
    return res.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Ollama is unreachable at ${OLLAMA_URL}. Is 'ollama serve' running?`);
    }
    throw error;
  }
}

/**
 * Main Service: Generates QA Tests
 */
async function generateTestCases(userPrompt) {
  console.log(`🤖 AI Service: Analyzing "${userPrompt}" with ${MODEL}...`);

  // --- ENGINEERED PROMPT FOR STABILITY ---
  // We ask for "Plain English" to prevent the AI from generating invalid JSON code snippets
  const systemPrompt = `
You are a Senior QA Automation Engineer.
Your task is to generate end-to-end test scenarios based on the user's request.

STRICT OUTPUT RULES:
1. Output MUST be valid, raw JSON only.
2. DO NOT use Markdown formatting (no \`\`\`json blocks).
3. DO NOT include explanations or text outside the JSON.
4. WRITE STEPS IN PLAIN ENGLISH. Do not write code (e.g., write "Click the submit button", NOT "page.click('#submit')").
5. Avoid using double quotes (") inside the step strings. Use single quotes (') if needed.

REQUIRED JSON STRUCTURE:
{
  "testCases": [
    {
      "title": "Short Descriptive Title",
      "steps": [
        "Step 1 action",
        "Step 2 action",
        "Step 3 action"
      ],
      "expectedResult": "What should happen?",
      "priority": "HIGH"
    }
  ]
}

Analyze this request and generate 3-5 high-value test cases:
"${userPrompt}"
`;

  try {
    // 1. Attempt generation
    let result = await callLLM(systemPrompt);

    // 2. Handle "Model Loading" state (Ollama specific)
    if (result.done_reason === 'load' || !result.response?.trim()) {
      console.log("⚠️ Model was loading. Retrying request...");
      result = await callLLM(systemPrompt);
    }

    // 3. Validate Response
    if (result && result.response) {
      // Return the raw string. The Controller will handle the final JSON parsing.
      return result.response;
    }

    throw new Error("Ollama returned an empty response.");

  } catch (err) {
    console.error("❌ AI Service Error:", err.message);

    // 4. Fallback: Return a valid JSON string even on error
    // This prevents the frontend from crashing or showing "Project not found"
    return JSON.stringify({
      testCases: [
        {
          title: "⚠️ AI Generation Failed",
          steps: [
            "Check if Ollama is running in your terminal",
            "Verify the model 'llama3.2' is installed",
            `Error details: ${err.message}`
          ],
          expectedResult: "System should report the error gracefully",
          priority: "HIGH"
        }
      ]
    });
  }
}

module.exports = { generateTestCases };


// const axios = require('axios');

// const OLLAMA_URL = 'http://localhost:11434/api/generate';
// const MODEL =  'llama3.2';
// // const MODEL =  'phi';

// async function callLLM(prompt) {
//   const res = await axios.post(
//     OLLAMA_URL,
//     {
//       model: MODEL,
//       prompt,
//       stream: false
//     },
//     {
//       headers: { 'Content-Type': 'application/json' },
//       timeout: 120000
//     }
//   );

//   return res.data;
// }

// async function generateTestCases(userPrompt) {
//   console.log("Recieving prompt",userPrompt);
//   const basePrompt = `
// You are a senior QA automation engineer.

// Generate REALISTIC, CONTEXT-AWARE QA test cases.

// Rules:
// - Do NOT use placeholders like "Test Title" or "Step 1"
// - Titles must be specific to the feature
// - Steps must be actionable and realistic
// - Minimum 5 steps per test case

// You MUST respond with VALID JSON ONLY.
// If you cannot comply, return an EMPTY JSON OBJECT {}.
// Schema:
// {
//   "testCases": [
//     {
//       "title": "string (Specific scenario name)",
//       "steps": ["string (Action 1)", "string (Action 2)", "string (Action 3)"], // <--- Added specific hints here
//       "expectedResult": "string (Specific outcome)",
//       "priority": "HIGH | MEDIUM | LOW"
//     }
//   ]
// }

// Task:
// Analyze the request: "${userPrompt}"
// Return detailed, step-by-step test cases.
// `;

//   // First attempt
//   let result = await callLLM(basePrompt);

//   // Handle Ollama "load" case
//   if (result.done_reason === 'load' || !result.response?.trim()) {
//     // Retry once with stronger instruction
//     result = await callLLM(
//       basePrompt + '\nIMPORTANT: DO NOT RETURN EMPTY OUTPUT.'
//     );
//   }

//   // If still empty → safe fallback
//   if (!result.response || !result.response.trim()) {
//     return {
//       testCases: [
//         {
//           title: 'Fallback: Login functionality',
//           steps: [
//             'Open login page',
//             'Enter valid credentials',
//             'Click login button'
//           ],
//           expectedResult: 'User should be logged in successfully',
//           priority: 'MEDIUM'
//         }
//       ]
//     };
//   }

//   return result.response;
// }

// module.exports = { generateTestCases };
