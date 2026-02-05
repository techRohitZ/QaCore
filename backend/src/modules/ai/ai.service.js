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
    - Steps must be in plain, actionable English.

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
    
    // SAFE FALLBACK: Ensuring the UI doesn't break
    return JSON.stringify({
      testCases: [
        {
          title: "Service Temporarily Unavailable",
          steps: [
            "Verify your internet connection",
            "Check if Groq API Key is active",
            "Try again with a more specific URL"
          ],
          expectedResult: "Manual verification required",
          priority: "HIGH"
        }
      ]
    });
  }
};

// const axios = require('axios');
// const Groq = require('groq-sdk');

// // --- CONFIGURATION ---
// const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
// const LOCAL_MODEL = 'llama3.2'; // Model for local fallback
// const GROQ_MODEL = 'llama-3.3-70b-versatile'; // High-intelligence model for Cloud

// // Initialize Groq Client (only if Key exists)
// const groq = process.env.GROQ_API_KEY 
//   ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
//   : null;

// /**
//  * Clean & Parse JSON from AI Response
//  * Removes markdown code blocks like ```json ... ```
//  */
// function cleanAndParseJSON(rawText) {
//   try {
//     // 1. Remove Markdown Code Blocks
//     let cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
//     // 2. Locate the first '{' and last '}' to handle extra text
//     const firstOpen = cleanText.indexOf('{');
//     const lastClose = cleanText.lastIndexOf('}');
    
//     if (firstOpen !== -1 && lastClose !== -1) {
//       cleanText = cleanText.substring(firstOpen, lastClose + 1);
//     }

//     // 3. Parse
//     return JSON.parse(cleanText);
//   } catch (err) {
//     console.error("⚠️ JSON Parsing Failed. Raw text:", rawText);
//     return null; // Signal failure
//   }
// }

// /**
//  * Main Service: Generates QA Tests
//  */
// exports.generateTestCases = async (userPrompt) => {
//   const systemPrompt = `
//     You are a Senior QA Automation Engineer.
//     Your task is to generate end-to-end test scenarios based on the user's request.

//     STRICT OUTPUT RULES:
//     1. Output MUST be valid, raw JSON only.
//     2. DO NOT use Markdown formatting.
//     3. WRITE STEPS IN PLAIN ENGLISH (e.g., "Click submit", NOT "page.click()").
//     4. Generate 3-5 high-value test cases.

//     REQUIRED JSON STRUCTURE:
//     {
//       "testCases": [
//         {
//           "title": "Short Descriptive Title",
//           "steps": ["Step 1", "Step 2", "Step 3"],
//           "expectedResult": "What should happen?",
//           "priority": "HIGH"
//         }
//       ]
//     }

//     User Request: "${userPrompt}"
//   `;

//   try {
//     let rawResponse = "";

//     // --- STRATEGY 1: GROQ CLOUD (Production/Fast) ---
//     if (groq) {
//       console.log(`⚡ AI Service: Using Groq Cloud (${GROQ_MODEL})...`);
//       try {
//         const completion = await groq.chat.completions.create({
//           messages: [
//             { role: "system", content: "You are a JSON generator. Output only valid JSON." },
//             { role: "user", content: systemPrompt }
//           ],
//           model: GROQ_MODEL,
//           temperature: 0.2, // Low temp = strict JSON
//         });
//         rawResponse = completion.choices[0]?.message?.content || "";
//       } catch (cloudErr) {
//         console.error("❌ Groq Error:", cloudErr.message);
//         console.log("🔄 Switching to Local Ollama...");
//         // If Cloud fails, fall through to Local strategy
//       }
//     }

//     // --- STRATEGY 2: LOCAL OLLAMA (Development/Offline) ---
//     // Runs if Groq is not configured OR if Groq failed above
//     if (!rawResponse) {
//       console.log(`💻 AI Service: Using Local Ollama (${LOCAL_MODEL})...`);
//       const res = await axios.post(
//         OLLAMA_URL,
//         {
//           model: LOCAL_MODEL,
//           prompt: systemPrompt,
//           stream: false,
//           options: { temperature: 0.3 }
//         },
//         { timeout: 120000 } // 2 min timeout
//       );
//       rawResponse = res.data.response;
//     }

//     // --- PARSE & VALIDATE ---
//     const parsedData = cleanAndParseJSON(rawResponse);

//     if (parsedData && parsedData.testCases) {
//       return JSON.stringify(parsedData); // Return string to match your controller expectation
//     } else {
//       throw new Error("AI returned invalid JSON structure.");
//     }

//   } catch (err) {
//     console.error("❌ AI Service Fatal Error:", err.message);
    
//     // --- FALLBACK SAFETY NET ---
//     // Returns a dummy test case so the UI doesn't crash
//     return JSON.stringify({
//       testCases: [
//         {
//           title: "⚠️ Generation Error",
//           steps: [
//             "Check server logs for details",
//             `Error: ${err.message}`,
//             "Ensure GROQ_API_KEY is valid or Ollama is running"
//           ],
//           expectedResult: "System reports error gracefully",
//           priority: "HIGH"
//         }
//       ]
//     });
//   }
// };

// // const axios = require('axios');

// // // CONFIGURATION
// // // Use 127.0.0.1 to avoid Node.js IPv6 resolution issues
// // const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
// // const MODEL = 'llama3.2'; // Ensure you have run: ollama pull llama3.2

// // /**
// //  * Low-level function to talk to Ollama
// //  */
// // async function callLLM(prompt) {
// //   try {
// //     const res = await axios.post(
// //       OLLAMA_URL,
// //       {
// //         model: MODEL,
// //         prompt: prompt,
// //         stream: false,
// //         options: {
// //           temperature: 0.3, // Lower temperature = more deterministic/valid JSON
// //           num_predict: 1500 // Limit output size to prevent timeouts
// //         }
// //       },
// //       {
// //         headers: { 'Content-Type': 'application/json' },
// //         timeout: 120000 // 2 Minutes Timeout
// //       }
// //     );
// //     return res.data;
// //   } catch (error) {
// //     if (error.code === 'ECONNREFUSED') {
// //       throw new Error(`Ollama is unreachable at ${OLLAMA_URL}. Is 'ollama serve' running?`);
// //     }
// //     throw error;
// //   }
// // }

// // /**
// //  * Main Service: Generates QA Tests
// //  */
// // async function generateTestCases(userPrompt) {
// //   console.log(`🤖 AI Service: Analyzing "${userPrompt}" with ${MODEL}...`);

// //   // --- ENGINEERED PROMPT FOR STABILITY ---
// //   // We ask for "Plain English" to prevent the AI from generating invalid JSON code snippets
// //   const systemPrompt = `
// // You are a Senior QA Automation Engineer.
// // Your task is to generate end-to-end test scenarios based on the user's request.

// // STRICT OUTPUT RULES:
// // 1. Output MUST be valid, raw JSON only.
// // 2. DO NOT use Markdown formatting (no \`\`\`json blocks).
// // 3. DO NOT include explanations or text outside the JSON.
// // 4. WRITE STEPS IN PLAIN ENGLISH. Do not write code (e.g., write "Click the submit button", NOT "page.click('#submit')").
// // 5. Avoid using double quotes (") inside the step strings. Use single quotes (') if needed.

// // REQUIRED JSON STRUCTURE:
// // {
// //   "testCases": [
// //     {
// //       "title": "Short Descriptive Title",
// //       "steps": [
// //         "Step 1 action",
// //         "Step 2 action",
// //         "Step 3 action"
// //       ],
// //       "expectedResult": "What should happen?",
// //       "priority": "HIGH"
// //     }
// //   ]
// // }

// // Analyze this request and generate 3-5 high-value test cases:
// // "${userPrompt}"
// // `;

// //   try {
// //     // 1. Attempt generation
// //     let result = await callLLM(systemPrompt);

// //     // 2. Handle "Model Loading" state (Ollama specific)
// //     if (result.done_reason === 'load' || !result.response?.trim()) {
// //       console.log("⚠️ Model was loading. Retrying request...");
// //       result = await callLLM(systemPrompt);
// //     }

// //     // 3. Validate Response
// //     if (result && result.response) {
// //       // Return the raw string. The Controller will handle the final JSON parsing.
// //       return result.response;
// //     }

// //     throw new Error("Ollama returned an empty response.");

// //   } catch (err) {
// //     console.error("❌ AI Service Error:", err.message);

// //     // 4. Fallback: Return a valid JSON string even on error
// //     // This prevents the frontend from crashing or showing "Project not found"
// //     return JSON.stringify({
// //       testCases: [
// //         {
// //           title: "⚠️ AI Generation Failed",
// //           steps: [
// //             "Check if Ollama is running in your terminal",
// //             "Verify the model 'llama3.2' is installed",
// //             `Error details: ${err.message}`
// //           ],
// //           expectedResult: "System should report the error gracefully",
// //           priority: "HIGH"
// //         }
// //       ]
// //     });
// //   }
// // }

// // module.exports = { generateTestCases };


// // // const axios = require('axios');

// // // const OLLAMA_URL = 'http://localhost:11434/api/generate';
// // // const MODEL =  'llama3.2';
// // // // const MODEL =  'phi';

// // // async function callLLM(prompt) {
// // //   const res = await axios.post(
// // //     OLLAMA_URL,
// // //     {
// // //       model: MODEL,
// // //       prompt,
// // //       stream: false
// // //     },
// // //     {
// // //       headers: { 'Content-Type': 'application/json' },
// // //       timeout: 120000
// // //     }
// // //   );

// // //   return res.data;
// // // }

// // // async function generateTestCases(userPrompt) {
// // //   console.log("Recieving prompt",userPrompt);
// // //   const basePrompt = `
// // // You are a senior QA automation engineer.

// // // Generate REALISTIC, CONTEXT-AWARE QA test cases.

// // // Rules:
// // // - Do NOT use placeholders like "Test Title" or "Step 1"
// // // - Titles must be specific to the feature
// // // - Steps must be actionable and realistic
// // // - Minimum 5 steps per test case

// // // You MUST respond with VALID JSON ONLY.
// // // If you cannot comply, return an EMPTY JSON OBJECT {}.
// // // Schema:
// // // {
// // //   "testCases": [
// // //     {
// // //       "title": "string (Specific scenario name)",
// // //       "steps": ["string (Action 1)", "string (Action 2)", "string (Action 3)"], // <--- Added specific hints here
// // //       "expectedResult": "string (Specific outcome)",
// // //       "priority": "HIGH | MEDIUM | LOW"
// // //     }
// // //   ]
// // // }

// // // Task:
// // // Analyze the request: "${userPrompt}"
// // // Return detailed, step-by-step test cases.
// // // `;

// // //   // First attempt
// // //   let result = await callLLM(basePrompt);

// // //   // Handle Ollama "load" case
// // //   if (result.done_reason === 'load' || !result.response?.trim()) {
// // //     // Retry once with stronger instruction
// // //     result = await callLLM(
// // //       basePrompt + '\nIMPORTANT: DO NOT RETURN EMPTY OUTPUT.'
// // //     );
// // //   }

// // //   // If still empty → safe fallback
// // //   if (!result.response || !result.response.trim()) {
// // //     return {
// // //       testCases: [
// // //         {
// // //           title: 'Fallback: Login functionality',
// // //           steps: [
// // //             'Open login page',
// // //             'Enter valid credentials',
// // //             'Click login button'
// // //           ],
// // //           expectedResult: 'User should be logged in successfully',
// // //           priority: 'MEDIUM'
// // //         }
// // //       ]
// // //     };
// // //   }

// // //   return result.response;
// // // }

// // // module.exports = { generateTestCases };
